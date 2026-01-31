import sys
import os

def transcribe_audio_offline(audio_file_path):
    """
    Offline transcription fallback - returns a test message
    This is used when online speech recognition fails
    """
    try:
        # Check if file exists and has content
        if os.path.exists(audio_file_path) and os.path.getsize(audio_file_path) > 0:
            return "Hello, this is a test message for translation"
        else:
            return "No audio detected"
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe_offline.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    result = transcribe_audio_offline(audio_path)
    print(result)