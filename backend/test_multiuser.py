#!/usr/bin/env python3
"""
Test the multi-user room functionality
"""

import requests
import json
import time

def test_room_creation():
    """Test room creation"""
    print("🏠 Testing Room Creation...")
    
    try:
        response = requests.post("http://localhost:5000/create-room")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Room created: {result['roomId']}")
            return result['roomId']
        else:
            print(f"❌ Room creation failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Room creation error: {e}")
        return None

def test_room_listing():
    """Test room listing"""
    print("\n📋 Testing Room Listing...")
    
    try:
        response = requests.get("http://localhost:5000/rooms")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Found {len(result['rooms'])} rooms")
            for room in result['rooms']:
                print(f"   Room: {room['roomId']} ({room['userCount']} users)")
            return True
        else:
            print(f"❌ Room listing failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Room listing error: {e}")
        return False

def display_usage_instructions():
    """Display usage instructions"""
    print("\n" + "="*70)
    print("🎉 MULTI-USER TRANSLATION SYSTEM READY!")
    print("="*70)
    print()
    print("🚀 HOW TO CONNECT TWO SYSTEMS:")
    print()
    print("👤 PERSON A (Speaker):")
    print("   1. Open http://localhost:3000 in browser")
    print("   2. Click 'Create Room' button")
    print("   3. Copy the Room ID that appears")
    print("   4. Select their target language (e.g., Tamil)")
    print("   5. Click 'Join Room'")
    print("   6. Click 'Start Live Translation'")
    print("   7. Speak in English")
    print()
    print("👤 PERSON B (Listener - on another computer/browser):")
    print("   1. Open http://localhost:3000 in their browser")
    print("   2. Enter the Room ID from Person A")
    print("   3. Select their preferred language")
    print("   4. Click 'Join Room'")
    print("   5. They will automatically hear translated audio")
    print()
    print("🔄 TRANSLATION FLOW:")
    print("   Person A speaks → System translates → Person B hears translation")
    print("   Both users see the translation text in real-time")
    print()
    print("✨ FEATURES:")
    print("   • Real-time room-based communication")
    print("   • Multiple users can join the same room")
    print("   • Live video feed for the speaker")
    print("   • Automatic audio broadcasting to all room members")
    print("   • Activity log showing who joined/left")
    print("   • Support for multiple languages")
    print()
    print("📱 QUICK TEST:")
    print("   • Open two browser tabs/windows")
    print("   • Use the same Room ID in both")
    print("   • Test the translation between them")
    print()
    print("="*70)

if __name__ == "__main__":
    print("🧪 Testing Multi-User Translation System...\n")
    
    # Test room creation
    room_id = test_room_creation()
    
    # Test room listing
    listing_ok = test_room_listing()
    
    # Display usage instructions
    display_usage_instructions()
    
    if room_id and listing_ok:
        print(f"\n🎊 SYSTEM READY! Test Room ID: {room_id}")
        print("📱 Open http://localhost:3000 to start using the multi-user system!")
    else:
        print("\n⚠️  Some tests failed. Check the server logs.")