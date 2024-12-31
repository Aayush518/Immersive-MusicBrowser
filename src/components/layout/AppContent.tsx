import React from 'react';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { Footer } from './Footer';
import { CollapsiblePlayer } from '../player/CollapsiblePlayer';
import { useSongManager } from '../../hooks/useSongManager';

export const AppContent: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    setIsPlaying,
    handleUpload,
    handleSongSelect,
    handleNext,
    handlePrevious
  } = useSongManager();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Header songCount={songs.length} />
          <MainContent
            songs={songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onUpload={handleUpload}
            onSongSelect={handleSongSelect}
          />
        </div>
      </main>

      <div className={`transition-spacing duration-300 ${currentSong ? 'mb-24' : ''}`}>
        <Footer />
      </div>
      
      {currentSong && (
        <CollapsiblePlayer
          currentSong={currentSong}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onPlayStateChange={setIsPlaying}
          autoPlay={true}
        />
      )}
    </div>
  );
};