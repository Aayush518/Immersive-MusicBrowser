import { useCallback, useRef, useEffect } from 'react';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

export const useVolumeControl = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [volume, setVolume] = useLocalStorage('audio-volume', 0.7);
  const [isMuted, setIsMuted] = useLocalStorage('audio-muted', false);
  const volumeRef = useRef(volume);
  const currentTimeRef = useRef(0);

  // Keep track of current time to restore after volume change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      currentTimeRef.current = audio.currentTime;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!audioRef.current) return;
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audioRef.current.muted = newMutedState;
  }, [isMuted, setIsMuted]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const wasPlaying = !audio.paused;
    const currentTime = currentTimeRef.current;

    // Update volume without triggering re-render
    volumeRef.current = newVolume;
    audio.volume = newVolume;

    // Preserve playback state
    if (wasPlaying) {
      audio.currentTime = currentTime;
    }

    // Batch state updates
    requestAnimationFrame(() => {
      setVolume(newVolume);
      if (newVolume === 0) {
        setIsMuted(true);
        audio.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audio.muted = false;
      }
    });
  }, [setVolume, isMuted, setIsMuted]);

  return {
    volume: volumeRef.current,
    isMuted,
    toggleMute,
    handleVolumeChange
  };
};