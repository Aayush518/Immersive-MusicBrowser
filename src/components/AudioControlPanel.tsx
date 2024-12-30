import React from 'react';
import { Settings, Zap, Waves, Volume2, Music2 } from 'lucide-react';
import { useAudioContext } from '../contexts/AudioContext';
import { AudioSlider } from './controls/AudioSlider';

export const AudioControlPanel: React.FC = () => {
  const {
    bassLevel,
    setBassLevel,
    bassBoost,
    setBassBoost,
    trebleLevel,
    setTrebleLevel,
    reverbLevel,
    setReverbLevel,
  } = useAudioContext();

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-xl p-6 space-y-6 w-80">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Audio Controls
      </h2>
      
      <div className="space-y-4">
        <AudioSlider
          label="Bass Intensity"
          icon={Volume2}
          value={bassLevel}
          onChange={setBassLevel}
        />

        <AudioSlider
          label="Neural Response"
          icon={Zap}
          value={bassBoost}
          onChange={setBassBoost}
        />

        <AudioSlider
          label="Treble"
          icon={Music2}
          value={trebleLevel}
          onChange={setTrebleLevel}
        />

        <AudioSlider
          label="Reverb"
          icon={Waves}
          value={reverbLevel}
          onChange={setReverbLevel}
        />
      </div>
    </div>
  );
};