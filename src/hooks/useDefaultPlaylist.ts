import { useState, useEffect } from 'react';
import { Song } from '../types/music';
import { defaultPlaylist } from '../config/defaultPlaylist';

export const useDefaultPlaylist = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  
  const loadDefaultSongs = async (): Promise<Song[]> => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const songs: Song[] = defaultPlaylist.map(song => ({
        id: crypto.randomUUID(),
        ...song
      }));
      
      return songs;
    } catch (error) {
      setError('Failed to load default playlist');
      console.error('Default playlist error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loadDefaultSongs,
    isLoading,
    error
  };
};