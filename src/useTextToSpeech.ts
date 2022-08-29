import { useEffect, useState } from 'react';

type UseSpeechSynthesisProps = {
  onEnd: () => {};
}

type SpeakProps = {
  voice: SpeechSynthesisVoice | null;
  text: string;
  rate: number;
  pitch: number;
  volume: number;
}

const useSpeechSynthesis = ({ onEnd }: UseSpeechSynthesisProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  const getVoices = () => {
    // Firefox seems to have voices upfront and never calls the
    // voiceschanged event
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      setVoices(voiceOptions);
      return;
    }

    window.speechSynthesis.onvoiceschanged = (event: Event) => {
      const { target } = event
      voiceOptions = (target as SpeechSynthesis)?.getVoices();
      setVoices(voiceOptions);
    };
  };

  const handleEnd = () => {
    setSpeaking(false);
    onEnd();
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSupported(true);
      getVoices();
    }
  }, []);

  const speak = ({ voice, text = '', rate = 1, pitch = 1, volume = 1 }: SpeakProps) => {
    if (!supported) return;
    setSpeaking(true);
    // Firefox won't repeat an utterance that has been
    // spoken, so we need to create a new instance each time
    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices,
  };
};

export default useSpeechSynthesis;
