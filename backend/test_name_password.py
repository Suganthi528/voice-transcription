#!/usr/bin/env python3
"""
Test the enhanced room system with names and passwords
"""

import requests
import json
import time

def test_room_creation_with_password():
    """Test room creation with password"""
    print("🔐 Testing Room Creation with Password...")
    
    try:
        response = requests.post("http://localhost:5000/create-room", json={
            "roomName": "TestRoom123",
            "password": "secret123",
            "creatorName": "Alice"
        })
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Room created: {result['roomId']}")
            print(f"✅ Has password: {result['hasPassword']}")
            return result['roomId']
        else:
            print(f"❌ Room creation failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Room creation error: {e}")
        return None

def test_room_creation_without_password():
    """Test room creation without password"""
    print("\n🔓 Testing Room Creation without Password...")
    
    try:
        response = requests.post("http://localhost:5000/create-room", json={
            "creatorName": "Bob"
        })
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Room created: {result['roomId']}")
            print(f"✅ Has password: {result['hasPassword']}")
            return result['roomId']
        else:
            print(f"❌ Room creation failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Room creation error: {e}")
        return None

def test_room_listing():
    """Test room listing with enhanced info"""
    print("\n📋 Testing Enhanced Room Listing...")
    
    try:
        response = requests.get("http://localhost:5000/rooms")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Found {len(result['rooms'])} rooms")
            for room in result['rooms']:
                print(f"   Room: {room['roomId']}")
                print(f"   Users: {room['userCount']}")
                print(f"   Password Protected: {'Yes' if room['hasPassword'] else 'No'}")
                print(f"   Connected Users: {[user['userName'] for user in room['users']]}")
                print()
            return True
        else:
            print(f"❌ Room listing failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Room listing error: {e}")
        return False

def display_enhanced_usage():
    """Display enhanced usage instructions"""
    print("\n" + "="*80)
    print("🎉 ENHANCED MULTI-USER TRANSLATION SYSTEM WITH NAMES & PASSWORDS!")
    print("="*80)
    print()
    print("🆕 NEW FEATURES:")
    print("   ✅ User names for better identification")
    print("   ✅ Room passwords for security")
    print("   ✅ Custom room names")
    print("   ✅ Enhanced user management")
    print()
    print("🚀 HOW TO USE:")
    print()
    print("👤 STEP 1 - PERSON A (Room Creator):")
    print("   1. Open http://localhost:3000")
    print("   2. Enter your name (e.g., 'Alice')")
    print("   3. Enter custom room name (optional)")
    print("   4. Set room password (optional but recommended)")
    print("   5. Select target language (e.g., Tamil)")
    print("   6. Click 'Create Room'")
    print("   7. Share Room ID and Password with Person B")
    print("   8. Click 'Join Room'")
    print("   9. Click 'Start Live Translation'")
    print("   10. Speak in English")
    print()
    print("👤 STEP 2 - PERSON B (Room Joiner):")
    print("   1. Open http://localhost:3000 (on their device)")
    print("   2. Enter their name (e.g., 'Bob')")
    print("   3. Enter Room ID from Person A")
    print("   4. Enter Room Password from Person A")
    print("   5. Select their language preference")
    print("   6. Click 'Join Room'")
    print("   7. Automatically hear translated audio!")
    print()
    print("🔐 SECURITY FEATURES:")
    print("   • Password-protected rooms")
    print("   • User name identification")
    print("   • Room access control")
    print("   • Activity logging with names")
    print()
    print("💬 ENHANCED COMMUNICATION:")
    print("   • See real names of connected users")
    print("   • Activity log shows who joined/left")
    print("   • Translation messages show speaker names")
    print("   • Better user experience")
    print()
    print("🎯 EXAMPLE WORKFLOW:")
    print("   Alice creates 'MeetingRoom' with password 'secret123'")
    print("   → Bob joins with Room ID and password")
    print("   → Alice speaks English → Bob hears Tamil translation")
    print("   → Both see: 'Alice: Hello everyone → வணக்கம் அனைவருக்கும்'")
    print()
    print("="*80)

if __name__ == "__main__":
    print("🧪 Testing Enhanced Multi-User System...\n")
    
    # Test room creation with password
    room_with_password = test_room_creation_with_password()
    
    # Test room creation without password
    room_without_password = test_room_creation_without_password()
    
    # Test room listing
    listing_ok = test_room_listing()
    
    # Display enhanced usage instructions
    display_enhanced_usage()
    
    if room_with_password and room_without_password and listing_ok:
        print(f"\n🎊 ENHANCED SYSTEM READY!")
        print(f"🔐 Password-protected room: {room_with_password}")
        print(f"🔓 Open room: {room_without_password}")
        print("📱 Open http://localhost:3000 to test the enhanced features!")
    else:
        print("\n⚠️  Some tests failed. Check the server logs.")