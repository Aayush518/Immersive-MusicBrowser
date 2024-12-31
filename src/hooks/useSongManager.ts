import { useState, useRef, useCallback, useEffect } from 'react';
import { Song } from '../types/music';
import { MetadataExtractor } from '../utils/metadataExtractor';
import { cleanupObjectURL } from '../utils/cleanup';
import { defaultPlaylist } from '../config/defaultPlaylist';

export const useSongManager = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCache = useRef<Map<string, Song>>(new Map());

  // Load default playlist on mount
  useEffect(() => {
    const loadDefaultPlaylist = async () => {
      const defaultSongs = defaultPlaylist.map(song => ({
        ...song,
        id: crypto.randomUUID()
      }));
      setSongs(defaultSongs);
    };

    loadDefaultPlaylist();
  }, []);

  useEffect(() => {
    return () => {
      songs.forEach(song => {
        if (song.url.startsWith('blob:')) {
          cleanupObjectURL(song.url);
          cleanupObjectURL(song.albumArt);
        }
      });
    };
  }, [songs]);

  const handleUpload = useCallback(async (files: File[]) => {
    const newSongs = await Promise.all(
      files.map(async (file) => {
        try {
          const metadata = await MetadataExtractor.extract(file);
          const song: Song = {
            id: crypto.randomUUID(),
            title: metadata.title,
            artist: metadata.artist,
            album: metadata.album,
            duration: metadata.duration,
            albumArt: metadata.albumArt,
            url: URL.createObjectURL(file)
          };
          audioCache.current.set(song.id, song);
          return song;
        } catch (error) {
          console.error('Error processing file:', file.name, error);
          return null;
        }
      })
    );

    setSongs(prev => [...prev, ...newSongs.filter((song): song is Song => song !== null)]);
  }, []);

  const handleSongSelect = useCallback((song: Song) => {
    const cachedSong = audioCache.current.get(song.id);
    if (cachedSong) {
      setCurrentSong(cachedSong);
    } else {
      setCurrentSong(song);
      audioCache.current.set(song.id, song);
    }
    setIsPlaying(true);
  }, []);

  const handleNext = useCallback(() => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const nextSong = songs[currentIndex + 1] || songs[0];
    if (nextSong) handleSongSelect(nextSong);
  }, [songs, currentSong, handleSongSelect]);

  const handlePrevious = useCallback(() => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const previousSong = songs[currentIndex - 1] || songs[songs.length - 1];
    if (previousSong) handleSongSelect(previousSong);
  }, [songs, currentSong, handleSongSelect]);

  return {
    songs,
    currentSong,
    isPlaying,
    setIsPlaying,
    handleUpload,
    handleSongSelect,
    handleNext,
    handlePrevious
  };
};