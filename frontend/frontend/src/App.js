import React, { useState, useRef, useEffect } from "react";

function App() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [audio, setAudio] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("ta");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  
  // Multi-user room states
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [roomMessages, setRoomMessages] = useState([]);
  const [joinError, setJoinError] = useState("");
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);

  const languages = {
    ta: "Tamil (தமிழ்)",
    hi: "Hindi (हिन्दी)",
    te: "Telugu (తెలుగు)",
    kn: "Kannada (ಕನ್ನಡ)",
    ml: "Malayalam (മലയാളം)",
    es: "Spanish",
    fr: "French", 
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese"
  };

  useEffect(() => {
    // Generate random user ID
    setUserId(`user_${Math.random().toString(36).substr(2, 9)}`);
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const createRoom = async () => {
    if (!userName.trim()) {
      alert("Please enter your name first");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: roomId.trim() || undefined,
          password: roomPassword.trim() || undefined,
          creatorName: userName.trim()
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setRoomId(result.roomId);
        alert(`Room created successfully!\n\nRoom ID: ${result.roomId}\n${result.hasPassword ? 'Password: ' + roomPassword : 'No password required'}\n\nShare these details with others to join.`);
      } else {
        alert("Failed to create room: " + result.error);
      }
    } catch (error) {
      alert("Failed to create room: " + error.message);
    }
  };

  const joinRoom = async () => {
    if (!roomId.trim() || !userId.trim() || !userName.trim()) {
      alert("Please enter Room ID and your name");
      return;
    }

    setJoinError("");

    try {
      // Setup WebSocket connection
      wsRef.current = new WebSocket('ws://localhost:5000');
      
      wsRef.current.onopen = () => {
        console.log('Connected to translation server');
        
        // Join the room with password
        wsRef.current.send(JSON.stringify({
          type: 'join-room',
          roomId: roomId.trim(),
          userId: userId,
          userName: userName.trim(),
          password: roomPassword.trim(),
          language: targetLanguage
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('Failed to connect to translation server');
      };
      
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room: ' + error.message);
    }
  };

  const leaveRoom = () => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'leave-room'
      }));
      wsRef.current.close();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsInRoom(false);
    setIsLiveMode(false);
    setConnectedUsers([]);
    setRoomMessages([]);
    videoRef.current.srcObject = null;
  };

  const startLiveTranslation = async () => {
    if (!isInRoom) {
      alert("Please join a room first!");
      return;
    }

    try {
      // Get video and audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        },
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsLiveMode(true);
      
      startContinuousRecording(stream);
      
    } catch (error) {
      console.error('Failed to start live translation:', error);
      alert('Camera/microphone access denied or not available');
    }
  };

  const stopLiveTranslation = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsLiveMode(false);
    setIsRecording(false);
    videoRef.current.srcObject = null;
  };

  const startContinuousRecording = (stream) => {
    const recordChunk = () => {
      if (!isLiveMode || !isInRoom) return;
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'audio-chunk',
              audioData: base64,
              targetLang: targetLanguage,
              roomId: roomId
            }));
          }
        };
        reader.readAsDataURL(blob);
        
        // Schedule next recording
        setTimeout(recordChunk, 100);
      };
      
      recorder.start();
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 3000); // 3-second chunks
    };
    
    recordChunk();
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'room-joined':
        setIsInRoom(true);
        setConnectedUsers(data.connectedUsers);
        setJoinError("");
        alert(`Welcome ${data.userName}! You joined room ${data.roomId} successfully!`);
        break;
        
      case 'join-error':
        setJoinError(data.message);
        alert(`Failed to join room: ${data.message}`);
        if (wsRef.current) {
          wsRef.current.close();
        }
        break;
        
      case 'user-joined':
        setConnectedUsers(prev => [...prev, { 
          userId: data.userId, 
          userName: data.userName, 
          language: data.language 
        }]);
        addRoomMessage(`${data.userName} joined the room (${languages[data.language]})`);
        break;
        
      case 'user-left':
        setConnectedUsers(prev => prev.filter(user => user.userId !== data.userId));
        addRoomMessage(`${data.userName} left the room`);
        break;
        
      case 'stt-result':
        if (data.fromUser === userId) {
          setText(data.text);
          setProcessingStep("🔄 Translating...");
        }
        break;
        
      case 'translation-result':
        if (data.fromUser === userId) {
          setTranslatedText(data.translatedText);
          setProcessingStep("🎵 Generating audio...");
        }
        break;
        
      case 'translated-audio':
        setAudio(`http://localhost:5000${data.audioUrl}`);
        addRoomMessage(`${data.fromUserName}: "${data.originalText}" → "${data.translatedText}"`);
        setProcessingStep("✅ Complete");
        setTimeout(() => setProcessingStep(""), 2000);
        break;
        
      case 'error':
        console.error(`Error:`, data.message);
        setProcessingStep(`❌ Error`);
        setTimeout(() => setProcessingStep(""), 3000);
        break;
        
      default:
        console.log('Unknown message type:', data.type);
        break;
    }
  };

  const addRoomMessage = (message) => {
    setRoomMessages(prev => [...prev.slice(-9), { // Keep last 10 messages
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const startSingleRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = recorder;
      const chunks = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => processRecording(chunks);

      recorder.start();
      setIsRecording(true);
      
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Recording failed:', error);
      alert('Microphone access denied or not available');
    }
  };

  const processRecording = async (chunks) => {
    setIsProcessing(true);
    setText("");
    setTranslatedText("");
    setAudio("");
    setProcessingStep("🎤 Processing speech...");

    try {
      const blob = new Blob(chunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob);
      formData.append("targetLang", targetLanguage);
      formData.append("videoTimestamp", Date.now());

      const response = await fetch("http://localhost:5000/live-translate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setText(result.originalText);
      setTranslatedText(result.translatedText);
      
      if (result.audioReady) {
        setAudio(`http://localhost:5000${result.audioUrl}`);
      }
      
      setProcessingStep("✅ Complete");

    } catch (error) {
      console.error('Processing failed:', error);
      alert(`Translation failed: ${error.message}`);
      setProcessingStep("❌ Failed");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingStep(""), 3000);
    }
  };

  return (
    <div style={{ 
      padding: 20, 
      fontFamily: 'Arial, sans-serif',
      maxWidth: 1400,
      margin: '0 auto',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <h1 style={{ color: '#2c3e50', marginBottom: 10 }}>
          🎥 Multi-User Live Video/Audio Translation System
        </h1>
        <div style={{ 
          backgroundColor: '#e8f4fd', 
          padding: 15, 
          borderRadius: 10,
          marginBottom: 20,
          border: '2px solid #3498db'
        }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>
            Connect Two Systems → Live Video/Audio → Speech-to-Text → Translation → Audio-to-Audio → Shared Output
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Room Management Section */}
        <div style={{ 
          flex: '1 1 400px',
          backgroundColor: 'white', 
          padding: 20, 
          borderRadius: 10, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>🏠 Room Management</h3>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 14, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
              Your Name: *
            </label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              style={{ 
                width: '100%', 
                padding: 8, 
                borderRadius: 5,
                border: '2px solid #ddd',
                fontSize: 14
              }}
              disabled={isInRoom}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 14, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
              User ID: {userId}
            </label>
            <small style={{ color: '#666' }}>Auto-generated unique identifier</small>
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 14, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
              Room ID:
            </label>
            <input 
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID or leave blank to auto-generate"
              style={{ 
                width: '100%', 
                padding: 8, 
                borderRadius: 5,
                border: '2px solid #ddd',
                fontSize: 14
              }}
              disabled={isInRoom}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 14, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
              Room Password:
            </label>
            <input 
              type="password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              placeholder="Enter password (optional for create, required for join)"
              style={{ 
                width: '100%', 
                padding: 8, 
                borderRadius: 5,
                border: '2px solid #ddd',
                fontSize: 14
              }}
              disabled={isInRoom}
            />
            <small style={{ color: '#666' }}>Leave blank for no password when creating</small>
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontSize: 14, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>
              Your Language:
            </label>
            <select 
              value={targetLanguage} 
              onChange={(e) => setTargetLanguage(e.target.value)}
              style={{ 
                width: '100%',
                padding: 8, 
                fontSize: 14, 
                borderRadius: 5,
                border: '2px solid #ddd'
              }}
              disabled={isInRoom}
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
          
          {joinError && (
            <div style={{ 
              marginBottom: 15, 
              padding: 10, 
              backgroundColor: '#ffebee', 
              borderRadius: 5,
              border: '1px solid #f44336',
              color: '#d32f2f'
            }}>
              ❌ {joinError}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
            <button 
              onClick={createRoom}
              disabled={isInRoom || !userName.trim()}
              style={{ 
                flex: 1,
                padding: '10px 15px', 
                fontSize: 14, 
                backgroundColor: (isInRoom || !userName.trim()) ? '#95a5a6' : '#27ae60', 
                color: 'white', 
                border: 'none', 
                borderRadius: 5,
                cursor: (isInRoom || !userName.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              🏗️ Create Room
            </button>
            
            <button 
              onClick={joinRoom}
              disabled={isInRoom || !roomId.trim() || !userName.trim()}
              style={{ 
                flex: 1,
                padding: '10px 15px', 
                fontSize: 14, 
                backgroundColor: (isInRoom || !roomId.trim() || !userName.trim()) ? '#95a5a6' : '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: 5,
                cursor: (isInRoom || !roomId.trim() || !userName.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              🚪 Join Room
            </button>
          </div>
          
          {isInRoom && (
            <button 
              onClick={leaveRoom}
              style={{ 
                width: '100%',
                padding: '10px 15px', 
                fontSize: 14, 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                borderRadius: 5,
                cursor: 'pointer'
              }}
            >
              🚪 Leave Room
            </button>
          )}
          
          {isInRoom && (
            <div style={{ marginTop: 15, padding: 10, backgroundColor: '#d5f4e6', borderRadius: 5 }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>
                👥 Connected Users ({connectedUsers.length}):
              </h4>
              {connectedUsers.map((user, index) => (
                <div key={index} style={{ fontSize: 12, marginBottom: 5 }}>
                  • <strong>{user.userName}</strong> ({user.userId}) - {languages[user.language]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Section */}
        <div style={{ 
          flex: '1 1 400px',
          backgroundColor: 'white', 
          padding: 20, 
          borderRadius: 10, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>📹 Live Video Feed</h3>
          
          <video 
            ref={videoRef}
            autoPlay 
            muted
            style={{ 
              width: '100%', 
              maxWidth: 400,
              height: 300,
              backgroundColor: '#000',
              borderRadius: 8,
              objectFit: 'cover'
            }}
          />
          
          <div style={{ marginTop: 15, textAlign: 'center' }}>
            {!isLiveMode ? (
              <button 
                onClick={startLiveTranslation}
                disabled={!isInRoom}
                style={{ 
                  padding: '12px 24px', 
                  fontSize: 16, 
                  backgroundColor: !isInRoom ? '#95a5a6' : '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 25,
                  cursor: !isInRoom ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
                }}
              >
                🔴 Start Live Translation
              </button>
            ) : (
              <button 
                onClick={stopLiveTranslation}
                style={{ 
                  padding: '12px 24px', 
                  fontSize: 16, 
                  backgroundColor: '#95a5a6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 25,
                  cursor: 'pointer'
                }}
              >
                ⏹️ Stop Live Translation
              </button>
            )}
          </div>
          
          <div style={{ marginTop: 15 }}>
            <h4>Single Recording Mode:</h4>
            <button 
              onClick={startSingleRecording}
              disabled={isProcessing || isLiveMode}
              style={{ 
                padding: '10px 20px', 
                fontSize: 14, 
                backgroundColor: (isProcessing || isLiveMode) ? '#95a5a6' : '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: 5,
                cursor: (isProcessing || isLiveMode) ? 'not-allowed' : 'pointer'
              }}
            >
              {isRecording ? '🔴 Recording...' : '🎤 Record 5 seconds'}
            </button>
          </div>
        </div>

        {/* Translation Results Section */}
        <div style={{ 
          flex: '1 1 400px',
          backgroundColor: 'white', 
          padding: 20, 
          borderRadius: 10, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>🌐 Translation Results</h3>

          {processingStep && (
            <div style={{ 
              padding: 10, 
              backgroundColor: '#fff3cd', 
              borderRadius: 5,
              marginBottom: 15,
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {processingStep}
            </div>
          )}

          {text && (
            <div style={{ 
              margin: '15px 0', 
              padding: 15, 
              backgroundColor: '#ecf0f1', 
              borderRadius: 8,
              borderLeft: '4px solid #3498db'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                📝 Original (English):
              </h4>
              <p style={{ margin: 0, fontSize: 14 }}>{text}</p>
            </div>
          )}

          {translatedText && (
            <div style={{ 
              margin: '15px 0', 
              padding: 15, 
              backgroundColor: '#d5f4e6', 
              borderRadius: 8,
              borderLeft: '4px solid #27ae60'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                🌐 Translated ({languages[targetLanguage]}):
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: 14,
                fontFamily: targetLanguage === 'ta' ? 'Tamil, serif' : 'inherit'
              }}>
                {translatedText}
              </p>
            </div>
          )}

          {audio && (
            <div style={{ 
              marginTop: 20, 
              padding: 15, 
              backgroundColor: '#fff3cd', 
              borderRadius: 8,
              textAlign: 'center',
              borderLeft: '4px solid #ffc107'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                🔊 Generated Audio:
              </h4>
              <audio 
                controls 
                src={audio} 
                style={{ width: '100%', maxWidth: 300 }}
                autoPlay={isLiveMode}
              />
            </div>
          )}

          {/* Room Messages */}
          {isInRoom && roomMessages.length > 0 && (
            <div style={{ 
              marginTop: 20, 
              padding: 15, 
              backgroundColor: '#f8f9fa', 
              borderRadius: 8,
              borderLeft: '4px solid #6c757d',
              maxHeight: 200,
              overflowY: 'auto'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                💬 Room Activity:
              </h4>
              {roomMessages.map((msg) => (
                <div key={msg.id} style={{ fontSize: 12, marginBottom: 5, color: '#6c757d' }}>
                  <span style={{ fontWeight: 'bold' }}>{msg.timestamp}</span> - {msg.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        marginTop: 30, 
        padding: 20, 
        backgroundColor: '#e8f6f3', 
        borderRadius: 10,
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#27ae60', marginBottom: 15 }}>🚀 How Multi-User Translation Works</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 15 }}>
          <div style={{ flex: '1 1 150px', minWidth: 120 }}>
            <div style={{ fontSize: 24, marginBottom: 5 }}>🏠</div>
            <strong>Create/Join Room</strong>
            <p style={{ fontSize: 12, margin: 5 }}>Connect two systems</p>
          </div>
          <div style={{ flex: '1 1 150px', minWidth: 120 }}>
            <div style={{ fontSize: 24, marginBottom: 5 }}>🎤</div>
            <strong>Speak</strong>
            <p style={{ fontSize: 12, margin: 5 }}>One person speaks English</p>
          </div>
          <div style={{ flex: '1 1 150px', minWidth: 120 }}>
            <div style={{ fontSize: 24, marginBottom: 5 }}>🌐</div>
            <strong>Translate</strong>
            <p style={{ fontSize: 12, margin: 5 }}>Real-time translation</p>
          </div>
          <div style={{ flex: '1 1 150px', minWidth: 120 }}>
            <div style={{ fontSize: 24, marginBottom: 5 }}>🔊</div>
            <strong>Broadcast</strong>
            <p style={{ fontSize: 12, margin: 5 }}>All users hear translation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
