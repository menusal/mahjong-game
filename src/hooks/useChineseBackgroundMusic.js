import { useCallback, useEffect, useState, useRef } from "react";
import * as Tone from "tone";

// Chinese pentatonic scale (C major pentatonic: C, D, E, G, A)
const CHINESE_PENTATONIC_SCALE = [
  "C4",
  "D4",
  "E4",
  "G4",
  "A4",
  "C5",
  "D5",
  "E5",
  "G5",
  "A5",
];

export const useChineseBackgroundMusic = (enabled = true, volume = -25) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const synthRef = useRef(null);
  const reverbRef = useRef(null);
  const volumeRef = useRef(null);
  const sequenceRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const initializeMusic = async () => {
      try {
        // Create reverb for ambient sound
        const reverb = new Tone.Reverb({
          roomSize: 100.9,
          dampening: 4000,
          wet: 0.5,
        }).toDestination();

        // Create volume control
        const vol = new Tone.Volume(volume).connect(reverb);

        // Create a plucked string synth (sounds more like Chinese instruments like guzheng or pipa)
        const synth = new Tone.PluckSynth({
          attackNoise: 0.7,
          resonance: 0.95,
          dampening: 4000,
        }).connect(vol);

        await reverb.generate();

        synthRef.current = synth;
        reverbRef.current = reverb;
        volumeRef.current = vol;

        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Chinese background music:", error);
      }
    };

    initializeMusic();

    return () => {
      // Cleanup
      if (sequenceRef.current) {
        sequenceRef.current.stop();
        sequenceRef.current.dispose();
      }
      if (synthRef.current) {
        synthRef.current.dispose();
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      if (volumeRef.current) {
        volumeRef.current.dispose();
      }
    };
  }, [enabled, volume]);

  const startMusic = useCallback(async () => {
    if (!isInitialized || !synthRef.current) {
      console.log("Music not initialized yet or synth not ready", {
        isInitialized,
        synthReady: !!synthRef.current,
      });
      return;
    }

    if (isPlaying) {
      console.log("Music already playing");
      return;
    }

    try {
      // Start audio context if needed
      if (Tone.context.state !== "running") {
        await Tone.start();
        console.log("Tone context started");
      }

      // Start Tone Transport if not already started
      if (Tone.Transport.state !== "started") {
        Tone.Transport.start();
      }

      // Generate a random melodic pattern using Chinese pentatonic scale
      // This creates a unique melody for each game while maintaining musical coherence
      const generateRandomPattern = () => {
        const patternLength = 10 + Math.floor(Math.random() * 6); // 10-15 notes
        const pattern = [];

        // Start with a lower note for a peaceful beginning
        let currentIndex = Math.floor(Math.random() * 3); // 0-2 (C4, D4, or E4)
        pattern.push(CHINESE_PENTATONIC_SCALE[currentIndex]);

        for (let i = 1; i < patternLength; i++) {
          // Move up or down by 1-3 steps in the scale (keeps it musical)
          const step = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          const nextIndex = Math.max(
            0,
            Math.min(CHINESE_PENTATONIC_SCALE.length - 1, currentIndex + step)
          );

          // Occasionally jump to a higher or lower octave for variety
          if (Math.random() < 0.2) {
            const octaveJump = Math.random() < 0.5 ? -5 : 5;
            const jumpIndex = Math.max(
              0,
              Math.min(
                CHINESE_PENTATONIC_SCALE.length - 1,
                nextIndex + octaveJump
              )
            );
            pattern.push(CHINESE_PENTATONIC_SCALE[jumpIndex]);
            currentIndex = jumpIndex;
          } else {
            pattern.push(CHINESE_PENTATONIC_SCALE[nextIndex]);
            currentIndex = nextIndex;
          }
        }

        // End with a return to lower notes for a peaceful conclusion
        pattern.push(CHINESE_PENTATONIC_SCALE[Math.floor(Math.random() * 3)]);
        pattern.push(CHINESE_PENTATONIC_SCALE[0]); // Always end on C4

        return pattern;
      };

      const pattern = generateRandomPattern();

      // Create a sequence that loops with longer note durations
      const sequence = new Tone.Sequence(
        (time, note) => {
          if (synthRef.current) {
            // Use longer note durations for a more meditative feel
            synthRef.current.triggerAttackRelease(note, "4n", time);
          }
        },
        pattern,
        "2n" // Play every half note for slower tempo
      );

      sequence.start(0);
      sequenceRef.current = sequence;
      setIsPlaying(true);
      console.log("Chinese background music started");
    } catch (error) {
      console.error("Failed to start Chinese background music:", error);
    }
  }, [isInitialized, isPlaying]);

  const stopMusic = useCallback(() => {
    if (sequenceRef.current) {
      sequenceRef.current.stop();
      sequenceRef.current.dispose();
      sequenceRef.current = null;
    }
    setIsPlaying(false);
    console.log("Chinese background music stopped");
  }, []);

  const setVolume = useCallback((newVolume) => {
    if (volumeRef.current) {
      volumeRef.current.volume.value = newVolume;
    }
  }, []);

  return {
    isPlaying,
    isInitialized,
    startMusic,
    stopMusic,
    setVolume,
  };
};
