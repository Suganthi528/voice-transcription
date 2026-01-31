# 🚀 Render Deployment Guide

## Deploy Language Transcription Backend to Render

This guide will help you deploy the Multi-User Live Video/Audio Translation Backend to Render.

---

## 🔧 Pre-Deployment Fixes Applied

### ✅ **Fixed pyaudio Issue**
- Removed `pyaudio` dependency (causes build failures on cloud platforms)
- Updated `SpeechRecognition` to work without pyaudio
- Added `pydub` for audio format conversion
- Implemented cloud-friendly audio processing

### ✅ **Added Cloud Compatibility**
- Dynamic PORT configuration for Render
- Health check endpoints (`/` and `/health`)
- Automatic directory creation
- Error handling for missing system dependencies
- Dockerfile for containerized deployment

### ✅ **Updated Dependencies**
```
googletrans==4.0.0rc1
pyttsx3
SpeechRecognition
numpy
requests
pydub
wave
```

---

## 🚀 Deployment Steps

### **Method 1: Direct Git Deployment (Recommended)**

1. **Push to GitHub** (already done):
   ```bash
   Repository: https://github.com/Suganthi528/language-transcription-backend.git
   ```

2. **Create Render Account**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select: `language-transcription-backend`

4. **Configure Service**:
   ```
   Name: language-transcription-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: (leave empty)
   ```

5. **Build & Start Commands**:
   ```bash
   Build Command: npm install && pip3 install -r requirements.txt
   Start Command: npm start
   ```

6. **Environment Variables**:
   ```
   NODE_ENV=production
   ```

7. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

### **Method 2: Docker Deployment**

1. **Use Dockerfile** (included in repository)
2. **Render will auto-detect** the Dockerfile
3. **Configure as Docker service** in Render dashboard

---

## 🔍 **Deployment Verification**

### **Health Check Endpoints**
Once deployed, verify these endpoints work:

```bash
# Basic health check
GET https://your-app-name.onrender.com/

# Detailed health check
GET https://your-app-name.onrender.com/health

# Room listing
GET https://your-app-name.onrender.com/rooms
```

### **Expected Response**
```json
{
  "status": "OK",
  "message": "Multi-User Live Video/Audio Translation Server is running",
  "timestamp": "2024-01-31T10:00:00.000Z",
  "rooms": 0,
  "connectedClients": 0
}
```

---

## 🌐 **API Endpoints**

### **Room Management**
```bash
POST /create-room          # Create new room
GET /rooms                 # List active rooms
```

### **Translation Pipeline**
```bash
POST /translate-speech     # Complete speech translation
POST /live-translate       # Live video/audio translation
POST /stt                  # Speech-to-text only
POST /translate            # Text translation only
POST /tts                  # Text-to-speech only
GET /audio                 # Get generated audio
```

### **WebSocket**
```bash
WSS wss://your-app-name.onrender.com/
```

---

## 🔧 **Configuration**

### **Environment Variables** (Optional)
```bash
NODE_ENV=production
PORT=10000              # Render sets this automatically
PYTHON_PATH=/usr/bin/python3
```

### **Render Settings**
```yaml
# render.yaml (optional)
services:
  - type: web
    name: language-transcription-backend
    env: node
    plan: free
    buildCommand: npm install && pip3 install -r requirements.txt
    startCommand: npm start
    healthCheckPath: /health
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Build fails with pyaudio error**
- ✅ Fixed: Removed pyaudio dependency
- Uses file-based audio processing instead

**Python not found**
- ✅ Fixed: Uses python3 explicitly
- Dockerfile includes Python installation

**Port binding issues**
- ✅ Fixed: Uses process.env.PORT
- Render automatically assigns port

**Missing directories**
- ✅ Fixed: Auto-creates uploads/ and public/
- Handles missing directories gracefully

**WebSocket connection fails**
- Use WSS (secure WebSocket) for HTTPS deployments
- Update frontend to use deployed URL

---

## 🔗 **Frontend Integration**

### **Update Frontend URLs**
Replace localhost URLs with your Render deployment:

```javascript
// Before (local development)
const API_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000';

// After (production)
const API_URL = 'https://your-app-name.onrender.com';
const WS_URL = 'wss://your-app-name.onrender.com';
```

### **CORS Configuration**
The backend is configured to accept requests from any origin. For production, consider restricting CORS to your frontend domain.

---

## 📊 **Performance Notes**

### **Free Tier Limitations**
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid plan for production use

### **Optimization Tips**
- Keep WebSocket connections alive with ping/pong
- Implement connection retry logic in frontend
- Cache translation results when possible
- Use CDN for static assets

---

## 🎉 **Deployment Success**

Once deployed successfully, you'll have:

✅ **Live Backend API** at `https://your-app-name.onrender.com`
✅ **WebSocket Server** at `wss://your-app-name.onrender.com`
✅ **Health Monitoring** via `/health` endpoint
✅ **Room Management** system
✅ **Real-time Translation** pipeline
✅ **Multi-user Support** with passwords

---

## 🔗 **Next Steps**

1. **Test all endpoints** using Postman or curl
2. **Update frontend** to use production URLs
3. **Deploy frontend** to Netlify/Vercel
4. **Set up monitoring** and logging
5. **Configure custom domain** (optional)

---

**🎊 Your Language Transcription Backend is now live on Render! 🚀**

**Example URL**: `https://language-transcription-backend.onrender.com`