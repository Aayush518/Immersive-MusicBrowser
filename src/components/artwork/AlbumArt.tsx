import React, { useState } from 'react';
import { Music } from 'lucide-react';

interface AlbumArtProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AlbumArt: React.FC<AlbumArtProps> = ({ 
  src, 
  alt,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const renderFallback = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center`}>
      <Music className="w-1/2 h-1/2 text-white/50" />
    </div>
  );

  if (!src || hasError) {
    return renderFallback();
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative group overflow-hidden`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-lg"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Music className="w-1/3 h-1/3 text-white" />
      </div>
    </div>
  );
};