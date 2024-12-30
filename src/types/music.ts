export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverArt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: string[];
  createdAt: Date;
}