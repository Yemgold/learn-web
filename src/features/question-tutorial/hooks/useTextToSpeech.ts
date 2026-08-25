


"use client";

import { useCallback, useEffect, useState } from "react";

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
        "speechSynthesis" in window
    );
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();

    setIsSpeaking(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  };
}