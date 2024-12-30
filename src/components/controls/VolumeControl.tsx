import React from 'react';

interface Props {
  volume: number;
  onChange: (volume: number) => void;
  isMuted: boolean;
}

export const VolumeControl: React.FC<Props> = ({ volume, onChange, isMuted }) => {
  return (
    <div className="w-24 flex items-center">
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-gray-700 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer"
      />
    </div>
  );
};