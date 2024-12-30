import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Maximize2,
  Minimize2,
  Settings,
} from 'lucide-react';
import { Song } from '../types/music';
import { useAudioContext } from '../contexts/AudioContext';
import { VolumeSlider } from './controls/VolumeSlider';
import { ProgressBar } from './controls/ProgressBar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AudioControlPanel } from './AudioControlPanel';

interface PlayerProps {
  currentSong: Song | null;
  onNext: () => void;
  onPrevious: () => void;
  autoPlay?: boolean;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  onNext,
  onPrevious,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useLocalStorage('audio-volume', 0.7);
  const [isMuted, setIsMuted] = useLocalStorage('audio-muted', false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isInitializedRef = useRef(false);
  const { connectAudio } = useAudioContext();

  const handleTimeUpdate = useCallback((e: Event) => {
    const audio = e.target as HTMLAudioElement;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
  }, []);

  const handleSeek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }, []);

  const toggleMute = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!audioRef.current) return;
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;
    },
    [isMuted, setIsMuted]
  );

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      if (!audioRef.current) return;

      setVolume(newVolume);
      audioRef.current.volume = newVolume;

      if (newVolume === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    },
    [setVolume, isMuted, setIsMuted]
  );

  const initializeAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (!isInitializedRef.current || audio.src !== currentSong.url) {
      try {
        audio.src = currentSong.url;

        const connected = await connectAudio(audio);
        if (!connected) return;

        isInitializedRef.current = true;

        if (autoPlay) {
          try {
            await new Promise((resolve) => {
              const onCanPlay = () => {
                audio.removeEventListener('canplay', onCanPlay);
                resolve(null);
              };
              audio.addEventListener('canplay', onCanPlay);
            });

            await audio.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Autoplay failed:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    }
  }, [currentSong, connectAudio, autoPlay]);

  useEffect(() => {
    if (currentSong) {
      console.log('Initializing audio for:', currentSong.title);
      isInitializedRef.current = false;
      initializeAudio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      isInitializedRef.current = false;
    };
  }, [currentSong, initializeAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', onNext);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', onNext);
    };
  }, [handleTimeUpdate, onNext]);

  useEffect(() => {
    isInitializedRef.current = false;
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const initPromise = initializeAudio();

    return () => {
      initPromise
        .then(() => {
          audio.pause();
          setIsPlaying(false);
          isInitializedRef.current = false;
        })
        .catch(() => {});
    };
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

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  if (!currentSong) return null;

  return (
    <>
      <div className="fixed z-50 bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4">
        <audio ref={audioRef} preload="auto" />

        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 items-center">
          {/* Song Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">{currentSong.title}</h3>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={onPrevious}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 bg-white rounded-full text-black hover:bg-gray-200 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          </div>

          {/* Volume & Settings */}
          <div className="flex items-center justify-end gap-2">
            <VolumeSlider
              value={volume}
              onChange={handleVolumeChange}
              isMuted={isMuted}
              onMuteToggle={toggleMute}
            />

            <button
              onClick={() => setShowAudioControls(!showAudioControls)}
              className={`p-2 transition-colors rounded-lg ${
                showAudioControls
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Audio Controls Panel */}
      {showAudioControls && (
        <div className="fixed z-50 bottom-24 right-4 animate-fade-in">
          <AudioControlPanel />
        </div>
      )}
    </>
  );
};
