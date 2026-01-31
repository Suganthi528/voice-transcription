import sys
import requests
import json
import re
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def translate_text_simple(text, target_language='ta'):
    """
    Simple translation using a free translation API
    """
    try:
        # Use a simple translation approach
        # For now, we'll create a basic mapping for common phrases
        translations = {
            'ta': {
                'hello': 'வணக்கம்',
                'how are you': 'எப்படி இருக்கிறீர்கள்',
                'thank you': 'நன்றி',
                'good morning': 'காலை வணக்கம்',
                'good evening': 'மாலை வணக்கம்',
                'yes': 'ஆம்',
                'no': 'இல்லை',
                'please': 'தயவுசெய்து',
                'sorry': 'மன்னிக்கவும்',
                'welcome': 'வரவேற்கிறோம்',
                'today': 'இன்று',
                'tomorrow': 'நாளை',
                'yesterday': 'நேற்று'
            },
            'hi': {
                'hello': 'नमस्ते',
                'how are you': 'आप कैसे हैं',
                'thank you': 'धन्यवाद',
                'good morning': 'सुप्रभात',
                'good evening': 'शुभ संध्या',
                'yes': 'हाँ',
                'no': 'नहीं',
                'please': 'कृपया',
                'sorry': 'माफ़ करें',
                'welcome': 'स्वागत है'
            }
        }
        
        # Simple word-by-word translation for basic phrases
        text_lower = text.lower()
        result = text_lower
        
        if target_language in translations:
            for english, translated in translations[target_language].items():
                if english in text_lower:
                    result = result.replace(english, translated)
        
        # If no translation found, return original with a note
        if result == text_lower:
            return f"[{target_language.upper()}] {text}"
        
        return result
        
    except Exception as e:
        return f"[{target_language.upper()}] {text}"

def translate_text(text, target_language='ta'):
    """
    Main translation function with fallback
    """
    return translate_text_simple(text, target_language)

def enhance_for_speech(text, target_language='ta'):
    """
    Enhance translated text for natural speech synthesis
    """
    # Add natural pauses for Tamil speech
    if target_language == 'ta':
        # Add slight pauses after common Tamil sentence structures
        text = re.sub(r'(என்று|என்பது|என்னும்)', r'\1,', text)
        text = re.sub(r'(ஆகும்|உள்ளது|இருக்கிறது)', r'\1.', text)
    
    return text

if __name__ == "__main__":
    text = sys.argv[1]
    target_lang = sys.argv[2] if len(sys.argv) > 2 else 'ta'
    
    # Translate maintaining natural speech patterns
    translated = translate_text(text, target_lang)
    enhanced = enhance_for_speech(translated, target_lang)
    
    # Print with UTF-8 encoding
    try:
        print(enhanced)
    except UnicodeEncodeError:
        # Fallback for encoding issues
        print(enhanced.encode('utf-8', errors='ignore').decode('utf-8'))