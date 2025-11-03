import { useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';

export const useSoundEffects = () => {
  const [synth, setSynth] = useState(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const reverb = new Tone.Reverb(1.5);
      const synthInstance = new Tone.Synth().connect(reverb);
      reverb.toDestination();
      setSynth(synthInstance);
    } catch (e) {
      console.error("Failed to create Tone.Synth", e);
    }
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  const playClickSound = useCallback(() => {
    if (synth) {
      try {
        synth.triggerAttackRelease("C5", "32n", Tone.now());
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [synth]);
  
  const playMatchSound = useCallback(() => {
    if (synth) {
      try {
        const now = Tone.now();
        synth.triggerAttackRelease("C5", "16n", now);
        synth.triggerAttackRelease("E5", "16n", now + 0.1);
        synth.triggerAttackRelease("G5", "8n", now + 0.2);
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [synth]);
  
  const playWinSound = useCallback(() => {
    if (synth) {
      try {
        const now = Tone.now();
        synth.triggerAttackRelease("C5", "16n", now);
        synth.triggerAttackRelease("E5", "16n", now + 0.1);
        synth.triggerAttackRelease("G5", "16n", now + 0.2);
        synth.triggerAttackRelease("C6", "16n", now + 0.3);
        synth.triggerAttackRelease("G5", "16n", now + 0.4);
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [synth]);
  
  const playErrorSound = useCallback(() => {
    if (synth) {
      try {
        synth.triggerAttackRelease("C3", "8n", Tone.now());
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [synth]);
  
  const playShuffleSound = useCallback(() => {
    if (synth) {
      try {
        const now = Tone.now();
        synth.triggerAttackRelease("E4", "16n", now);
        synth.triggerAttackRelease("D4", "16n", now + 0.1);
        synth.triggerAttackRelease("C4", "16n", now + 0.2);
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [synth]);
  
  const playUndoSound = useCallback(() => {
    if (synth) {
      try {
        synth.triggerAttackRelease("A3", "16n", Tone.now());
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [synth]);
  
  const startAudioContext = useCallback(() => {
    if (synth && Tone.context.state !== 'running') {
      try {
        Tone.start();
      } catch (e) {
        console.error("Failed to start Tone context", e);
      }
    }
  }, [synth]);
  
  return {
    synth,
    playClickSound,
    playMatchSound,
    playWinSound,
    playErrorSound,
    playShuffleSound,
    playUndoSound,
    startAudioContext,
  };
};

