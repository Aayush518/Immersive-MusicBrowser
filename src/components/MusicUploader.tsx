import React, { useCallback, useState } from 'react';
import { Upload, Music, FileMusic } from 'lucide-react';
import { MetadataLoader } from './metadata/MetadataLoader';

interface Props {
  onUpload: (files: File[]) => void;
}

export const MusicUploader: React.FC<Props> = ({ onUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleFiles = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const audioFiles = files.filter(file => file.type.startsWith('audio/'));
      
      if (audioFiles.length === 0) {
        setError('Please select audio files only');
        return;
      }
      
      onUpload(audioFiles);
    } catch (err) {
      setError('Failed to process audio files');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  }, [handleFiles]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative group border-2 border-dashed border-gray-300/20 rounded-3xl p-8 sm:p-12 text-center hover:border-pink-500/50 transition-all duration-300 bg-black/20 backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <MetadataLoader isLoading={isLoading} error={error} />
      
      <input
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileInput}
        className="hidden"
        id="music-upload"
      />
      
      <label
        htmlFor="music-upload"
        className="relative cursor-pointer flex flex-col items-center gap-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-black/50 p-6 rounded-full border border-white/10 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
        </div>
        
        <div className="relative z-10 space-y-4">
          <p className="text-xl sm:text-2xl font-medium text-white">
            Drop your music files here
          </p>
          <p className="text-gray-400">or click to select files</p>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center gap-2 border border-white/5">
              <FileMusic className="w-4 h-4 text-pink-500" />
              <span>MP3</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center gap-2 border border-white/5">
              <FileMusic className="w-4 h-4 text-purple-500" />
              <span>WAV</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm flex items-center gap-2 border border-white/5">
              <FileMusic className="w-4 h-4 text-indigo-500" />
              <span>AAC</span>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};