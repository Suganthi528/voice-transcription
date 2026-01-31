# 🎥 Multi-User Live Video/Audio Translation System

A real-time speech translation system that connects multiple users for live video/audio translation with user names and room passwords.

## 🚀 Features

- **🎤 Real-time Speech Translation**: Live audio processing with instant translation
- **👥 Multi-User Rooms**: Connect multiple users in secure rooms
- **🔐 Password Protection**: Secure rooms with custom passwords
- **👤 User Names**: Real name identification for better communication
- **🌐 Multi-Language Support**: Tamil, Hindi, Spanish, French, and 10+ languages
- **📹 Live Video Feed**: Video streaming with audio translation
- **🔊 Audio Broadcasting**: Translated audio shared with all room members
- **💬 Activity Logging**: Real-time user activity and translation logs

## 🎯 Pipeline Flow

```
Live Video/Audio → Speech-to-Text (STT) → Language Translation → Text-to-Speech (TTS) → Audio Broadcast → All Users
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **WebSocket** for real-time communication
- **Python** for AI processing (STT, Translation, TTS)
- **Multer** for file uploads

### Frontend
- **React.js** with hooks
- **WebRTC** for video/audio capture
- **WebSocket Client** for real-time updates
- **Responsive Design** with inline styles

### AI/ML Components
- **Speech Recognition** (Google Speech API + offline fallback)
- **Language Translation** (Custom translation engine)
- **Text-to-Speech** (pyttsx3 for cross-platform TTS)

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.10 or higher)
- **npm** or **yarn**
- **Modern web browser** with WebRTC support

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Suganthi528/voice-transcription.git
cd voice-transcription
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
python -m pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd frontend/frontend
npm install
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```
Server will run on `http://localhost:5000`

### 2. Start the Frontend Application
```bash
cd frontend/frontend
npm start
```
Frontend will open at `http://localhost:3000`

## 🎯 How to Use

### 👤 Person A (Room Creator)
1. Open `http://localhost:3000`
2. Enter your name (e.g., "Alice")
3. Create room with custom name and password
4. Share Room ID and password with others
5. Join the room and start live translation
6. Speak in English

### 👤 Person B (Room Joiner)
1. Open `http://localhost:3000` (on their device)
2. Enter their name (e.g., "Bob")
3. Enter Room ID and password from Person A
4. Select target language (Tamil, Hindi, etc.)
5. Join room and automatically hear translated audio

## 🌐 Supported Languages

- **Tamil (தமிழ்)** - Primary focus
- **Hindi (हिन्दी)**
- **Telugu (తెలుగు)**
- **Kannada (ಕನ್ನಡ)**
- **Malayalam (മലയാളം)**
- **Spanish, French, German, Italian**
- **Portuguese, Russian, Japanese, Korean, Chinese**

## 🔐 Security Features

- **Room Passwords**: Secure access control
- **User Authentication**: Name-based identification
- **Access Validation**: Server-side password verification
- **Activity Monitoring**: Real-time user tracking

## 🧪 Testing

### Test the System
```bash
cd backend
python test_name_password.py
```

### Test Individual Components
```bash
# Test translation
python python/translate.py "Hello world" ta

# Test TTS
python python/synthesize.py "வணக்கம்" ta test.wav

# Test complete pipeline
python final_test.py
```

## 📁 Project Structure

```
voice-transcription/
├── backend/
│   ├── python/
│   │   ├── transcribe.py          # Speech-to-text
│   │   ├── translate.py           # Language translation
│   │   └── synthesize.py          # Text-to-speech
│   ├── server.js                  # Main server with WebSocket
│   ├── package.json
│   └── requirements.txt
├── frontend/frontend/
│   ├── src/
│   │   └── App.js                 # Main React component
│   ├── public/
│   └── package.json
├── README.md
├── ENHANCED_USER_GUIDE.md
└── MULTI_USER_GUIDE.md
```

## 🎉 Use Cases

### Business Meetings
- English presenter → Tamil/Hindi audience
- Real-time translation for all participants

### Educational Sessions
- Teacher speaks English → Students hear in native language
- Multi-language classroom support

### Family Conversations
- Connect family members across language barriers
- Real-time conversation translation

### Customer Support
- Support agent (English) ↔ Customer (Tamil/Hindi)
- Instant communication solution

## 🚨 Troubleshooting

### Common Issues

**"Failed to join room: Invalid room password"**
- Verify password is correct
- Check for typos

**"No audio heard"**
- Check microphone/speaker permissions
- Ensure both users are in same room

**"Translation not working"**
- Check internet connection
- Try speaking more clearly

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Suganthi528** - *Initial work* - [Suganthi528](https://github.com/Suganthi528)

## 🙏 Acknowledgments

- Google Speech Recognition API
- React.js community
- Node.js and Express.js teams
- Python TTS libraries
- WebRTC technology

## 📞 Support

For support, email or create an issue in this repository.

---

**🎊 Ready to connect the world through real-time translation! 🌍**