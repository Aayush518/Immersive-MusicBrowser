import React from 'react';
import { Volume2, Waves, Music2, Sparkles } from 'lucide-react';
import { useAudioContext } from '../contexts/AudioContext';

export const BassControls: React.FC = () => {
  const { 
    bassLevel, 
    setBassLevel, 
    bassBoost, 
    setBassBoost,
    trebleLevel,
    setTrebleLevel,
    reverbLevel,
    setReverbLevel
  } = useAudioContext();

  const controls = [
    {
      label: 'Bass Level',
      value: bassLevel,
      onChange: setBassLevel,
      icon: Volume2,
      color: 'from-pink-500 to-purple-500'
    },
    {
      label: 'Neural Response',
      value: bassBoost,
      onChange: setBassBoost,
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Treble',
      value: trebleLevel,
      onChange: setTrebleLevel,
      icon: Music2,
      color: 'from-blue-500 to-purple-500'
    },
    {
      label: 'Reverb',
      value: reverbLevel,
      onChange: setReverbLevel,
      icon: Waves,
      color: 'from-purple-500 to-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      {controls.map((control, index) => (
        <div key={control.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <control.icon className="w-4 h-4" />
              <span>{control.label}</span>
            </div>
            <span className="text-pink-500 font-medium">
              {Math.round(control.value * 100)}%
            </span>
          </div>
          
          <div className="relative h-1.5 group">
            <div className="absolute inset-0 rounded-full bg-gray-700/50" />
            <div 
              className={`absolute h-full rounded-full bg-gradient-to-r ${control.color}`}
              style={{ width: `${control.value * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={control.value}
              onChange={(e) => control.onChange(parseFloat(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${control.value * 100}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};