"""
OpenAI GPT Translation - Most accurate and natural
Install: pip install openai
Get API key from: https://platform.openai.com/api-keys
"""

import sys
import os
import io

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Try to import OpenAI
try:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY', 'YOUR_API_KEY_HERE'))
    USE_OPENAI = True
except ImportError:
    USE_OPENAI = False
    print("[WARNING] OpenAI not installed, falling back to googletrans", file=sys.stderr)

# Fallback to googletrans if OpenAI not available
if not USE_OPENAI:
    try:
        from googletrans import Translator
        translator = Translator()
    except ImportError:
        print("[ERROR] Neither OpenAI nor googletrans available", file=sys.stderr)
        sys.exit(1)

def translate_with_openai(text, target_lang, source_lang='auto'):
    """
    Translate text using OpenAI GPT-3.5-turbo
    """
    try:
        language_names = {
            'en': 'English',
            'ta': 'Tamil',
            'hi': 'Hindi',
            'te': 'Telugu',
            'ml': 'Malayalam',
            'kn': 'Kannada',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese'
        }
        
        target_language_name = language_names.get(target_lang, target_lang)
        
        prompt = f"Translate the following text to {target_language_name}. Provide ONLY the translation, no explanations or additional text:\n\n{text}"
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional translator. Provide accurate, natural translations. Return ONLY the translated text, nothing else."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        translated_text = response.choices[0].message.content.strip()
        print(f"[DEBUG] OpenAI Translation: {text} -> {translated_text}", file=sys.stderr)
        return translated_text
        
    except Exception as e:
        print(f"[ERROR] OpenAI translation failed: {str(e)}", file=sys.stderr)
        # Fallback to googletrans
        return translate_with_googletrans(text, target_lang, source_lang)

def translate_with_googletrans(text, target_lang, source_lang='auto'):
    """
    Fallback translation using googletrans
    """
    try:
        if source_lang == 'auto':
            detected = translator.detect(text)
            source_lang = detected.lang
        
        result = translator.translate(text, src=source_lang, dest=target_lang)
        print(f"[DEBUG] Googletrans Translation: {text} -> {result.text}", file=sys.stderr)
        return result.text
        
    except Exception as e:
        print(f"[ERROR] Googletrans failed: {str(e)}", file=sys.stderr)
        return f"[Translation Error] {text}"

def translate_text(text, target_lang, source_lang='auto'):
    """
    Main translation function with automatic fallback
    """
    if USE_OPENAI:
        return translate_with_openai(text, target_lang, source_lang)
    else:
        return translate_with_googletrans(text, target_lang, source_lang)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python translate_openai.py <text> <target_language> [source_language]")
        sys.exit(1)
    
    text = sys.argv[1]
    target_lang = sys.argv[2] if len(sys.argv) > 2 else 'en'
    source_lang = sys.argv[3] if len(sys.argv) > 3 else 'auto'
    
    translated = translate_text(text, target_lang, source_lang)
    print(translated)

