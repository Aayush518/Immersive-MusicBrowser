import React from 'react';
import { Song } from '../../types/music';
import { AlbumArt } from '../artwork/AlbumArt';

interface SongMetadataProps {
  song: Song;
  showAlbum?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SongMetadata: React.FC<SongMetadataProps> = ({ 
  song, 
  showAlbum = true,
  size = 'md'
}) => {
  if (!song) return null;
  
  return (
    <div className="flex items-center gap-4">
      <AlbumArt
        src={song.albumArt}
        alt={`${song.title} cover`}
        size={size}
        className="shrink-0"
      />
      
      <div className="min-w-0 flex-1">
        <h3 className="text-white font-medium truncate">
          {song.title || 'Unknown Title'}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 truncate">
            {song.artist || 'Unknown Artist'}
          </span>
          {showAlbum && song.album && (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 truncate">{song.album}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};