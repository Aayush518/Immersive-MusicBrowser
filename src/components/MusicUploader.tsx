import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface Props {
  onUpload: (files: File[]) => void;
}

export const MusicUploader: React.FC<Props> = ({ onUpload }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('audio/')
    );
    onUpload(files);
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files).filter(file => 
      file.type.startsWith('audio/')
    ) : [];
    onUpload(files);
  }, [onUpload]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
    >
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
        className="cursor-pointer flex flex-col items-center gap-4"
      >
        <Upload className="w-12 h-12 text-gray-400" />
        <div>
          <p className="text-lg font-medium text-gray-700">Drop your music files here</p>
          <p className="text-sm text-gray-500">or click to select files</p>
        </div>
      </label>
    </div>
  );
};