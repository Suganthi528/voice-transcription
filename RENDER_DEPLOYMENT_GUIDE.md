# 🚀 Render Deployment Guide - Multi-Language Live Translation System

## Prerequisites
- GitHub account with your repository: `https://github.com/Suganthi528/voice-transcription.git`
- Render account (free): https://render.com

---

## 📋 Deployment Steps

### **Method 1: Deploy Using render.yaml (Recommended)**

#### Step 1: Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Sign in with your GitHub account

#### Step 2: Create New Web Service
1. Click **"New +"** button in the top right
2. Select **"Blueprint"** from the dropdown
3. Click **"Connect a repository"**

#### Step 3: Connect Your GitHub Repository
1. If not already connected, click **"Connect GitHub"**
2. Authorize Render to access your repositories
3. Find and select: **`Suganthi528/voice-transcription`**
4. Click **"Connect"**

#### Step 4: Deploy from Blueprint
1. Render will automatically detect the `render.yaml` file
2. Review the configuration:
   - **Service Name**: `language-transcription-backend`
   - **Environment**: Node
   - **Plan**: Free
   - **Root Directory**: `backend`
3. Click **"Apply"** or **"Create Web Service"**

#### Step 5: Wait for Deployment
1. Render will start building your service
2. You'll see logs showing:
   - Installing Node.js dependencies
   - Installing Python dependencies
   - Starting the server
3. Wait 5-10 minutes for first deployment

#### Step 6: Get Your Backend URL
Once deployed, your backend will be available at:
```
https://language-transcription-backend-1.onrender.com
```

---

### **Method 2: Manual Deployment (Alternative)**

#### Step 1: Create New Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**

#### Step 2: Connect Repository
1. Click **"Connect a repository"**
2. Select: **`Suganthi528/voice-transcription`**
3. Click **"Connect"**

#### Step 3: Configure Service
Fill in the following settings:

**Basic Settings:**
- **Name**: `language-transcription-backend`
- **Region**: Oregon (US West) or closest to you
- **Branch**: `main`
- **Root Directory**: `backend`

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && pip3 install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  node server.js
  ```

**Advanced Settings:**
- **Health Check Path**: `/health`
- **Auto-Deploy**: Yes (enabled)

**Environment Variables:**
- `NODE_ENV` = `production`

#### Step 4: Create Web Service
1. Click **"Create Web Service"**
2. Wait for deployment to complete

---

## 🔧 Update Frontend Configuration

After deployment, update your frontend to use the Render backend URL:

### File: `frontend/frontend/src/App.js`

```javascript
// Update these lines (around line 27-28)
const API_BASE_URL = 'https://language-transcription-backend-1.onrender.com';
const WS_BASE_URL = 'wss://language-transcription-backend-1.onrender.com';
```

**Note**: Replace `language-transcription-backend-1` with your actual Render service name if different.

---

## ✅ Verify Deployment

### Test Backend Health
Open in browser:
```
https://language-transcription-backend-1.onrender.com/health
```

You should see:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "memory": {...},
  "timestamp": "2024-02-27T..."
}
```

### Test Backend Root
```
https://language-transcription-backend-1.onrender.com/
```

You should see:
```json
{
  "status": "OK",
  "message": "Multi-User Live Video/Audio Translation Server is running",
  "timestamp": "2024-02-27T...",
  "rooms": 0,
  "connectedClients": 0
}
```

---

## 🐛 Troubleshooting

### Issue: Build Fails
**Solution**: Check Render logs for specific errors
- Go to your service dashboard
- Click on "Logs" tab
- Look for error messages

### Issue: Python Dependencies Fail
**Solution**: Render's Node environment includes Python 3.9
- Ensure `requirements.txt` is in the `backend` folder
- Check that all packages are compatible with Python 3.9

### Issue: Service Crashes on Start
**Solution**: Check the start command
- Verify `server.js` exists in `backend` folder
- Check logs for port binding issues

### Issue: WebSocket Connection Fails
**Solution**: Render automatically handles WebSocket upgrades
- Ensure you're using `wss://` (not `ws://`) in frontend
- Check CORS settings in `server.js`

---

## 🔄 Auto-Deploy Setup

Your service is configured for auto-deploy. Every time you push to the `main` branch:
1. Render detects the changes
2. Automatically rebuilds the service
3. Deploys the new version

To disable auto-deploy:
1. Go to service settings
2. Find "Auto-Deploy" toggle
3. Turn it off

---

## 💰 Free Tier Limitations

Render Free Tier includes:
- ✅ 750 hours/month (enough for continuous running)
- ✅ Automatic HTTPS
- ✅ WebSocket support
- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds

**Note**: First request after inactivity will be slow. Consider upgrading to paid plan for production use.

---

## 📊 Monitor Your Service

### View Logs
```
Dashboard → Your Service → Logs
```

### View Metrics
```
Dashboard → Your Service → Metrics
```

### View Events
```
Dashboard → Your Service → Events
```

---

## 🎉 Success!

Your Multi-Language Live Translation System is now deployed on Render!

**Backend URL**: `https://language-transcription-backend-1.onrender.com`

**Next Steps**:
1. Update frontend with the backend URL
2. Deploy frontend to Netlify/Vercel
3. Test the complete system
4. Share with users!

---

## 📞 Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Check service logs in Render dashboard
3. Verify all environment variables are set
4. Test endpoints individually

---

## 🔐 Security Notes

For production deployment:
1. Add authentication to your endpoints
2. Set up rate limiting
3. Configure CORS properly
4. Use environment variables for sensitive data
5. Enable Render's DDoS protection

---

**Deployment Date**: February 27, 2024
**Repository**: https://github.com/Suganthi528/voice-transcription
**Render Service**: language-transcription-backend
