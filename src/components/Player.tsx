import React, { useState } from 'react';
import { Settings, Maximize2, Minimize2 } from 'lucide-react';
import { Song } from '../types/music';
import { VolumeSlider } from './controls/VolumeSlider';
import { AudioControlPanel } from './AudioControlPanel';
import { useAudioPlayer } from './player/hooks/useAudioPlayer';
import { useVolumeControl } from './player/hooks/useVolumeControl';
import { PlayerControls } from './player/PlayerControls';
import { SongInfo } from './player/SongInfo';

interface PlayerProps {
  currentSong: Song;
  onNext: () => void;
  onPrevious: () => void;
  onPlayStateChange: (playing: boolean) => void;
  autoPlay?: boolean;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  onNext,
  onPrevious,
  onPlayStateChange,
  autoPlay = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    handleSeek,
    togglePlay
  } = useAudioPlayer({
    currentSong,
    onNext,
    onPlayStateChange,
    autoPlay
  });

  const {
    volume,
    isMuted,
    toggleMute,
    handleVolumeChange
  } = useVolumeControl(audioRef);

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

  return (
    <>
      <div className="fixed z-50 bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-pink-500/10 p-3 sm:p-4">
        <audio ref={audioRef} preload="auto" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
          <div className="flex justify-between sm:justify-start items-center">
            <SongInfo song={currentSong} />
            <div className="flex sm:hidden items-center gap-2">
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
            </div>
          </div>

          <PlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onTogglePlay={togglePlay}
            onNext={onNext}
            onPrevious={onPrevious}
          />

          <div className="hidden sm:flex items-center justify-end gap-2">
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

      {showAudioControls && (
        <div className="fixed z-50 bottom-20 sm:bottom-24 right-4 animate-fade-in">
          <AudioControlPanel />
        </div>
      )}
    </>
  );
};