export interface AudioProcessor {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  bassFilter: BiquadFilterNode;
  trebleFilter: BiquadFilterNode;
  reverbNode: ConvolverNode;
  reverbGain: GainNode;
  dryGain: GainNode;
  sourceNode: MediaElementAudioSourceNode | null;
}