"""
DeepL Translation - More accurate than Google Translate
Install: pip install deepl
Get API key from: https://www.deepl.com/pro-api
"""

import sys
import deepl
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# DeepL API Key (Free tier: 500,000 characters/month)
DEEPL_API_KEY = "YOUR_DEEPL_API_KEY_HERE"  # Get from https://www.deepl.com/pro-api

def translate_with_deepl(text, target_lang, source_lang='auto'):
    """
    Translate text using DeepL API
    DeepL supports: EN, DE, FR, ES, PT, IT, NL, PL, RU, JA, ZH
    """
    try:
        translator = deepl.Translator(DEEPL_API_KEY)
        
        # DeepL language codes mapping
        lang_mapping = {
            'en': 'EN-US',
            'de': 'DE',
            'fr': 'FR',
            'es': 'ES',
            'pt': 'PT-PT',
            'it': 'IT',
            'nl': 'NL',
            'pl': 'PL',
            'ru': 'RU',
            'ja': 'JA',
            'zh': 'ZH'
        }
        
        target_code = lang_mapping.get(target_lang, 'EN-US')
        
        # Translate
        result = translator.translate_text(
            text, 
            target_lang=target_code,
            source_lang=None if source_lang == 'auto' else source_lang.upper()
        )
        
        print(f"[DEBUG] DeepL Translation: {text} -> {result.text}", file=sys.stderr)
        return result.text
        
    except Exception as e:
        print(f"[ERROR] DeepL translation failed: {str(e)}", file=sys.stderr)
        return f"[Translation Error] {text}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python translate_deepl.py <text> <target_language> [source_language]")
        sys.exit(1)
    
    text = sys.argv[1]
    target_lang = sys.argv[2] if len(sys.argv) > 2 else 'en'
    source_lang = sys.argv[3] if len(sys.argv) > 3 else 'auto'
    
    translated = translate_with_deepl(text, target_lang, source_lang)
    print(translated)
