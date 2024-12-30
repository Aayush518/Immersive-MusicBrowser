import { useState, useCallback, useRef, useEffect } from 'react';
import AudioContextManager from '../audio/AudioContextManager';
import { AudioProcessor } from '../audio/types';

export const useAudioProcessor = () => {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128).fill(0));
  const processorRef = useRef<AudioProcessor | null>(null);
  const sourceMapRef = useRef<WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>>(new WeakMap());
  const animationFrameRef = useRef<number>();
  const audioManager = AudioContextManager.getInstance();

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (processorRef.current) {
      try {
        const processor = processorRef.current;
        processor.analyser.disconnect();
        processor.reverbGain.disconnect();
        processor.dryGain.disconnect();
        processor.reverbNode.disconnect();
        processor.trebleFilter.disconnect();
        processor.bassFilter.disconnect();
        if (processor.sourceNode) {
          processor.sourceNode.disconnect();
        }
      } catch (error) {
        console.warn('Cleanup warning:', error);
      }
    }
    
    processorRef.current = null;
  }, []);

  const connectAudio = useCallback(async (audioElement: HTMLMediaElement) => {
    try {
      cleanup();

      // Wait for the audio element to be properly loaded
      if (!audioElement.src || audioElement.readyState < 2) {
        await new Promise((resolve) => {
          const handleCanPlay = () => {
            audioElement.removeEventListener('canplay', handleCanPlay);
            resolve(true);
          };
          audioElement.addEventListener('canplay', handleCanPlay);
        });
      }

      await audioManager.resume();

      const processor = audioManager.createProcessor();
      processorRef.current = processor;

      let sourceNode = sourceMapRef.current.get(audioElement);
      if (!sourceNode) {
        sourceNode = processor.audioContext.createMediaElementSource(audioElement);
        sourceMapRef.current.set(audioElement, sourceNode);
      }
      
      processor.sourceNode = sourceNode;

      // Connect nodes: source -> bass -> treble -> dry/wet -> destination
      sourceNode
        .connect(processor.bassFilter)
        .connect(processor.trebleFilter);

      // Split into dry and wet paths
      processor.trebleFilter.connect(processor.dryGain);
      processor.trebleFilter.connect(processor.reverbNode);
      processor.reverbNode.connect(processor.reverbGain);

      // Connect to analyzer and destination
      processor.dryGain.connect(processor.analyser);
      processor.reverbGain.connect(processor.analyser);
      processor.analyser.connect(processor.audioContext.destination);

      const updateVisualizer = () => {
        if (!processor.analyser) return;
        const data = new Uint8Array(processor.analyser.frequencyBinCount);
        processor.analyser.getByteFrequencyData(data);
        setAudioData(data);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };

      updateVisualizer();
      return true;
    } catch (error) {
      console.error('Error connecting audio:', error);
      cleanup();
      return false;
    }
  }, [cleanup, audioManager]);

  const updateBassBoost = useCallback((level: number) => {
    if (processorRef.current?.bassFilter) {
      processorRef.current.bassFilter.gain.value = level * 15;
    }
  }, []);

  const updateTreble = useCallback((level: number) => {
    if (processorRef.current?.trebleFilter) {
      processorRef.current.trebleFilter.gain.value = (level - 0.5) * 20;
    }
  }, []);

  const updateReverb = useCallback((level: number) => {
    if (processorRef.current) {
      processorRef.current.reverbGain.gain.value = level;
      processorRef.current.dryGain.gain.value = 1 - level;
    }
  }, []);

  return {
    audioData,
    connectAudio,
    updateBassBoost,
    updateTreble,
    updateReverb,
    cleanup
  };
};