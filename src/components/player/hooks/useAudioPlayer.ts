import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioContext } from '../../../contexts/AudioContext';
import { Song } from '../../../types/music';

interface UseAudioPlayerProps {
  currentSong: Song;
  onNext: () => void;
  onPlayStateChange: (playing: boolean) => void;
  autoPlay?: boolean;
}

export const useAudioPlayer = ({
  currentSong,
  onNext,
  onPlayStateChange,
  autoPlay = false
}: UseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { connectAudio } = useAudioContext();
  const lastPlaybackTime = useRef(0);

  const handleTimeUpdate = useCallback((e: Event) => {
    const audio = e.target as HTMLAudioElement;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
    lastPlaybackTime.current = audio.currentTime;
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    lastPlaybackTime.current = time;
  }, []);

  const initializeAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      const wasPlaying = !audio.paused;
      const previousTime = lastPlaybackTime.current;
      
      audio.src = currentSong.url;
      
      const connected = await connectAudio(audio);
      if (!connected) return;

      // Restore volume without triggering re-render
      const storedVolume = localStorage.getItem('audio-volume');
      const storedMuted = localStorage.getItem('audio-muted');
      
      if (storedVolume) {
        audio.volume = parseFloat(storedVolume);
      }
      
      if (storedMuted) {
        audio.muted = JSON.parse(storedMuted);
      }

      if (autoPlay || wasPlaying) {
        try {
          await audio.play();
          setIsPlaying(true);
          onPlayStateChange(true);
        } catch (error) {
          console.error('Autoplay failed:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }, [currentSong, connectAudio, autoPlay, onPlayStateChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange(false);
      lastPlaybackTime.current = audio.currentTime;
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', onNext);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', onNext);
    };
  }, [handleTimeUpdate, onNext, onPlayStateChange]);

  useEffect(() => {
    initializeAudio();
  }, [currentSong, initializeAudio]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        await audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    handleSeek,
    togglePlay
  };
};