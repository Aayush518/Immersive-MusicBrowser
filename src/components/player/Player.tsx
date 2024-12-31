import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Song } from '../../types/music';
import { VolumeSlider } from '../controls/VolumeSlider';
import { AudioControlPanel } from '../AudioControlPanel';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useVolumeControl } from './hooks/useVolumeControl';
import { PlayerControls } from './PlayerControls';
import { SongMetadata } from './SongMetadata';
import { PlayerProgress } from './PlayerProgress';

interface PlayerProps {
  currentSong: Song;
  onNext: () => void;
  onPrevious: () => void;
  onPlayStateChange: (playing: boolean) => void;
  autoPlay?: boolean;
  isCollapsed?: boolean;
}

export const Player: React.FC<PlayerProps> = ({
  currentSong,
  onNext,
  onPrevious,
  onPlayStateChange,
  autoPlay = false,
  isCollapsed = false
}) => {
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

  return (
    <>
      <div className="bg-black/90 backdrop-blur-lg border-t border-pink-500/10">
        <audio ref={audioRef} preload="auto" />
        
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="flex items-center justify-between sm:justify-start">
              <SongMetadata song={currentSong} showAlbum={!isCollapsed} size="sm" />
            </div>

            {!isCollapsed && (
              <PlayerControls
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onNext={onNext}
                onPrevious={onPrevious}
              />
            )}

            <div className="hidden sm:flex items-center justify-end gap-2">
              {!isCollapsed && (
                <VolumeSlider
                  value={volume}
                  onChange={handleVolumeChange}
                  isMuted={isMuted}
                  onMuteToggle={toggleMute}
                />
              )}
              
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

          {!isCollapsed && (
            <div className="mt-2">
              <PlayerProgress
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
              />
            </div>
          )}
        </div>

        {isCollapsed && (
          <PlayerProgress
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            isCollapsed
          />
        )}
      </div>

      {showAudioControls && (
        <div className="fixed z-50 bottom-24 right-4 animate-fade-in">
          <AudioControlPanel />
        </div>
      )}
    </>
  );
};