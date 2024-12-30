import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { Song } from '../types/music';
import { formatTime } from '../utils/audioUtils';
import { useAudioContext } from '../contexts/AudioContext';

interface Props {
  currentSong: Song | null;
  onNext: () => void;
  onPrevious: () => void;
}

export const Player: React.FC<Props> = ({ currentSong, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { connectAudio } = useAudioContext();

  useEffect(() => {
    if (currentSong && audioRef.current) {
      connectAudio(audioRef.current);
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSong, connectAudio]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-[#333333] backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onNext}
        />
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">{currentSong.title}</h3>
                <p className="text-sm text-gray-400">{currentSong.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button
                onClick={onPrevious}
                className="text-white hover:text-pink-500 transition-colors"
              >
                <SkipBack className="w-6 h-6" />
              </button>
              
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              
              <button
                onClick={onNext}
                className="text-white hover:text-pink-500 transition-colors"
              >
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <input
                type="range"
                min="0"
                max={currentSong.duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-gradient-to-r [&::-webkit-slider-runnable-track]:from-pink-500 [&::-webkit-slider-runnable-track]:to-purple-500"
              />
            </div>
            <span className="text-sm text-gray-400 w-12">
              {formatTime(currentSong.duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};