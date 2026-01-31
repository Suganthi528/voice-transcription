#!/usr/bin/env python3
"""
Test script to verify the translation system components
"""

import sys
import os
sys.path.append('python')

from translate import translate_text, enhance_for_speech

def test_translation():
    """Test the translation functionality"""
    print("🧪 Testing Translation System...")
    
    # Test English to Tamil translation
    test_text = "Hello, how are you today?"
    print(f"Original text: {test_text}")
    
    try:
        translated = translate_text(test_text, 'ta')
        print(f"Tamil translation: {translated}")
        
        enhanced = enhance_for_speech(translated, 'ta')
        print(f"Enhanced for speech: {enhanced}")
        
        print("✅ Translation test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Translation test failed: {e}")
        return False

def test_tts():
    """Test the text-to-speech functionality"""
    print("\n🔊 Testing Text-to-Speech...")
    
    try:
        from synthesize import synthesize_speech
        
        test_text = "This is a test of the text to speech system"
        output_file = "test_output.wav"
        
        result = synthesize_speech(test_text, 'en', output_file)
        
        if result and os.path.exists(output_file):
            print(f"✅ TTS test passed! Audio saved to: {result}")
            # Clean up test file
            os.remove(output_file)
            return True
        else:
            print("❌ TTS test failed: No audio file generated")
            return False
            
    except Exception as e:
        print(f"❌ TTS test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting System Tests...\n")
    
    translation_ok = test_translation()
    tts_ok = test_tts()
    
    print(f"\n📊 Test Results:")
    print(f"Translation: {'✅ PASS' if translation_ok else '❌ FAIL'}")
    print(f"Text-to-Speech: {'✅ PASS' if tts_ok else '❌ FAIL'}")
    
    if translation_ok and tts_ok:
        print("\n🎉 All tests passed! Your system is ready to use.")
    else:
        print("\n⚠️  Some tests failed. Check the error messages above.")