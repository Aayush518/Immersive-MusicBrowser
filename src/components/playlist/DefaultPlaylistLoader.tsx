import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  isLoading: boolean;
  error?: string;
  onRetry: () => void;
}

export const DefaultPlaylistLoader: React.FC<Props> = ({ 
  isLoading, 
  error,
  onRetry 
}) => {
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={onRetry}
          className="text-sm text-pink-500 hover:text-pink-400"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4">
        <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />
        <span className="text-gray-400">Loading playlist...</span>
      </div>
    );
  }

  return null;
};