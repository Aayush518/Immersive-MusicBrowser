import React from 'react';
import { AudioSlider } from './AudioSlider';
import { ControlSection } from './ControlSection';
import { useAudioControlSections } from './hooks/useAudioControlSections';

interface AudioControlsProps {
  bassLevel: number;
  setBassLevel: (level: number) => void;
  bassBoost: number;
  setBassBoost: (level: number) => void;
  trebleLevel: number;
  setTrebleLevel: (level: number) => void;
  reverbLevel: number;
  setReverbLevel: (level: number) => void;
}

export const AudioControls: React.FC<AudioControlsProps> = (props) => {
  const sections = useAudioControlSections(props);

  return (
    <div className="p-4 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
      {sections.map((section) => (
        <ControlSection
          key={section.title}
          title={section.title}
          icon={section.icon}
        >
          {section.controls.map((control, index) => (
            <AudioSlider
              key={index}
              label={control.label}
              value={control.value}
              onChange={control.onChange}
              icon={control.icon}
              color={control.color}
            />
          ))}
        </ControlSection>
      ))}
    </div>
  );
};