# 🔧 Troubleshooting: Audio Not Audible & Translation Not Working

## 🚨 Common Issues and Solutions

### **Issue 1: Backend is Sleeping (Render Free Tier)**

**Symptom:** Nothing happens when you speak, no transcription appears

**Reason:** Render free tier services sleep after 15 minutes of inactivity

**Solution:**
```
1. Open backend URL in browser: https://voice-transcription-2-hee2.onrender.com/health
2. Wait 30-60 seconds for it to wake up
3. You should see: {"status":"healthy",...}
4. Then try the frontend again
```

**Quick Test:**
```bash
# Open this in browser and wait
https://voice-transcription-2-hee2.onrender.com/health
```

---

### **Issue 2: WebSocket Not Connecting**

**Symptom:** "Failed to connect to translation server" error

**Check:**
1. Open browser console (F12)
2. Look for WebSocket errors
3. Check if backend URL is correct

**Fix in App.js:**
```javascript
// Verify these URLs are correct (line 27-28)
const API_BASE_URL = 'https://voice-transcription-2-hee2.onrender.com';
const WS_BASE_URL = 'wss://voice-transcription-2-hee2.onrender.com';
```

---

### **Issue 3: Microphone Not Working**

**Symptom:** "Hang tight... Preparing your video" message stuck

**Solution:**
```
1. Check browser permissions
2. Allow microphone access
3. Try different browser (Chrome recommended)
4. Check if microphone is working in other apps
```

**Test Microphone:**
```javascript
// Open browser console and run:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Microphone OK'))
  .catch(err => console.error('Microphone Error:', err));
```

---

### **Issue 4: Audio Not Playing**

**Symptom:** Transcription appears but no audio plays

**Reasons:**
1. Browser blocking autoplay
2. Audio file not generated
3. Volume is 0

**Solutions:**

**A. Enable Autoplay:**
```
1. Click anywhere on the page first
2. This gives browser permission to play audio
3. Or manually click the audio player
```

**B. Check Audio Element:**
```javascript
// Open browser console (F12)
// Check if audio elements exist
document.querySelectorAll('audio').forEach(audio => {
  console.log('Audio src:', audio.src);
  console.log('Audio volume:', audio.volume);
});
```

**C. Manual Play:**
```
1. Look for audio player controls
2. Click play button manually
3. Adjust volume slider
```

---

### **Issue 5: Python Scripts Failing**

**Symptom:** Backend logs show Python errors

**Check Backend Logs:**
```
1. Go to: https://dashboard.render.com
2. Click on your service
3. Click "Logs" tab
4. Look for Python errors
```

**Common Python Errors:**

**A. Module Not Found:**
```bash
# Error: ModuleNotFoundError: No module named 'openai'
# Solution: Check requirements.txt includes all packages
```

**B. API Key Missing:**
```bash
# Error: OpenAI API key not found
# Solution: It will fallback to googletrans automatically
```

**C. Audio File Error:**
```bash
# Error: Could not understand audio
# Solution: Speak louder and clearer
```

---

### **Issue 6: Translation Not Appearing**

**Symptom:** Original text appears but no translation

**Check:**
```javascript
// Open browser console
// Look for WebSocket messages
wsRef.current.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

**Verify:**
1. Check if `translated-audio` message is received
2. Check if `targetLang` matches your selected language
3. Check backend logs for translation errors

---

## 🔍 **Step-by-Step Debugging**

### **Step 1: Check Backend Health**

```bash
# Open in browser:
https://voice-transcription-2-hee2.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "uptime": 123.45,
  "memory": {...},
  "timestamp": "2024-..."
}

# If you see error or timeout:
- Wait 60 seconds (backend waking up)
- Refresh page
- Try again
```

### **Step 2: Check Frontend Connection**

```javascript
// Open browser console (F12)
// You should see:
"Connected to translation server"

// If you see:
"WebSocket error" or "Failed to connect"
// Then backend is not ready yet
```

### **Step 3: Test Microphone**

```javascript
// In browser console:
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('✅ Microphone working');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => {
    console.error('❌ Microphone error:', err);
  });
```

### **Step 4: Check Audio Capture**

```javascript
// In browser console, check if audio is being sent:
// Look for messages like:
"[DEBUG] Sending audio chunk to backend"

// If you don't see this:
- Microphone not working
- Or recording not started
```

### **Step 5: Check Backend Processing**

```
1. Go to Render dashboard
2. Open Logs
3. Look for:
   "[DEBUG] Processing audio from..."
   "[DEBUG] Transcribed text: ..."
   "[DEBUG] Translated from ... to ..."
   "[DEBUG] Generated audio for ..."

4. If you don't see these:
   - Audio not reaching backend
   - Or Python scripts failing
```

---

## 🛠️ **Quick Fixes**

### **Fix 1: Restart Everything**

```bash
# 1. Stop frontend
Ctrl + C

# 2. Clear browser cache
Ctrl + Shift + Delete

# 3. Restart frontend
npm start

# 4. Wake up backend
Open: https://voice-transcription-2-hee2.onrender.com/health

# 5. Try again
```

### **Fix 2: Use Chrome Browser**

```
Chrome has best WebRTC support
- Use Chrome or Edge (Chromium-based)
- Avoid Firefox or Safari for now
```

### **Fix 3: Check Network**

```
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter: WS (WebSocket)
4. You should see connection to backend
5. Check if messages are being sent/received
```

### **Fix 4: Manual Audio Test**

```javascript
// Test if audio can play at all
const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
audio.play()
  .then(() => console.log('✅ Audio playback works'))
  .catch(err => console.error('❌ Audio blocked:', err));
```

---

## 📊 **Diagnostic Checklist**

Run through this checklist:

```
□ Backend health check passes
□ WebSocket connects successfully
□ Microphone permission granted
□ Audio chunks being sent (check console)
□ Backend logs show processing
□ Translation messages received
□ Audio files generated (check backend logs)
□ Audio elements created in DOM
□ Audio src URLs are valid
□ Volume is not 0
□ Browser allows autoplay
```

---

## 🔧 **Advanced Debugging**

### **Enable Detailed Logging:**

Add this to your App.js (after line 1):

```javascript
// Add at top of App.js
window.DEBUG_MODE = true;

// Then in your code, add console.logs:
console.log('[DEBUG] isLiveMode:', isLiveMode);
console.log('[DEBUG] isInRoom:', isInRoom);
console.log('[DEBUG] WebSocket state:', wsRef.current?.readyState);
```

### **Check Audio Files:**

```javascript
// When you receive translated-audio message:
console.log('Audio URL:', `${API_BASE_URL}${data.audioUrl}`);

// Try opening this URL directly in browser
// If it downloads/plays, audio generation works
// If 404 error, audio file not created
```

### **Test Backend Directly:**

```bash
# Test if backend can process audio
# (You'll need to have an audio file)

curl -X POST https://voice-transcription-2-hee2.onrender.com/live-translate \
  -F "audio=@test.webm" \
  -F "targetLang=ta"
```

---

## 🎯 **Most Likely Issues:**

### **1. Backend Sleeping (90% of cases)**
**Solution:** Open backend URL and wait 60 seconds

### **2. Browser Autoplay Blocked (5% of cases)**
**Solution:** Click page first, then start translation

### **3. Microphone Permission (3% of cases)**
**Solution:** Allow microphone in browser settings

### **4. WebSocket Connection (2% of cases)**
**Solution:** Check if backend URL is correct

---

## 📞 **Still Not Working?**

### **Collect This Information:**

1. **Browser Console Errors:**
   - Press F12
   - Copy all red errors
   - Share them

2. **Backend Logs:**
   - Go to Render dashboard
   - Copy last 50 lines of logs
   - Share them

3. **Network Tab:**
   - F12 → Network → WS
   - Check WebSocket status
   - Screenshot it

4. **Your Setup:**
   - Browser: Chrome/Firefox/Safari?
   - OS: Windows/Mac/Linux?
   - Internet: Good connection?

---

## ✅ **Expected Behavior:**

When everything works correctly:

```
1. Click "Start Live Translation"
   → See: "🎤 Listening in en-US..."

2. Speak into microphone
   → See: Audio waveform animation
   → Console: "Sending audio chunk"

3. After 3 seconds
   → Backend: Processing audio
   → Console: "Received: stt-result"
   → UI: Original text appears

4. After 5-7 seconds
   → Backend: Translation complete
   → Console: "Received: translated-audio"
   → UI: Translated text appears
   → Audio: Plays automatically

5. Every 3 seconds
   → Process repeats
   → Continuous translation
```

---

## 🚀 **Quick Test Script:**

Run this in browser console to test everything:

```javascript
// Complete diagnostic test
async function testSystem() {
  console.log('🔍 Testing system...');
  
  // 1. Test backend
  try {
    const health = await fetch('https://voice-transcription-2-hee2.onrender.com/health');
    console.log('✅ Backend:', await health.json());
  } catch (e) {
    console.error('❌ Backend:', e);
  }
  
  // 2. Test microphone
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('✅ Microphone: Working');
    stream.getTracks().forEach(t => t.stop());
  } catch (e) {
    console.error('❌ Microphone:', e);
  }
  
  // 3. Test audio playback
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
    await audio.play();
    console.log('✅ Audio playback: Working');
  } catch (e) {
    console.error('❌ Audio playback:', e);
  }
  
  console.log('🎉 Test complete!');
}

testSystem();
```

---

**Run the diagnostic test above and share the results!** 🔍
