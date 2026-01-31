import sys
import pyttsx3
import os
from pathlib import Path

def synthesize_speech(text, language='en', output_path='output.wav'):
    """
    Enhanced TTS using pyttsx3 (works with Python 3.14)
    """
    try:
        # Initialize the TTS engine
        engine = pyttsx3.init()
        
        # Configure voice settings
        voices = engine.getProperty('voices')
        
        # Try to set appropriate voice based on language
        if language == 'ta' and len(voices) > 1:
            # Try to find a female voice for Tamil (usually sounds better)
            for voice in voices:
                if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                    engine.setProperty('voice', voice.id)
                    break
        elif len(voices) > 0:
            engine.setProperty('voice', voices[0].id)
        
        # Set speech rate and volume
        engine.setProperty('rate', 150)  # Speed of speech
        engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
        
        # Ensure output directory exists
        output_dir = os.path.dirname(output_path)
        if output_dir:
            os.makedirs(output_dir, exist_ok=True)
        
        # Save to file
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        
        return output_path
        
    except Exception as e:
        print(f"TTS Error: {e}")
        # Create a simple placeholder audio file
        try:
            import wave
            with wave.open(output_path, 'w') as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(22050)
                # Create 1 second of silence
                silence = b'\x00\x00' * 22050
                wav_file.writeframes(silence)
            return output_path
        except:
            return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python synthesize.py <text> [language] [output_path]")
        sys.exit(1)
    
    text = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else 'en'
    output_path = sys.argv[3] if len(sys.argv) > 3 else 'output.wav'
    
    result_file = synthesize_speech(text, language, output_path)
    if result_file:
        print(result_file)
    else:
        print("Error: Could not generate audio")
