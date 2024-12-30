import React, { useState, useCallback } from 'react';
import { Music } from 'lucide-react';
import { MusicUploader } from '../MusicUploader';
import { Player } from '../Player';
import { Playlist } from '../Playlist';
import { AudioVisualizer } from '../AudioVisualizer';
import { BassControls } from '../BassControls';
import { Footer } from './Footer';
import { Song } from '../../types/music';
import { extractMetadata } from '../../utils/audioUtils';

export const AppContent: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const handleUpload = useCallback(async (files: File[]) => {
    const newSongs = await Promise.all(
      files.map(async (file) => {
        const { title, artist, duration } = await extractMetadata(file);
        return {
          id: crypto.randomUUID(),
          title,
          artist,
          duration,
          url: URL.createObjectURL(file)
        };
      })
    );

    setSongs(prev => [...prev, ...newSongs]);
  }, []);

  const handleSongSelect = useCallback((song: Song) => {
    if (currentSong?.url) {
      URL.revokeObjectURL(currentSong.url);
    }
    setCurrentSong(song);
  }, [currentSong]);

  const handleNext = useCallback(() => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const nextSong = songs[currentIndex + 1] || songs[0];
    if (nextSong) {
      handleSongSelect(nextSong);
    }
  }, [songs, currentSong, handleSongSelect]);

  const handlePrevious = useCallback(() => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const previousSong = songs[currentIndex - 1] || songs[songs.length - 1];
    if (previousSong) {
      handleSongSelect(previousSong);
    }
  }, [songs, currentSong, handleSongSelect]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Neural Music Experience
            </h1>
          </div>

          {songs.length === 0 ? (
            <div className="mb-8">
              <MusicUploader onUpload={handleUpload} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="h-[600px] rounded-2xl overflow-hidden border border-[#333333] shadow-2xl relative">
                <AudioVisualizer />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Playlist
                    songs={songs}
                    currentSong={currentSong}
                    onSongSelect={handleSongSelect}
                  />
                </div>
                
                <div className="space-y-4">
                  <BassControls />
                  
                  <label
                    htmlFor="music-upload"
                    className="block w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-center font-medium"
                  >
                    Add More Music
                  </label>
                  <input
                    type="file"
                    id="music-upload"
                    accept="audio/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files ? Array.from(e.target.files) : [];
                      handleUpload(files);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      {currentSong && (
        <Player
          currentSong={currentSong}
          onNext={handleNext}
          onPrevious={handlePrevious}
          autoPlay
        />
      )}
    </div>
  );
};