import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudioProcessor } from '../hooks/useAudioProcessor';

interface AudioContextType {
  bassLevel: number;
  setBassLevel: (level: number) => void;
  bassBoost: number;
  setBassBoost: (level: number) => void;
  audioData: Uint8Array;
  connectAudio: (audioElement: HTMLAudioElement) => void;
}

const AudioContext = createContext<AudioContextType>({
  bassLevel: 0.5,
  setBassLevel: () => {},
  bassBoost: 0.5,
  setBassBoost: () => {},
  audioData: new Uint8Array(),
  connectAudio: () => {},
});

export const useAudioContext = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bassLevel, setBassLevel] = useState(0.5);
  const [bassBoost, setBassBoost] = useState(0.5);
  const { audioData, connectAudio, updateBassBoost, cleanup } = useAudioProcessor();

  useEffect(() => {
    updateBassBoost(bassBoost);
  }, [bassBoost, updateBassBoost]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <AudioContext.Provider
      value={{
        bassLevel,
        setBassLevel,
        bassBoost,
        setBassBoost,
        audioData,
        connectAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};