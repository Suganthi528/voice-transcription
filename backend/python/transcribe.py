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

def transcribe_audio(audio_file_path):
    """
    Transcribe audio file to text using SpeechRecognition
    Works without pyaudio by using file-based recognition
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
        
        # Use Google Speech Recognition (requires internet)
        try:
            text = recognizer.recognize_google(audio_data, language='en-US')
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
        print("Usage: python transcribe.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    result = transcribe_audio(audio_path)
    print(result)
