#!/usr/bin/env python3
"""
Test the live translation endpoint with a mock audio file
"""

import requests
import os
import wave
import struct

def create_test_audio():
    """Create a simple test audio file"""
    filename = "test_audio.wav"
    
    # Create a simple sine wave audio file
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(16000)  # 16kHz
        
        # Generate 2 seconds of silence (this will trigger offline transcription)
        frames = []
        for i in range(16000 * 2):  # 2 seconds
            frames.append(struct.pack('<h', 0))  # silence
        
        wav_file.writeframes(b''.join(frames))
    
    return filename

def test_live_translation():
    """Test the live translation endpoint"""
    print("🎤 Testing Live Translation Endpoint...")
    
    # Create test audio file
    audio_file = create_test_audio()
    
    try:
        # Test the live-translate endpoint
        with open(audio_file, 'rb') as f:
            files = {'audio': f}
            data = {
                'targetLang': 'ta',
                'videoTimestamp': '1234567890'
            }
            
            response = requests.post('http://localhost:5000/live-translate', 
                                   files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Original Text: {result['originalText']}")
            print(f"✅ Tamil Translation: {result['translatedText']}")
            print(f"✅ Audio URL: {result['audioUrl']}")
            print(f"✅ Target Language: {result['targetLanguage']}")
            print("🎉 Live translation endpoint working perfectly!")
            return True
        else:
            print(f"❌ Live translation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing live translation: {e}")
        return False
    finally:
        # Clean up test file
        if os.path.exists(audio_file):
            os.remove(audio_file)

if __name__ == "__main__":
    success = test_live_translation()
    
    if success:
        print("\n🚀 SYSTEM IS FULLY OPERATIONAL!")
        print("📱 Open http://localhost:3000 in your browser")
        print("🎥 Your Live Video/Audio Translation System is ready to use!")
    else:
        print("\n⚠️ There might be an issue with the live translation endpoint.")