import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [synth, setSynth] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); // To store the audio as a Blob
  const [downloadUrl, setDownloadUrl] = useState(''); // To store the URL for audio download

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSpeak = () => {
    if (!speaking && text) {
      const newSynth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = newSynth.getVoices(); // Get available voices
      utterance.voice = voices.find((voice) => voice.name === 'Your Preferred Voice'); // Choose a voice
      newSynth.speak(utterance);
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        const audioData = newSynth.getVoices()[0].audioData; // Get audio data from the first voice
        setAudioBlob(new Blob([audioData], { type: 'audio/wav' }));
      };
      setSynth(newSynth);
    }
  };

  const handleStop = () => {
    if (synth && speaking) {
      synth.cancel();
      setSpeaking(false);
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setDownloadUrl(url);
    }
  };

  return (
    <div className="container">
      <h1>Text to Audio Converter</h1>
      <textarea
        placeholder="Enter text here..."
        value={text}
        onChange={handleTextChange}
      />
      <div className="buttons">
        <button onClick={handleSpeak} disabled={speaking || !text}>
          {speaking ? 'Speaking...' : 'Speak'}
        </button>
        <button onClick={handleStop} disabled={!speaking}>
          Stop
        </button>
        <button onClick={handleDownload} disabled={!audioBlob}>
          Download Audio
        </button>
      </div>
      {downloadUrl && (
        <div className="download-link">
          <a href={downloadUrl} download="audio.wav">
            Click here to download the audio
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
