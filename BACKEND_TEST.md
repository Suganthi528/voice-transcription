# 🧪 Backend Deployment Test

## Your Render Backend URL
```
https://voice-transcription-2-hee2.onrender.com
```

## Test Endpoints

### 1. Health Check
Open this URL in your browser:
```
https://voice-transcription-2-hee2.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "memory": {...},
  "timestamp": "2024-02-27T..."
}
```

### 2. Root Endpoint
```
https://voice-transcription-2-hee2.onrender.com/
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Multi-User Live Video/Audio Translation Server is running",
  "timestamp": "2024-02-27T...",
  "rooms": 0,
  "connectedClients": 0
}
```

### 3. Get Rooms
```
https://voice-transcription-2-hee2.onrender.com/rooms
```

**Expected Response:**
```json
{
  "rooms": []
}
```

---

## ✅ Frontend Configuration Updated

The frontend has been updated to use your Render backend:

**File**: `frontend/frontend/src/App.js`
```javascript
const API_BASE_URL = 'https://voice-transcription-2-hee2.onrender.com';
const WS_BASE_URL = 'wss://voice-transcription-2-hee2.onrender.com';
```

**File**: `frontend/frontend/src/config.js`
```javascript
API_BASE_URL: 'https://voice-transcription-2-hee2.onrender.com'
WS_BASE_URL: 'wss://voice-transcription-2-hee2.onrender.com'
```

---

## 🚀 Next Steps

1. **Test the backend** - Open the URLs above in your browser
2. **Run frontend locally** - Test with the new backend URL
3. **Deploy frontend** - Deploy to Netlify or Vercel

---

## 🔧 If Backend is Not Responding

### Check Render Dashboard
1. Go to: https://dashboard.render.com
2. Click on your service: `voice-transcription-2`
3. Check the "Logs" tab for errors
4. Verify the service is "Live" (green status)

### Common Issues

**Issue**: Service is sleeping
- **Solution**: Free tier services sleep after 15 minutes of inactivity
- First request will take 30-60 seconds to wake up
- Just wait and refresh

**Issue**: Build failed
- **Solution**: Check logs for Python/Node.js dependency errors
- Verify Dockerfile is correct
- Check that all files are in the backend folder

**Issue**: Port binding error
- **Solution**: Render automatically sets the PORT environment variable
- Your server.js should use: `process.env.PORT || 5000`

---

## 📊 Monitor Your Service

### View Logs
```
https://dashboard.render.com/web/[your-service-id]/logs
```

### View Metrics
```
https://dashboard.render.com/web/[your-service-id]/metrics
```

---

## 🎉 Success Checklist

- [x] Backend deployed to Render
- [x] Frontend configured with Render URL
- [ ] Test health endpoint
- [ ] Test root endpoint
- [ ] Test room creation
- [ ] Deploy frontend
- [ ] Test complete system

---

**Deployment Date**: February 27, 2024
**Backend URL**: https://voice-transcription-2-hee2.onrender.com
**Status**: Ready for Testing
