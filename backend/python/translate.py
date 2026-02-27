import sys
from googletrans import Translator
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def translate_text(text, target_language='ta', source_language='auto'):
    """
    Translate text using Google Translate API with automatic source language detection
    """
    try:
        translator = Translator()
        
        # Detect source language if not specified
        if source_language == 'auto':
            detected = translator.detect(text)
            source_language = detected.lang
            print(f"[DEBUG] Detected source language: {source_language}", file=sys.stderr)
        
        # Translate to target language
        result = translator.translate(text, src=source_language, dest=target_language)
        
        print(f"[DEBUG] Translating from {source_language} to {target_language}", file=sys.stderr)
        print(f"[DEBUG] Original: {text}", file=sys.stderr)
        print(f"[DEBUG] Translated: {result.text}", file=sys.stderr)
        
        return result.text
        
    except Exception as e:
        print(f"[ERROR] Translation failed: {str(e)}", file=sys.stderr)
        # Fallback: return original text with language tag
        return f"[Translation Error - {target_language}] {text}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python translate.py <text> <target_language> [source_language]")
        sys.exit(1)
    
    text = sys.argv[1]
    target_lang = sys.argv[2] if len(sys.argv) > 2 else 'ta'
    source_lang = sys.argv[3] if len(sys.argv) > 3 else 'auto'
    
    # Translate with automatic language detection
    translated = translate_text(text, target_lang, source_lang)
    
    # Print with UTF-8 encoding
    try:
        print(translated)
    except UnicodeEncodeError:
        # Fallback for encoding issues
        print(translated.encode('utf-8', errors='ignore').decode('utf-8'))