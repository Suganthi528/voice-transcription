const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use('/static', express.static('public'));

// Create directories if they don't exist
const requiredDirs = ['uploads', 'public'];
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

const upload = multer({ dest: "uploads/" });

// Store connected clients and rooms
const rooms = new Map();
const clients = new Map();

// Room password validation
function validateRoomPassword(roomId, password) {
  const room = rooms.get(roomId);
  if (!room) return false;
  return room.password === password;
}

// Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Multi-User Live Video/Audio Translation Server is running',
    timestamp: new Date().toISOString(),
    rooms: rooms.size,
    connectedClients: clients.size
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// WebSocket for real-time communication
wss.on('connection', (ws) => {
  console.log('Client connected for real-time translation');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'join-room') {
        // Join a translation room with password validation
        joinRoom(ws, data.roomId, data.userId, data.userName, data.password, data.language);
      } else if (data.type === 'audio-chunk') {
        // Process audio chunk and broadcast to room
        if (data.roomId) {
          await processAudioChunkForRoom(data.audioData, data.targetLang, data.roomId, ws);
        } else {
          await processAudioChunk(data.audioData, data.targetLang, ws);
        }
      } else if (data.type === 'leave-room') {
        // Leave the current room
        leaveRoom(ws);
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
    leaveRoom(ws);
  });
});

function joinRoom(ws, roomId, userId, userName, password, language) {
  // Check if room exists
  if (!rooms.has(roomId)) {
    ws.send(JSON.stringify({
      type: 'join-error',
      message: 'Room does not exist'
    }));
    return;
  }

  // Validate password
  if (!validateRoomPassword(roomId, password)) {
    ws.send(JSON.stringify({
      type: 'join-error',
      message: 'Invalid room password'
    }));
    return;
  }

  // Leave current room if any
  leaveRoom(ws);
  
  // Add client to room
  const room = rooms.get(roomId);
  room.clients.set(ws, {
    userId: userId,
    userName: userName,
    language: language,
    joinedAt: Date.now()
  });
  
  // Store client reference
  clients.set(ws, { roomId, userId, userName, language });
  
  console.log(`User ${userName} (${userId}) joined room ${roomId} with language ${language}`);
  
  // Notify client of successful join
  ws.send(JSON.stringify({
    type: 'room-joined',
    roomId: roomId,
    userId: userId,
    userName: userName,
    connectedUsers: Array.from(room.clients.values()).map(client => ({
      userId: client.userId,
      userName: client.userName,
      language: client.language
    }))
  }));
  
  // Notify other clients in the room
  broadcastToRoom(roomId, {
    type: 'user-joined',
    userId: userId,
    userName: userName,
    language: language
  }, ws);
}

function leaveRoom(ws) {
  const clientInfo = clients.get(ws);
  if (!clientInfo) return;
  
  const { roomId, userId, userName } = clientInfo;
  const room = rooms.get(roomId);
  
  if (room) {
    room.clients.delete(ws);
    
    // Notify other clients
    broadcastToRoom(roomId, {
      type: 'user-left',
      userId: userId,
      userName: userName
    }, ws);
    
    // Remove empty rooms
    if (room.clients.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} deleted (empty)`);
    }
  }
  
  clients.delete(ws);
  console.log(`User ${userName} (${userId}) left room ${roomId}`);
}

function broadcastToRoom(roomId, message, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;
  
  const messageStr = JSON.stringify(message);
  room.clients.forEach((clientInfo, clientWs) => {
    if (clientWs !== excludeWs && clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(messageStr);
    }
  });
}

async function processAudioChunkForRoom(audioData, targetLang, roomId, senderWs) {
  const timestamp = Date.now();
  const audioPath = `uploads/room_chunk_${timestamp}.webm`;
  
  // Save audio chunk
  const buffer = Buffer.from(audioData, 'base64');
  fs.writeFileSync(audioPath, buffer);
  
  const senderInfo = clients.get(senderWs);
  if (!senderInfo) return;
  
  // Process through pipeline
  exec(`python python/transcribe.py ${audioPath}`, (err, transcribedText) => {
    if (err || transcribedText.includes('service error') || transcribedText.includes('internet')) {
      console.log('Online STT failed, trying offline fallback...');
      exec(`python python/transcribe_offline.py ${audioPath}`, (err2, fallbackText) => {
        if (!err2) {
          continueProcessingForRoom(fallbackText.trim(), targetLang, roomId, senderWs, timestamp, audioPath);
        }
      });
    } else {
      const cleanText = transcribedText.trim();
      if (cleanText && !cleanText.includes('Could not understand audio')) {
        continueProcessingForRoom(cleanText, targetLang, roomId, senderWs, timestamp, audioPath);
      }
    }
  });
}

function continueProcessingForRoom(cleanText, targetLang, roomId, senderWs, timestamp, audioPath) {
  const senderInfo = clients.get(senderWs);
  
  // Send transcription to sender
  senderWs.send(JSON.stringify({ 
    type: 'stt-result', 
    text: cleanText,
    timestamp,
    fromUser: senderInfo.userId,
    fromUserName: senderInfo.userName
  }));
  
  // Translation step
  exec(`python python/translate.py "${cleanText}" ${targetLang}`, (err, translatedText) => {
    if (err) {
      console.error('Translation error:', err.message);
      return;
    }
    
    const cleanTranslation = translatedText.trim();
    
    // Send translation to sender
    senderWs.send(JSON.stringify({ 
      type: 'translation-result', 
      originalText: cleanText,
      translatedText: cleanTranslation,
      targetLang,
      timestamp,
      fromUser: senderInfo.userId,
      fromUserName: senderInfo.userName
    }));
    
    // TTS step
    const outputPath = `public/room_audio_${roomId}_${timestamp}.wav`;
    exec(`python python/synthesize.py "${cleanTranslation}" ${targetLang} ${outputPath}`, (err) => {
      if (err) {
        console.error('TTS error:', err.message);
        return;
      }
      
      // Broadcast translated audio to all clients in the room
      broadcastToRoom(roomId, {
        type: 'translated-audio',
        audioUrl: `/static/room_audio_${roomId}_${timestamp}.wav`,
        originalText: cleanText,
        translatedText: cleanTranslation,
        targetLang: targetLang,
        fromUser: senderInfo.userId,
        fromUserName: senderInfo.userName,
        timestamp
      });
      
      // Cleanup old files
      setTimeout(() => {
        try {
          fs.unlinkSync(audioPath);
          fs.unlinkSync(outputPath);
        } catch (e) {}
      }, 60000); // Keep files for 1 minute
    });
  });
}

async function processAudioChunk(audioData, targetLang, ws) {
  const timestamp = Date.now();
  const audioPath = `uploads/chunk_${timestamp}.webm`;
  
  // Save audio chunk
  const buffer = Buffer.from(audioData, 'base64');
  fs.writeFileSync(audioPath, buffer);
  
  // Process through pipeline
  exec(`python python/transcribe.py ${audioPath}`, (err, transcribedText) => {
    if (err) {
      ws.send(JSON.stringify({ type: 'error', step: 'STT', message: err.message }));
      return;
    }
    
    const cleanText = transcribedText.trim();
    if (!cleanText) return;
    
    ws.send(JSON.stringify({ 
      type: 'stt-result', 
      text: cleanText,
      timestamp 
    }));
    
    // Translation step
    exec(`python python/translate.py "${cleanText}" ${targetLang}`, (err, translatedText) => {
      if (err) {
        ws.send(JSON.stringify({ type: 'error', step: 'Translation', message: err.message }));
        return;
      }
      
      const cleanTranslation = translatedText.trim();
      ws.send(JSON.stringify({ 
        type: 'translation-result', 
        originalText: cleanText,
        translatedText: cleanTranslation,
        targetLang,
        timestamp 
      }));
      
      // TTS step
      const outputPath = `public/audio_${timestamp}.wav`;
      exec(`python python/synthesize.py "${cleanTranslation}" ${targetLang} ${outputPath}`, (err) => {
        if (err) {
          ws.send(JSON.stringify({ type: 'error', step: 'TTS', message: err.message }));
          return;
        }
        
        ws.send(JSON.stringify({ 
          type: 'audio-ready', 
          audioUrl: `/static/audio_${timestamp}.wav`,
          originalText: cleanText,
          translatedText: cleanTranslation,
          timestamp 
        }));
        
        // Cleanup old files
        setTimeout(() => {
          try {
            fs.unlinkSync(audioPath);
            fs.unlinkSync(outputPath);
          } catch (e) {}
        }, 30000);
      });
    });
  });
}

// Room management endpoints
app.get("/rooms", (req, res) => {
  const roomList = Array.from(rooms.entries()).map(([roomId, room]) => ({
    roomId,
    userCount: room.clients.size,
    hasPassword: !!room.password,
    users: Array.from(room.clients.values()).map(client => ({
      userId: client.userId,
      userName: client.userName,
      language: client.language
    }))
  }));
  
  res.json({ rooms: roomList });
});

app.post("/create-room", (req, res) => {
  const { roomName, password, creatorName } = req.body;
  const roomId = roomName || `room_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  
  // Check if room already exists
  if (rooms.has(roomId)) {
    return res.status(400).json({ error: "Room already exists" });
  }
  
  rooms.set(roomId, {
    clients: new Map(),
    messages: [],
    password: password || '',
    createdAt: Date.now(),
    createdBy: creatorName || 'Anonymous'
  });
  
  console.log(`Room created: ${roomId} by ${creatorName || 'Anonymous'}`);
  res.json({ 
    roomId, 
    message: "Room created successfully",
    hasPassword: !!password
  });
});

// Real-time speech translation pipeline
app.post("/translate-speech", upload.single("audio"), (req, res) => {
  const { targetLang = 'ta' } = req.body;
  const audioPath = req.file.path;
  
  // Step 1: Speech-to-Text
  exec(`python python/transcribe.py ${audioPath}`, (err, transcribedText) => {
    if (err) return res.status(500).json({ error: "STT error", details: err.message });
    
    const cleanText = transcribedText.trim();
    if (!cleanText) return res.status(400).json({ error: "No speech detected" });
    
    // Step 2: Translation
    exec(`python python/translate.py "${cleanText}" ${targetLang}`, (err, translatedText) => {
      if (err) return res.status(500).json({ error: "Translation error", details: err.message });
      
      const cleanTranslation = translatedText.trim();
      
      // Step 3: Text-to-Speech with target language
      exec(`python python/synthesize.py "${cleanTranslation}" ${targetLang}`, (err) => {
        if (err) return res.status(500).json({ error: "TTS error", details: err.message });
        
        // Return complete pipeline result
        res.json({
          originalText: cleanText,
          translatedText: cleanTranslation,
          targetLanguage: targetLang,
          audioReady: true
        });
      });
    });
  });
});

// Get the generated audio file
app.get("/audio", (req, res) => {
  res.sendFile(__dirname + "/output.wav");
});

// Individual endpoints for testing
app.post("/stt", upload.single("audio"), (req, res) => {
  exec(`python python/transcribe.py ${req.file.path}`, (err, out) => {
    if (err) return res.status(500).send("STT error");
    res.json({ text: out.trim() });
  });
});

app.post("/translate", (req, res) => {
  const { text, targetLang } = req.body;
  console.log(`Translation request: "${text}" -> ${targetLang}`);
  
  exec(`python python/translate.py "${text}" ${targetLang}`, { encoding: 'utf8' }, (err, out, stderr) => {
    if (err) {
      console.error('Translation Error:', err.message);
      console.error('Translation Stderr:', stderr);
      return res.status(500).json({ error: "Translation error", details: err.message });
    }
    
    const translatedText = out.trim();
    console.log(`Translation result: "${translatedText}"`);
    res.json({ translatedText: translatedText });
  });
});

app.post("/tts", (req, res) => {
  const { text, language = 'en' } = req.body;
  console.log(`TTS request: "${text}" in ${language}`);
  
  exec(`python python/synthesize.py "${text}" ${language}`, (err, stdout, stderr) => {
    if (err) {
      console.error('TTS Error:', err.message);
      console.error('TTS Stderr:', stderr);
      return res.status(500).json({ error: "TTS error", details: err.message });
    }
    
    console.log('TTS completed, sending audio file');
    res.sendFile(__dirname + "/output.wav");
  });
});

// Live video/audio translation endpoint
app.post("/live-translate", upload.single("audio"), (req, res) => {
  const { targetLang = 'ta', videoTimestamp } = req.body;
  const audioPath = req.file.path;
  
  console.log(`Processing audio file: ${audioPath}, target: ${targetLang}`);
  
  // Step 1: Speech-to-Text
  exec(`python python/transcribe.py ${audioPath}`, (err, transcribedText, stderr) => {
    if (err || transcribedText.includes('service error') || transcribedText.includes('internet')) {
      console.log('Online STT failed, trying offline fallback...');
      // Fallback to offline transcription for testing
      exec(`python python/transcribe_offline.py ${audioPath}`, (err2, fallbackText) => {
        if (err2) {
          console.error('Both STT methods failed:', err.message, err2.message);
          return res.status(500).json({ error: "STT error", details: "Both online and offline STT failed" });
        }
        
        const cleanText = fallbackText.trim();
        console.log(`Using fallback transcription: "${cleanText}"`);
        
        // Continue with translation...
        continueWithTranslation(cleanText, targetLang, videoTimestamp, res);
      });
    } else {
      const cleanText = transcribedText.trim();
      console.log(`Transcribed text: "${cleanText}"`);
      
      if (!cleanText || cleanText.includes('Could not understand audio')) {
        return res.status(400).json({ error: "No speech detected or audio unclear" });
      }
      
      continueWithTranslation(cleanText, targetLang, videoTimestamp, res);
    }
  });
});

function continueWithTranslation(cleanText, targetLang, videoTimestamp, res) {
  // Step 2: Translation
  exec(`python python/translate.py "${cleanText}" ${targetLang}`, (err, translatedText, stderr) => {
    if (err) {
      console.error('Translation Error:', err.message);
      console.error('Translation Stderr:', stderr);
      return res.status(500).json({ error: "Translation error", details: err.message, stderr: stderr });
    }
    
    const cleanTranslation = translatedText.trim();
    console.log(`Translated text: "${cleanTranslation}"`);
    
    // Step 3: Text-to-Speech with target language
    const outputFile = `public/live_audio_${Date.now()}.wav`;
    exec(`python python/synthesize.py "${cleanTranslation}" ${targetLang} ${outputFile}`, (err, stdout, stderr) => {
      if (err) {
        console.error('TTS Error:', err.message);
        console.error('TTS Stderr:', stderr);
        return res.status(500).json({ error: "TTS error", details: err.message, stderr: stderr });
      }
      
      console.log(`Audio generated: ${outputFile}`);
      
      // Return complete pipeline result with video sync
      res.json({
        originalText: cleanText,
        translatedText: cleanTranslation,
        targetLanguage: targetLang,
        audioUrl: `/${outputFile}`,
        videoTimestamp: videoTimestamp,
        processingTime: Date.now(),
        audioReady: true
      });
    });
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Multi-User Live Video/Audio Translation Server running on port ${PORT}`)
);