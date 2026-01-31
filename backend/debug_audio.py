#!/usr/bin/env python3
"""
Debug script to test audio processing
"""

import sys
import os
from python.transcribe import transcribe_audio

def test_audio_file(audio_path):
    """Test audio file processing"""
    print(f"Testing audio file: {audio_path}")
    
    if not os.path.exists(audio_path):
        print(f"❌ Audio file does not exist: {audio_path}")
        return False
    
    print(f"✅ Audio file exists, size: {os.path.getsize(audio_path)} bytes")
    
    try:
        result = transcribe_audio(audio_path)
        print(f"✅ Transcription result: {result}")
        return True
    except Exception as e:
        print(f"❌ Transcription failed: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python debug_audio.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    test_audio_file(audio_path)