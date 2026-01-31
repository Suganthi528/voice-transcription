import sys
import speech_recognition as sr
import io
import os
from pydub import AudioSegment
from pydub.utils import which

def convert_audio_to_wav(input_path, output_path):
    """Convert audio file to WAV format for better compatibility"""
    try:
        # Try to convert using pydub
        audio = AudioSegment.from_file(input_path)
        audio = audio.set_frame_rate(16000).set_channels(1)
        audio.export(output_path, format="wav")
        return output_path
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return input_path

def transcribe_audio(audio_file_path):
    """
    Transcribe audio file to text using SpeechRecognition
    """
    recognizer = sr.Recognizer()
    
    try:
        # Convert to WAV if needed
        if not audio_file_path.endswith('.wav'):
            wav_path = audio_file_path.replace(os.path.splitext(audio_file_path)[1], '.wav')
            audio_file_path = convert_audio_to_wav(audio_file_path, wav_path)
        
        # Load audio file
        with sr.AudioFile(audio_file_path) as source:
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            # Record the audio
            audio_data = recognizer.record(source)
        
        # Use Google Speech Recognition
        text = recognizer.recognize_google(audio_data, language='en-US')
        return text
        
    except sr.UnknownValueError:
        return "Could not understand audio - please speak clearly"
    except sr.RequestError as e:
        return f"Speech recognition service error: {e} - check internet connection"
    except Exception as e:
        return f"Error processing audio: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    result = transcribe_audio(audio_path)
    print(result)
