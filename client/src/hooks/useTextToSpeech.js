import { useState, useCallback, useEffect } from 'react';

const useTextToSpeech = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop speaking if unmounted
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text) => {
    if (isMuted) return;

    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();

    if (!window.speechSynthesis) {
      console.warn('Text-to-speech not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Optional: Configure voice parameters here
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Attempt to pick a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.startsWith('en-US') && (voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Microsoft')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) {
        // If transitioning to muted, stop current speech
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return !prev;
    });
  }, []);

  return {
    speak,
    cancel,
    isMuted,
    toggleMute,
    isSpeaking
  };
};

export default useTextToSpeech;
