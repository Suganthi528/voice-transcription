"""
Improved Translation with Multiple Fallbacks
Works with or without OpenAI
"""

import sys
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def translate_with_googletrans(text, target_lang, source_lang='auto'):
    """
    Primary translation using googletrans
    """
    try:
        from googletrans import Translator
        translator = Translator()
        
        if source_lang == 'auto':
            detected = translator.detect(text)
            source_lang = detected.lang
            print(f"[DEBUG] Detected language: {source_lang}", file=sys.stderr)
        
        result = translator.translate(text, src=source_lang, dest=target_lang)
        print(f"[DEBUG] Googletrans: {text} -> {result.text}", file=sys.stderr)
        return result.text
        
    except Exception as e:
        print(f"[ERROR] Googletrans failed: {str(e)}", file=sys.stderr)
        return None

def translate_simple(text, target_lang):
    """
    Simple fallback translation for common phrases
    """
    translations = {
        'ta': {
            'hello': 'வணக்கம்',
            'how are you': 'எப்படி இருக்கிறீர்கள்',
            'thank you': 'நன்றி',
            'good morning': 'காலை வணக்கம்',
            'yes': 'ஆம்',
            'no': 'இல்லை'
        },
        'hi': {
            'hello': 'नमस्ते',
            'how are you': 'आप कैसे हैं',
            'thank you': 'धन्यवाद',
            'good morning': 'सुप्रभात',
            'yes': 'हाँ',
            'no': 'नहीं'
        },
        'fr': {
            'hello': 'Bonjour',
            'how are you': 'Comment allez-vous',
            'thank you': 'Merci',
            'good morning': 'Bonjour',
            'yes': 'Oui',
            'no': 'Non'
        },
        'es': {
            'hello': 'Hola',
            'how are you': 'Cómo estás',
            'thank you': 'Gracias',
            'good morning': 'Buenos días',
            'yes': 'Sí',
            'no': 'No'
        }
    }
    
    text_lower = text.lower().strip()
    if target_lang in translations:
        for english, translated in translations[target_lang].items():
            if english in text_lower:
                return translated
    
    return None

def translate_text(text, target_lang, source_lang='auto'):
    """
    Main translation function with multiple fallbacks
    """
    print(f"[INFO] Translating: '{text}' from {source_lang} to {target_lang}", file=sys.stderr)
    
    # Try googletrans first
    result = translate_with_googletrans(text, target_lang, source_lang)
    if result:
        return result
    
    # Try simple translation
    print("[INFO] Trying simple translation fallback", file=sys.stderr)
    result = translate_simple(text, target_lang)
    if result:
        return result
    
    # Last resort: return original with language tag
    print("[WARNING] All translation methods failed, returning original", file=sys.stderr)
    return f"[{target_lang.upper()}] {text}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python translate.py <text> <target_language> [source_language]")
        sys.exit(1)
    
    text = sys.argv[1]
    target_lang = sys.argv[2] if len(sys.argv) > 2 else 'en'
    source_lang = sys.argv[3] if len(sys.argv) > 3 else 'auto'
    
    try:
        translated = translate_text(text, target_lang, source_lang)
        print(translated)
    except Exception as e:
        print(f"[CRITICAL ERROR] {str(e)}", file=sys.stderr)
        print(text)  # Return original text on critical error
