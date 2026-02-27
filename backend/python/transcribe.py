import sys
import speech_recognition as sr
import io
import os
import tempfile
import wave

def convert_webm_to_wav(webm_path):
    """Convert WebM audio to WAV format for speech recognition"""
    try:
        from pydub import AudioSegment
        # Load the WebM file
        audio = AudioSegment.from_file(webm_path, format="webm")
        # Convert to WAV format with proper settings for speech recognition
        audio = audio.set_frame_rate(16000).set_channels(1)
        
        # Create temporary WAV file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav:
            audio.export(temp_wav.name, format="wav")
            return temp_wav.name
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return webm_path

def transcribe_audio(audio_file_path, language='auto'):
    """
    Transcribe audio file to text using SpeechRecognition
    Supports multiple languages with automatic detection
    """
    recognizer = sr.Recognizer()
    
    try:
        # Convert WebM to WAV if needed
        wav_path = audio_file_path
        if audio_file_path.endswith('.webm'):
            wav_path = convert_webm_to_wav(audio_file_path)
        
        # Use AudioFile instead of Microphone (no pyaudio needed)
        with sr.AudioFile(wav_path) as source:
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            # Record the audio data
            audio_data = recognizer.record(source)
        
        # Language mapping for Google Speech Recognition
        language_codes = {
            'auto': None,  # Let Google auto-detect
            'en': 'en-US',
            'ta': 'ta-IN',
            'hi': 'hi-IN',
            'te': 'te-IN',
            'kn': 'kn-IN',
            'ml': 'ml-IN',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT',
            'pt': 'pt-PT',
            'ru': 'ru-RU',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'zh': 'zh-CN'
        }
        
        # Use Google Speech Recognition with language support
        try:
            # If auto-detect, try multiple languages
            if language == 'auto' or language not in language_codes:
                # Try common languages in order
                for lang_code in ['en-US', 'ta-IN', 'hi-IN', 'te-IN', 'es-ES']:
                    try:
                        text = recognizer.recognize_google(audio_data, language=lang_code)
                        if text:
                            print(f"[DEBUG] Detected language: {lang_code}", file=sys.stderr)
                            return text
                    except:
                        continue
                # If all fail, try without language specification
                text = recognizer.recognize_google(audio_data)
                return text
            else:
                # Use specified language
                lang_code = language_codes.get(language, 'en-US')
                text = recognizer.recognize_google(audio_data, language=lang_code)
                print(f"[DEBUG] Transcribed in {lang_code}: {text}", file=sys.stderr)
                return text
                
        except sr.UnknownValueError:
            return "Could not understand audio - please speak clearly"
        except sr.RequestError as e:
            return f"Speech recognition service error: {e} - check internet connection"
            
    except Exception as e:
        return f"Error processing audio: {e}"
    finally:
        # Clean up temporary WAV file if created
        if wav_path != audio_file_path and os.path.exists(wav_path):
            try:
                os.unlink(wav_path)
            except:
                pass

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file_path> [language]")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else 'auto'
    result = transcribe_audio(audio_path, language)
    print(result)
