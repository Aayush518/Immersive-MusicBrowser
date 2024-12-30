import React from 'react';
import { Volume2, Waves } from 'lucide-react';
import { useAudioContext } from '../contexts/AudioContext';

export const BassControls: React.FC = () => {
  const { bassLevel, setBassLevel, bassBoost, setBassBoost } = useAudioContext();

  return (
    <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-white mb-4">Audio Controls</h2>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-gray-300 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Bass Intensity
          </label>
          <span className="text-pink-500 font-medium">{Math.round(bassLevel * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bassLevel}
          onChange={(e) => setBassLevel(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-gray-300 flex items-center gap-2">
            <Waves className="w-5 h-5" />
            Neural Response
          </label>
          <span className="text-pink-500 font-medium">{Math.round(bassBoost * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={bassBoost}
          onChange={(e) => setBassBoost(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-pink-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
};