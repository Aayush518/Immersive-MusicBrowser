import React from 'react';
import { Settings } from 'lucide-react';
import { AudioControls } from './AudioControls';
import { useAudioContext } from '../../contexts/AudioContext';

export const AudioControlPanel: React.FC = () => {
  const audioContext = useAudioContext();

  return (
    <div className="sticky top-6">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Audio Controls
            </h2>
          </div>
        </div>

        <div className="p-6">
          <AudioControls {...audioContext} />
        </div>
      </div>
    </div>
  );
};