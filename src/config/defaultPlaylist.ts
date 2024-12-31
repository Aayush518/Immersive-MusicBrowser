import { DefaultSong } from '../types/music';

export const defaultPlaylist: DefaultSong[] = [];

export const addSongsToDefaultPlaylist = (songs: DefaultSong[]) => {
  defaultPlaylist.push(...songs);
};