import { useState, useCallback, useRef } from 'react';

interface AudioProcessor {
  audioContext: AudioContext;
  analyser: AnalyserNode;
  bassFilter: BiquadFilterNode;
  sourceNode: MediaElementSourceNode | null;
}

export const useAudioProcessor = () => {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array());
  const processorRef = useRef<AudioProcessor | null>(null);
  const animationFrameRef = useRef<number>();

  const initializeAudioProcessor = useCallback(() => {
    if (!processorRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;

      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 200;

      processorRef.current = {
        audioContext: ctx,
        analyser,
        bassFilter,
        sourceNode: null
      };
    }
    return processorRef.current;
  }, []);

  const connectAudio = useCallback((audioElement: HTMLMediaElement) => {
    const processor = initializeAudioProcessor();
    
    // Clean up previous connection
    if (processor.sourceNode) {
      processor.sourceNode.disconnect();
    }

    // Create and store new source
    processor.sourceNode = processor.audioContext.createMediaElementSource(audioElement);
    
    // Connect nodes
    processor.sourceNode.connect(processor.bassFilter);
    processor.bassFilter.connect(processor.analyser);
    processor.analyser.connect(processor.audioContext.destination);

    const updateVisualizer = () => {
      const data = new Uint8Array(processor.analyser.frequencyBinCount);
      processor.analyser.getByteFrequencyData(data);
      setAudioData(data);
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  }, [initializeAudioProcessor]);

  const updateBassBoost = useCallback((level: number) => {
    if (processorRef.current) {
      processorRef.current.bassFilter.gain.value = level * 15;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (processorRef.current?.sourceNode) {
      processorRef.current.sourceNode.disconnect();
      processorRef.current.sourceNode = null;
    }
  }, []);

  return {
    audioData,
    connectAudio,
    updateBassBoost,
    cleanup
  };
};