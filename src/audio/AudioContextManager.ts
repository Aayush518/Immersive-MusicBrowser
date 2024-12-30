import { AudioProcessor } from './types';

class AudioContextManager {
  private static instance: AudioContextManager;
  private audioContext: AudioContext | null = null;
  
  private constructor() {}
  
  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }
  
  getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }
  
  createProcessor(): AudioProcessor {
    const ctx = this.getContext();
    
    // Analyzer for visualization
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;

    // Bass filter
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 200;
    bassFilter.gain.value = 0;

    // Treble filter
    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 2500;
    trebleFilter.gain.value = 0;

    // Reverb (ConvolverNode)
    const reverbNode = ctx.createConvolver();
    this.createReverbImpulse(ctx, reverbNode);

    // Dry/Wet mix for reverb
    const reverbGain = ctx.createGain();
    const dryGain = ctx.createGain();
    reverbGain.gain.value = 0.3;
    dryGain.gain.value = 0.7;

    return {
      audioContext: ctx,
      analyser,
      bassFilter,
      trebleFilter,
      reverbNode,
      reverbGain,
      dryGain,
      sourceNode: null
    };
  }

  private async createReverbImpulse(ctx: AudioContext, reverb: ConvolverNode) {
    const length = 48000;
    const decay = 2.0;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    
    reverb.buffer = impulse;
  }
  
  resume(): Promise<void> {
    return this.audioContext?.resume() || Promise.resolve();
  }
}

export default AudioContextManager;