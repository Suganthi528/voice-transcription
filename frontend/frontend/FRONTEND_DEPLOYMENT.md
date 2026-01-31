# 🚀 Frontend Deployment Guide

## Deploy React Frontend to Netlify/Vercel

This guide will help you deploy the Multi-User Live Video/Audio Translation Frontend.

---

## ✅ **Frontend Updated for Production**

### **Backend Integration**
- ✅ Updated API URLs to use your Render backend: `https://language-transcription-backend-1.onrender.com`
- ✅ Updated WebSocket URLs to use secure WebSocket: `wss://language-transcription-backend-1.onrender.com`
- ✅ Added connection status indicator
- ✅ Added automatic backend health check
- ✅ Fixed deprecated methods

### **Configuration**
- ✅ Created `src/config.js` for easy environment switching
- ✅ Automatic development/production URL switching
- ✅ Connection timeout handling
- ✅ Error handling for backend wake-up time

---

## 🚀 **Deployment Options**

### **Option 1: Netlify (Recommended)**

1. **Build the Project**:
   ```bash
   cd frontend/frontend
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Select your repository: `voice-transcription`
   - Set build settings:
     ```
     Base directory: frontend/frontend
     Build command: npm run build
     Publish directory: frontend/frontend/build
     ```

3. **Deploy**:
   - Click "Deploy site"
   - Wait for deployment (2-3 minutes)

### **Option 2: Vercel**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend/frontend
   vercel --prod
   ```

3. **Follow prompts**:
   - Link to existing project or create new
   - Set build settings if prompted

### **Option 3: Manual Build + Static Hosting**

1. **Build**:
   ```bash
   cd frontend/frontend
   npm run build
   ```

2. **Upload `build/` folder** to any static hosting service:
   - GitHub Pages
   - Firebase Hosting
   - AWS S3 + CloudFront
   - Any web hosting provider

---

## 🔧 **Environment Configuration**

### **Development vs Production**
The app automatically detects the environment:

```javascript
// Development (npm start)
API_BASE_URL: 'http://localhost:5000'
WS_BASE_URL: 'ws://localhost:5000'

// Production (npm run build)
API_BASE_URL: 'https://language-transcription-backend-1.onrender.com'
WS_BASE_URL: 'wss://language-transcription-backend-1.onrender.com'
```

### **Custom Backend URL**
To use a different backend URL, edit `src/config.js`:

```javascript
export const API_CONFIG = {
  API_BASE_URL: 'https://your-custom-backend.com',
  WS_BASE_URL: 'wss://your-custom-backend.com'
};
```

---

## 🌐 **Features**

### **✅ Production Ready**
- Secure HTTPS/WSS connections
- Backend health monitoring
- Connection status indicators
- Error handling for Render wake-up time
- Responsive design
- Cross-browser compatibility

### **✅ Multi-User Features**
- Room creation with passwords
- Real-time user management
- Live video/audio translation
- WebSocket communication
- Activity logging

### **✅ Translation Pipeline**
- Speech-to-Text processing
- Multi-language translation
- Text-to-Speech generation
- Audio broadcasting
- Real-time feedback

---

## 🚨 **Important Notes**

### **Render Free Tier Behavior**
Your backend on Render free tier:
- ✅ Sleeps after 15 minutes of inactivity
- ✅ Takes ~30 seconds to wake up on first request
- ✅ Frontend shows connection status during wake-up

### **HTTPS/WSS Requirements**
- ✅ Production frontend must use HTTPS
- ✅ WebSocket connections must use WSS (secure)
- ✅ Camera/microphone require secure context

### **Browser Permissions**
Users need to allow:
- ✅ Camera access (for video feed)
- ✅ Microphone access (for audio recording)
- ✅ Audio playback (for translated audio)

---

## 🧪 **Testing Deployment**

### **1. Test Backend Connection**
Visit your deployed frontend and check:
- ✅ Connection status shows "Backend connected successfully"
- ✅ No CORS errors in browser console

### **2. Test Room Creation**
- ✅ Enter your name
- ✅ Create a room
- ✅ Room ID appears

### **3. Test Multi-User**
- ✅ Open frontend in two browser tabs/devices
- ✅ Join same room with different names
- ✅ See both users in connected users list

### **4. Test Translation**
- ✅ Start live translation
- ✅ Allow camera/microphone permissions
- ✅ Speak English
- ✅ See Tamil translation appear
- ✅ Hear translated audio

---

## 🔗 **Example Deployment URLs**

### **Netlify**
```
https://your-app-name.netlify.app
```

### **Vercel**
```
https://your-app-name.vercel.app
```

### **Custom Domain**
```
https://your-domain.com
```

---

## 📊 **Performance Optimization**

### **Build Optimization**
- ✅ Code splitting enabled
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ Caching headers

### **Runtime Optimization**
- ✅ Lazy loading for components
- ✅ Efficient state management
- ✅ WebSocket connection reuse
- ✅ Audio file cleanup

---

## 🎉 **Deployment Checklist**

### **Pre-Deployment**
- [x] Backend deployed and working
- [x] Frontend updated with production URLs
- [x] Build process tested locally
- [x] All dependencies installed

### **Post-Deployment**
- [ ] Test frontend loads correctly
- [ ] Test backend connection
- [ ] Test room creation/joining
- [ ] Test live translation
- [ ] Test on multiple devices
- [ ] Test camera/microphone permissions

---

**🎊 Your Multi-User Live Video/Audio Translation Frontend is ready for deployment! 🚀**

**Backend**: https://language-transcription-backend-1.onrender.com
**Frontend**: Ready to deploy to Netlify/Vercel