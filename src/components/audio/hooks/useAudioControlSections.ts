import { useMemo } from 'react';
import { Volume2, Zap, Music2, Waves } from 'lucide-react';

interface AudioControlProps {
  bassLevel: number;
  setBassLevel: (level: number) => void;
  bassBoost: number;
  setBassBoost: (level: number) => void;
  trebleLevel: number;
  setTrebleLevel: (level: number) => void;
  reverbLevel: number;
  setReverbLevel: (level: number) => void;
}

export const useAudioControlSections = (props: AudioControlProps) => {
  return useMemo(() => [
    {
      title: 'Bass Controls',
      icon: Volume2,
      controls: [
        {
          label: 'Bass Level',
          value: props.bassLevel,
          onChange: props.setBassLevel,
          icon: Volume2,
          color: 'from-pink-500 to-purple-500'
        },
        {
          label: 'Bass Boost',
          value: props.bassBoost,
          onChange: props.setBassBoost,
          icon: Zap,
          color: 'from-purple-500 to-pink-500'
        }
      ]
    },
    {
      title: 'Sound Shaping',
      icon: Music2,
      controls: [
        {
          label: 'Treble',
          value: props.trebleLevel,
          onChange: props.setTrebleLevel,
          icon: Music2,
          color: 'from-blue-500 to-purple-500'
        },
        {
          label: 'Reverb',
          value: props.reverbLevel,
          onChange: props.setReverbLevel,
          icon: Waves,
          color: 'from-purple-500 to-blue-500'
        }
      ]
    }
  ], [props]);
};