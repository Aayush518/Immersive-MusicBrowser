import React from 'react';
import { Music } from 'lucide-react';

interface MetadataLoaderProps {
  isLoading: boolean;
  error?: string;
}

export const MetadataLoader: React.FC<MetadataLoaderProps> = ({ isLoading, error }) => {
  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-500/10 rounded-lg">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4">
        <div className="w-12 h-12 bg-white/5 rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
          <div className="w-24 h-3 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return null;
};