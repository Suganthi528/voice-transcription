import React, { useState, useEffect } from 'react';
import './TranslationPipeline.css';

function TranslationPipeline({ isActive, currentStep }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 5);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const steps = [
    {
      icon: '🎤',
      title: 'Speech Recognition',
      subtitle: 'Audio Input Capture',
      description: 'Capturing voice from microphone',
      color: '#667eea'
    },
    {
      icon: '📝',
      title: 'Speech-to-Text',
      subtitle: 'Convert Speech to Text',
      description: 'AI transcribes spoken words',
      color: '#764ba2'
    },
    {
      icon: '🌐',
      title: 'Language Translation',
      subtitle: 'Real-Time Translation',
      description: 'Translating to target language',
      color: '#f093fb'
    },
    {
      icon: '🔊',
      title: 'Text-to-Speech',
      subtitle: 'Convert Text to Speech',
      description: 'Generating natural voice',
      color: '#4facfe'
    },
    {
      icon: '🎧',
      title: 'Translated Output',
      subtitle: 'Translated Voice Output',
      description: 'Delivering translated audio',
      color: '#00f2fe'
    }
  ];

  return (
    <div className="translation-pipeline-container">
      <h2 className="pipeline-title">
        🎥 VIDEO-MEET CONTINUOUS VOICE TRANSLATION
      </h2>
      
      <div className="pipeline-wrapper">
        {/* Participant A */}
        <div className="participant participant-a">
          <div className="participant-avatar">
            <div className="avatar-circle">
              <span className="avatar-icon">👤</span>
            </div>
            <div className={`microphone-indicator ${isActive ? 'active' : ''}`}>
              🎤
            </div>
          </div>
          <div className="participant-info">
            <h3>Participant A</h3>
            <p className="participant-status">Speaking</p>
            <div className="language-badge">Tamil (தமிழ்)</div>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="pipeline-steps">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div 
                className={`pipeline-step ${isActive && activeStep === index ? 'active' : ''} ${isActive && activeStep > index ? 'completed' : ''}`}
                style={{ '--step-color': step.color }}
              >
                <div className="step-icon">
                  <span className="icon-emoji">{step.icon}</span>
                  {isActive && activeStep === index && (
                    <div className="pulse-ring"></div>
                  )}
                </div>
                <div className="step-content">
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-subtitle">{step.subtitle}</p>
                  {isActive && activeStep === index && (
                    <div className="step-description">{step.description}</div>
                  )}
                </div>
                {isActive && activeStep === index && (
                  <div className="processing-indicator">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`pipeline-arrow ${isActive && activeStep > index ? 'active' : ''}`}>
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    <path 
                      d="M 0 10 L 30 10 L 25 5 M 30 10 L 25 15" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Participant B */}
        <div className="participant participant-b">
          <div className="participant-avatar">
            <div className="avatar-circle">
              <span className="avatar-icon">👤</span>
            </div>
            <div className={`headphone-indicator ${isActive && activeStep === 4 ? 'active' : ''}`}>
              🎧
            </div>
          </div>
          <div className="participant-info">
            <h3>Participant B</h3>
            <p className="participant-status">Listening</p>
            <div className="language-badge">Hindi (हिन्दी)</div>
          </div>
        </div>
      </div>

      {/* Audio Waveform Visualization */}
      {isActive && (
        <div className="audio-waveform">
          <div className="waveform-bars">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="waveform-bar"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Status Information */}
      <div className="pipeline-status">
        {isActive ? (
          <div className="status-active">
            <span className="status-dot"></span>
            <span>Translation Active - Processing in Real-Time</span>
          </div>
        ) : (
          <div className="status-inactive">
            <span>Click "Start Live Translation" to begin</span>
          </div>
        )}
      </div>

      {/* Technical Details */}
      <div className="technical-details">
        <div className="detail-card">
          <div className="detail-icon">⚡</div>
          <div className="detail-content">
            <h4>Processing Time</h4>
            <p>~8-10 seconds per chunk</p>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-icon">🔄</div>
          <div className="detail-content">
            <h4>Continuous Mode</h4>
            <p>3-second audio chunks</p>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-icon">🌍</div>
          <div className="detail-content">
            <h4>Languages</h4>
            <p>14+ languages supported</p>
          </div>
        </div>
        <div className="detail-card">
          <div className="detail-icon">🤖</div>
          <div className="detail-content">
            <h4>AI Powered</h4>
            <p>Google AI Services</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslationPipeline;
