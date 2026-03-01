"""
Azure Cognitive Services Translation - Enterprise-grade
Install: pip install azure-ai-translation-text
Get API key from: https://portal.azure.com
"""

import sys
import requests
import io
import json

# Set UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Azure Translator Configuration
AZURE_KEY = "YOUR_AZURE_KEY_HERE"
AZURE_ENDPOINT = "https://api.cognitive.microsofttranslator.com"
AZURE_REGION = "eastus"  # Your Azure region

def translate_with_azure(text, target_lang, source_lang='auto'):
    """
    Translate text using Azure Cognitive Services
    Supports 100+ languages with high accuracy
    """
    try:
        path = '/translate'
        constructed_url = AZURE_ENDPOINT + path
        
        params = {
            'api-version': '3.0',
            'to': target_lang
        }
        
        if source_lang != 'auto':
            params['from'] = source_lang
        
        headers = {
            'Ocp-Apim-Subscription-Key': AZURE_KEY,
            'Ocp-Apim-Subscription-Region': AZURE_REGION,
            'Content-type': 'application/json'
        }
        
        body = [{
            'text': text
        }]
        
        response = requests.post(
            constructed_url, 
            params=params, 
            headers=headers, 
            json=body
        )
        response.raise_for_status()
        
        result = response.json()
        translated_text = result[0]['translations'][0]['text']
        
        print(f"[DEBUG] Azure Translation: {text} -> {translated_text}", file=sys.stderr)
        return translated_text
        
    except Exception as e:
        print(f"[ERROR] Azure translation failed: {str(e)}", file=sys.stderr)
        return f"[Translation Error] {text}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python translate_azure.py <text> <target_language> [source_language]")
        sys.exit(1)
    
    text = sys.argv[1]
    target_lang = sys.argv[2] if len(sys.argv) > 2 else 'en'
    source_lang = sys.argv[3] if len(sys.argv) > 3 else 'auto'
    
    translated = translate_with_azure(text, target_lang, source_lang)
    print(translated)
