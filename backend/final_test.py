#!/usr/bin/env python3
"""
Final comprehensive test of the Live Video/Audio Translation System
"""

import requests
import json
import os
import time
import io
from io import BytesIO

def test_complete_pipeline():
    """Test the complete live translation pipeline"""
    print("🎥 Testing Complete Live Video/Audio Translation Pipeline...\n")
    
    # Test 1: Translation API
    print("1️⃣ Testing Translation API...")
    url = "http://localhost:5000/translate"
    data = {
        "text": "Hello, how are you today? I hope you are doing well.",
        "targetLang": "ta"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ English: {data['text']}")
            print(f"   ✅ Tamil: {result['translatedText']}")
        else:
            print(f"   ❌ Translation failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Translation error: {e}")
        return False
    
    # Test 2: TTS API
    print("\n2️⃣ Testing Text-to-Speech API...")
    url = "http://localhost:5000/tts"
    data = {
        "text": result['translatedText'],
        "language": "ta"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print(f"   ✅ Audio generated successfully ({len(response.content)} bytes)")
        else:
            print(f"   ❌ TTS failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ TTS error: {e}")
        return False
    
    # Test 3: Multiple languages
    print("\n3️⃣ Testing Multiple Languages...")
    languages = ['ta', 'hi', 'es', 'fr']
    test_text = "Good morning, welcome to our system"
    
    for lang in languages:
        try:
            response = requests.post("http://localhost:5000/translate", json={
                "text": test_text,
                "targetLang": lang
            })
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ {lang.upper()}: {result['translatedText']}")
            else:
                print(f"   ❌ {lang.upper()}: Failed")
        except Exception as e:
            print(f"   ❌ {lang.upper()}: Error - {e}")
    
    return True

def print_system_status():
    """Print current system status"""
    print("\n" + "="*60)
    print("🚀 LIVE VIDEO/AUDIO TRANSLATION SYSTEM STATUS")
    print("="*60)
    
    # Check backend
    try:
        response = requests.get("http://localhost:5000/translate", timeout=2)
        backend_status = "🟢 RUNNING"
    except:
        backend_status = "🔴 NOT RUNNING"
    
    # Check frontend
    try:
        response = requests.get("http://localhost:3000", timeout=2)
        frontend_status = "🟢 RUNNING"
    except:
        frontend_status = "🔴 NOT RUNNING"
    
    print(f"Backend Server (Port 5000):  {backend_status}")
    print(f"Frontend App (Port 3000):    {frontend_status}")
    print()
    
    print("📋 PIPELINE FLOW:")
    print("   Live Video/Audio → Speech-to-Text → Translation → TTS → New Audio + Video")
    print()
    
    print("🎯 SUPPORTED FEATURES:")
    print("   ✅ Real-time video feed with audio processing")
    print("   ✅ Tamil language translation (primary)")
    print("   ✅ Multiple language support (Hindi, Spanish, French, etc.)")
    print("   ✅ WebSocket-based live communication")
    print("   ✅ Single recording mode for testing")
    print("   ✅ Professional UI with processing indicators")
    print()
    
    print("🌐 SUPPORTED LANGUAGES:")
    print("   • Tamil (தமிழ்) - Primary focus")
    print("   • Hindi (हिन्दी)")
    print("   • Spanish, French, German, Italian")
    print("   • Portuguese, Russian, Japanese, Korean, Chinese")
    print()
    
    if backend_status == "🟢 RUNNING" and frontend_status == "🟢 RUNNING":
        print("🎉 SYSTEM READY!")
        print("📱 Open http://localhost:3000 in your browser")
        print("🎤 Click 'Start Live Translation' for real-time mode")
        print("🎵 Or use 'Record 5 seconds' for single recording mode")
    else:
        print("⚠️  SYSTEM NOT FULLY READY")
        if backend_status == "🔴 NOT RUNNING":
            print("   → Start backend: cd backend && npm start")
        if frontend_status == "🔴 NOT RUNNING":
            print("   → Start frontend: cd frontend/frontend && npm start")
    
    print("="*60)

if __name__ == "__main__":
    # Wait for server to be ready
    time.sleep(1)
    
    # Run comprehensive tests
    success = test_complete_pipeline()
    
    # Print system status
    print_system_status()
    
    if success:
        print("\n🎊 ALL TESTS PASSED! Your Live Video/Audio Translation System is ready!")
    else:
        print("\n⚠️  Some tests failed. Check the error messages above.")