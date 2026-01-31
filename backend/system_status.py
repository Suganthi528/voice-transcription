#!/usr/bin/env python3
"""
Display current system status and usage instructions
"""

import requests
import time

def display_system_status():
    """Display comprehensive system status"""
    
    print("🎥" + "="*70 + "🎥")
    print("    LIVE VIDEO/AUDIO TRANSLATION SYSTEM - RUNNING")
    print("🎥" + "="*70 + "🎥")
    print()
    
    # Check services
    try:
        backend_response = requests.get("http://localhost:5000/translate", timeout=2)
        backend_status = "🟢 ONLINE"
    except:
        backend_status = "🔴 OFFLINE"
    
    try:
        frontend_response = requests.get("http://localhost:3000", timeout=2)
        frontend_status = "🟢 ONLINE"
    except:
        frontend_status = "🔴 OFFLINE"
    
    print("📊 SERVICE STATUS:")
    print(f"   Backend API (Port 5000):     {backend_status}")
    print(f"   Frontend App (Port 3000):    {frontend_status}")
    print()
    
    print("🔄 TRANSLATION PIPELINE:")
    print("   Live Video/Audio → Speech-to-Text → Translation → TTS → Audio Output")
    print()
    
    print("🌐 SUPPORTED LANGUAGES:")
    print("   🎯 Tamil (தமிழ்) - Primary Target")
    print("   🇮🇳 Hindi (हिन्दी)")
    print("   🇪🇸 Spanish  🇫🇷 French  🇩🇪 German  🇮🇹 Italian")
    print("   🇵🇹 Portuguese  🇷🇺 Russian  🇯🇵 Japanese  🇰🇷 Korean  🇨🇳 Chinese")
    print()
    
    print("🎯 HOW TO USE:")
    print("   1. Open your browser: http://localhost:3000")
    print("   2. Allow camera and microphone access")
    print("   3. Select Tamil (or any target language)")
    print("   4. Choose your mode:")
    print("      • 🔴 'Start Live Translation' - Real-time video/audio")
    print("      • 🎤 'Record 5 seconds' - Single recording test")
    print("   5. Speak in English - see Tamil translation instantly!")
    print()
    
    print("✨ FEATURES:")
    print("   ✅ Real-time video feed with live audio processing")
    print("   ✅ WebSocket-based instant communication")
    print("   ✅ Tamil script rendering with proper fonts")
    print("   ✅ Audio-to-audio translation pipeline")
    print("   ✅ Professional UI with processing indicators")
    print("   ✅ Fallback offline mode for testing")
    print()
    
    if backend_status == "🟢 ONLINE" and frontend_status == "🟢 ONLINE":
        print("🚀 SYSTEM STATUS: FULLY OPERATIONAL!")
        print("🎊 Ready for live video/audio translation!")
        print()
        print("📱 QUICK START:")
        print("   → Open: http://localhost:3000")
        print("   → Click: 'Start Live Translation'")
        print("   → Speak: English (any sentence)")
        print("   → See: Tamil translation + audio output")
    else:
        print("⚠️  SYSTEM STATUS: NEEDS ATTENTION")
        if backend_status == "🔴 OFFLINE":
            print("   → Start backend: cd backend && npm start")
        if frontend_status == "🔴 OFFLINE":
            print("   → Start frontend: cd frontend/frontend && npm start")
    
    print()
    print("🎥" + "="*70 + "🎥")

if __name__ == "__main__":
    display_system_status()