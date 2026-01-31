# 🎥 Multi-User Live Video/Audio Translation System

## 🚀 How to Connect Two Systems for Real-Time Translation

Your system now supports **multi-user rooms** where multiple people can connect and share real-time translated audio!

---

## 📋 Quick Setup Guide

### 🖥️ **System Requirements**
- Two computers/devices with internet browsers
- Microphone and camera access
- Both systems should access: `http://localhost:3000`

### 🔧 **Step-by-Step Connection Process**

#### 👤 **PERSON A (Speaker/Host)**
1. **Open the app**: Go to `http://localhost:3000`
2. **Create a room**: Click the **"🏗️ Create Room"** button
3. **Get Room ID**: Copy the generated Room ID (e.g., `room_1234567890_abc123`)
4. **Share Room ID**: Send this Room ID to Person B
5. **Select language**: Choose target language (Tamil, Hindi, etc.)
6. **Join room**: Click **"🚪 Join Room"**
7. **Start translation**: Click **"🔴 Start Live Translation"**
8. **Speak**: Talk in English - translation will be broadcast to all room members

#### 👤 **PERSON B (Listener/Receiver)**
1. **Open the app**: Go to `http://localhost:3000` (on their device)
2. **Enter Room ID**: Paste the Room ID from Person A
3. **Select language**: Choose their preferred language
4. **Join room**: Click **"🚪 Join Room"**
5. **Listen**: They will automatically hear translated audio when Person A speaks

---

## 🔄 **Translation Flow**

```
Person A speaks English → Real-time STT → Translation → TTS → Audio broadcast to all room members
```

**What happens:**
1. Person A speaks into their microphone
2. System converts speech to text (STT)
3. Text gets translated to target language
4. Translated text becomes audio (TTS)
5. **All room members** hear the translated audio automatically
6. Translation text appears on everyone's screen

---

## ✨ **Key Features**

### 🏠 **Room Management**
- **Create rooms** with unique IDs
- **Join existing rooms** with Room ID
- **See connected users** and their languages
- **Leave rooms** anytime

### 🎤 **Real-Time Translation**
- **Live video feed** for the speaker
- **Continuous audio processing** (3-second chunks)
- **WebSocket communication** for instant results
- **Multi-language support** (Tamil, Hindi, Spanish, etc.)

### 👥 **Multi-User Support**
- **Multiple listeners** can join the same room
- **Activity log** shows who joined/left
- **Automatic audio broadcasting** to all room members
- **Individual language preferences** per user

### 🌐 **Supported Languages**
- **Tamil (தமிழ்)** - Primary focus
- **Hindi (हिन्दी)**
- **Telugu (తెలుగు)**
- **Kannada (ಕನ್ನಡ)**
- **Malayalam (മലയാളം)**
- **Spanish, French, German, Italian**
- **Portuguese, Russian, Japanese, Korean, Chinese**

---

## 🧪 **Testing the System**

### **Single Device Test** (Two Browser Tabs)
1. Open two browser tabs with `http://localhost:3000`
2. In Tab 1: Create a room and join it
3. In Tab 2: Use the same Room ID and join
4. In Tab 1: Start live translation and speak
5. In Tab 2: You should hear the translated audio

### **Two Device Test** (Recommended)
1. **Device A**: Create room, join, start translation, speak
2. **Device B**: Join same room, listen to translated audio
3. Both devices will show translation text and activity

---

## 🎯 **Use Cases**

### **Business Meetings**
- English speaker presents to Tamil-speaking audience
- Real-time translation for all participants

### **Educational Sessions**
- Teacher speaks English, students hear in their native language
- Multiple students can join the same session

### **Family Conversations**
- Connect family members who speak different languages
- Real-time conversation translation

### **Customer Support**
- Support agent speaks English, customer hears in Tamil
- Instant communication across language barriers

---

## 🔧 **Technical Details**

### **Backend Server** (Port 5000)
- **WebSocket server** for real-time communication
- **Room management** with unique IDs
- **Audio processing pipeline** (STT → Translation → TTS)
- **Multi-user broadcasting** system

### **Frontend App** (Port 3000)
- **React-based interface** with room management
- **WebRTC audio/video capture**
- **Real-time WebSocket communication**
- **Multi-language UI support**

### **Audio Pipeline**
```
Microphone → MediaRecorder → WebSocket → Server Processing → Audio Broadcast → All Room Members
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

**"Failed to join room"**
- Check if Room ID is correct
- Ensure backend server is running (port 5000)

**"No audio heard"**
- Check microphone permissions
- Verify speaker/headphone settings
- Ensure both users are in the same room

**"Translation not working"**
- Check internet connection (for online STT)
- Verify target language is selected
- Try speaking more clearly

**"Camera not working"**
- Allow camera permissions in browser
- Check if camera is being used by another app

### **Browser Permissions**
Make sure to allow:
- ✅ Microphone access
- ✅ Camera access
- ✅ Audio playback

---

## 🎉 **Success Indicators**

When everything is working correctly:
- ✅ Room created successfully with unique ID
- ✅ Users can join and see each other in the room
- ✅ Live video feed appears for the speaker
- ✅ Audio translation broadcasts to all room members
- ✅ Translation text appears in real-time
- ✅ Activity log shows user join/leave events

---

## 📱 **Quick Start Commands**

```bash
# Start the system
cd backend && npm start
cd frontend/frontend && npm start

# Test the system
cd backend && python test_multiuser.py

# Open the app
# Go to: http://localhost:3000
```

---

**🎊 Your Multi-User Live Video/Audio Translation System is ready!**

**Connect two systems, speak in English, and hear real-time Tamil translation! 🚀**