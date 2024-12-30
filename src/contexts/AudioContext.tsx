import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudioProcessor } from '../hooks/useAudioProcessor';

interface AudioContextType {
  bassLevel: number;
  setBassLevel: (level: number) => void;
  bassBoost: number;
  setBassBoost: (level: number) => void;
  trebleLevel: number;
  setTrebleLevel: (level: number) => void;
  reverbLevel: number;
  setReverbLevel: (level: number) => void;
  audioData: Uint8Array;
  connectAudio: (audioElement: HTMLAudioElement) => Promise<boolean>;
}

const AudioContext = createContext<AudioContextType>({
  bassLevel: 0.5,
  setBassLevel: () => {},
  bassBoost: 0.5,
  setBassBoost: () => {},
  trebleLevel: 0.5,
  setTrebleLevel: () => {},
  reverbLevel: 0.3,
  setReverbLevel: () => {},
  audioData: new Uint8Array(),
  connectAudio: async () => false,
});

export const useAudioContext = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bassLevel, setBassLevel] = useState(0.5);
  const [bassBoost, setBassBoost] = useState(0.5);
  const [trebleLevel, setTrebleLevel] = useState(0.5);
  const [reverbLevel, setReverbLevel] = useState(0.3);
  
  const { 
    audioData, 
    connectAudio, 
    updateBassBoost,
    updateTreble,
    updateReverb,
    cleanup 
  } = useAudioProcessor();

  useEffect(() => {
    updateBassBoost(bassBoost);
  }, [bassBoost, updateBassBoost]);

  useEffect(() => {
    updateTreble(trebleLevel);
  }, [trebleLevel, updateTreble]);

  useEffect(() => {
    updateReverb(reverbLevel);
  }, [reverbLevel, updateReverb]);

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
        trebleLevel,
        setTrebleLevel,
        reverbLevel,
        setReverbLevel,
        audioData,
        connectAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};