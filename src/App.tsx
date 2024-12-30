import React, { useState, useCallback } from 'react';
import { Music } from 'lucide-react';
import { MusicUploader } from './components/MusicUploader';
import { Player } from './components/Player';
import { Playlist } from './components/Playlist';
import { AudioVisualizer } from './components/AudioVisualizer';
import { BassControls } from './components/BassControls';
import { AudioProvider } from './contexts/AudioContext';
import { Song } from './types/music';
import { extractMetadata } from './utils/audioUtils';

function App() {
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

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const nextSong = songs[currentIndex + 1] || songs[0];
    setCurrentSong(nextSong);
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const previousSong = songs[currentIndex - 1] || songs[songs.length - 1];
    setCurrentSong(previousSong);
  };

  return (
    <AudioProvider>
      <div className="min-h-screen bg-[#0a0a0a]">
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
              <div className="h-[600px] rounded-2xl overflow-hidden border border-[#333333] shadow-2xl">
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

        <Player
          currentSong={currentSong}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </AudioProvider>
  );
}

export default App;