import { useState, useRef, useEffect } from "react";
import './TranslationRoom.css';

function TranslationRoom() {
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en-US");
  const [targetLanguage, setTargetLanguage] = useState("ta");
  const [audioVolume, setAudioVolume] = useState(100);
  const [autoPlay, setAutoPlay] = useState(true);
  const [originalSpeech, setOriginalSpeech] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [lastAudioUrl, setLastAudioUrl] = useState("");
  
  const wsRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const API_BASE_URL = 'https://voice-transcription-2-hee2.onrender.com';
  const WS_BASE_URL = 'wss://voice-transcription-2-hee2.onrender.com';

  const languages = {
    'en-US': 'English (US)',
    'ta': 'Tamil (தமிழ்)',
    'hi': 'Hindi (हिन्दी)',
    'te': 'Telugu (తెలుగు)',
    'ml': 'Malayalam (മലയാളം)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'ja': 'Japanese',
    'zh': 'Chinese'
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume / 100;
    }
  }, [audioVolume]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      streamRef.current = stream;
      setIsListening(true);
      startContinuousRecording(stream);
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Please allow microphone access to use translation');
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const startContinuousRecording = (stream) => {
    const recordChunk = () => {
      if (!isListening) return;
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'audio-chunk',
              audioData: base64,
              senderLang: currentLanguage,
              roomId: roomId
            }));
          }
        };
        reader.readAsDataURL(blob);
        
        // Schedule next recording
        setTimeout(recordChunk, 100);
      };
      
      recorder.start();
      mediaRecorderRef.current = recorder;
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 3000); // 3-second chunks
    };
    
    recordChunk();
  };

  const replayLast = () => {
    if (lastAudioUrl && audioRef.current) {
      audioRef.current.src = lastAudioUrl;
      audioRef.current.play();
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'stt-result':
        setOriginalSpeech(data.text);
        break;
        
      case 'translated-audio':
        if (data.targetLang === targetLanguage) {
          setTranslatedText(data.translatedText);
          const audioUrl = `${API_BASE_URL}${data.audioUrl}`;
          setLastAudioUrl(audioUrl);
          
          if (autoPlay && audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }
        }
        break;
        
      case 'user-joined':
        setUsersInRoom(prev => [...prev, data.userName]);
        break;
        
      case 'user-left':
        setUsersInRoom(prev => prev.filter(name => name !== data.userName));
        break;
        
      default:
        break;
    }
  };

  return (
    <div className="translation-room">
      {/* Users in Room */}
      <div className="users-section">
        <h3>👥 Users in Room ({usersInRoom.length})</h3>
        <div className="users-list">
          {usersInRoom.map((user, index) => (
            <div key={index} className="user-badge">{user}</div>
          ))}
        </div>
      </div>

      {/* Control Section */}
      <div className="control-section">
        <button 
          className={`translation-button ${isListening ? 'stop' : 'start'}`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? '⏹️ Stop Translation' : '▶️ Start Translation'}
        </button>

        {isListening && (
          <div className="listening-status">
            🎤 Listening in {languages[currentLanguage]}...
          </div>
        )}
      </div>

      {/* Audio Controls */}
      <div className="audio-controls">
        <div className="volume-control">
          <span>🔊 Audio Volume:</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={audioVolume}
            onChange={(e) => setAudioVolume(e.target.value)}
            className="volume-slider"
          />
          <span className="volume-value">{audioVolume}%</span>
        </div>

        <div className="control-row">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={autoPlay}
              onChange={(e) => setAutoPlay(e.target.checked)}
            />
            ✓ Auto-play translated speech
          </label>

          <button 
            className="replay-button"
            onClick={replayLast}
            disabled={!lastAudioUrl}
          >
            🔊 Replay Last
          </button>
        </div>
      </div>

      {/* Speech Display */}
      <div className="speech-display">
        <div className="speech-box">
          <h4>🎤 Original Speech</h4>
          <div className="speech-content">
            {originalSpeech || 'Waiting for speech...'}
          </div>
        </div>

        <div className="speech-box translated">
          <h4>🌐 Translated Text</h4>
          <div className="speech-content">
            {translatedText || 'Translation will appear here...'}
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}

export default TranslationRoom;
