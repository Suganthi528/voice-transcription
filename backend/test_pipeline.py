#!/usr/bin/env python3
"""
Test the complete translation pipeline
"""

import requests
import json
import os
import time

def test_translation_endpoint():
    """Test the translation API endpoint"""
    print("🧪 Testing translation endpoint...")
    
    url = "http://localhost:5000/translate"
    data = {
        "text": "Hello, how are you today?",
        "targetLang": "ta"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Translation successful: {result['translatedText']}")
            return True
        else:
            print(f"❌ Translation failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Translation request failed: {e}")
        return False

def test_tts_endpoint():
    """Test the TTS API endpoint"""
    print("\n🔊 Testing TTS endpoint...")
    
    url = "http://localhost:5000/tts"
    data = {
        "text": "வணக்கம், எப்படி இருக்கிறீர்கள்?",
        "language": "ta"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("✅ TTS successful - audio file generated")
            return True
        else:
            print(f"❌ TTS failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ TTS request failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Translation Pipeline...\n")
    
    # Wait a moment for server to be ready
    time.sleep(1)
    
    translation_ok = test_translation_endpoint()
    tts_ok = test_tts_endpoint()
    
    print(f"\n📊 Pipeline Test Results:")
    print(f"Translation API: {'✅ PASS' if translation_ok else '❌ FAIL'}")
    print(f"TTS API: {'✅ PASS' if tts_ok else '❌ FAIL'}")
    
    if translation_ok and tts_ok:
        print("\n🎉 Pipeline is working! You can now use the web interface.")
        print("📱 Open http://localhost:3000 in your browser")
        print("🎤 Try the 'Record 5 seconds' button for testing")
    else:
        print("\n⚠️  Some components failed. Check the server logs.")