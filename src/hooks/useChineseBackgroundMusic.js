import { useCallback, useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";

// MIDI file URL - served from public folder
const MIDI_FILE_URL = "/sounds/Er_Quan_Yang_Yue.mid";

export const useChineseBackgroundMusic = (enabled = true, volume = -25) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const midiRef = useRef(null);
  const reverbRef = useRef(null);
  const volumeRef = useRef(null);
  const synthsRef = useRef([]);
  const scheduledEventsRef = useRef([]);
  const loopIdRef = useRef(null);
  const isPlayingRef = useRef(false);

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

        await reverb.generate();

        // Load and parse MIDI file
        try {
          const absoluteUrl = new URL(MIDI_FILE_URL, window.location.href).href;
          console.log("Loading MIDI file from:", absoluteUrl);

          const response = await fetch(absoluteUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch MIDI file: ${response.statusText}`);
          }

          const arrayBuffer = await response.arrayBuffer();
          const midi = new Midi(arrayBuffer);

          console.log("MIDI file loaded successfully", {
            duration: midi.duration,
            tracks: midi.tracks.length,
          });

          midiRef.current = midi;
          reverbRef.current = reverb;
          volumeRef.current = vol;

          setIsInitialized(true);
        } catch (error) {
          console.error("Failed to load MIDI file:", error);
          // Still set initialized to true to avoid blocking the app
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize Chinese background music:", error);
        setIsInitialized(true);
      }
    };

    initializeMusic();

    return () => {
      // Cleanup - clear scheduled events directly
      scheduledEventsRef.current.forEach((eventId) => {
        Tone.Transport.clear(eventId);
      });
      scheduledEventsRef.current = [];

      // Stop and dispose all synths
      synthsRef.current.forEach((synth) => {
        // PluckSynth doesn't have releaseAll, just dispose
        if (synth && typeof synth.dispose === 'function') {
          synth.dispose();
        }
      });
      synthsRef.current = [];

      // Clear loop event
      if (loopIdRef.current !== null) {
        Tone.Transport.clear(loopIdRef.current);
        loopIdRef.current = null;
      }

      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      if (volumeRef.current) {
        volumeRef.current.dispose();
      }
    };
  }, [enabled, volume]);

  const clearScheduledEvents = useCallback(() => {
    // Clear all scheduled events
    scheduledEventsRef.current.forEach((eventId) => {
      Tone.Transport.clear(eventId);
    });
    scheduledEventsRef.current = [];

    // Stop and dispose all synths
    synthsRef.current.forEach((synth) => {
      // PluckSynth doesn't have releaseAll, just dispose
      if (synth && typeof synth.dispose === 'function') {
        synth.dispose();
      }
    });
    synthsRef.current = [];

    // Clear loop event
    if (loopIdRef.current !== null) {
      Tone.Transport.clear(loopIdRef.current);
      loopIdRef.current = null;
    }
  }, []);

  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    clearScheduledEvents();
    setIsPlaying(false);
    console.log("Chinese background music stopped");
  }, [clearScheduledEvents]);

  const scheduleMidiPlayback = useCallback((startTime = 0) => {
    if (!midiRef.current) {
      console.error("MIDI file not loaded");
      return;
    }

    // Clear any existing scheduled events first
    clearScheduledEvents();

    const midi = midiRef.current;
    const synths = [];
    const eventIds = [];

    // Ensure startTime is in the future and greater than current Transport time
    const currentTransportTime = Tone.Transport.now();
    const safeStartTime = Math.max(startTime, currentTransportTime + 0.01);

    // Track the last scheduled time to ensure strictly increasing times
    let lastScheduledTime = safeStartTime;

    // Create a synth for each track
    midi.tracks.forEach((track, trackIndex) => {
      if (track.notes.length === 0) return; // Skip empty tracks

      // Use PluckSynth for a more authentic Chinese instrument sound
      const synth = new Tone.PluckSynth({
        attackNoise: 0.7,
        resonance: 0.95,
        dampening: 4000,
      }).connect(volumeRef.current);

      synths.push(synth);

      // Schedule all notes in this track
      // Sort notes by time to ensure events are scheduled in order
      const sortedNotes = [...track.notes].sort((a, b) => a.time - b.time);
      
      sortedNotes.forEach((note) => {
        let noteTime = safeStartTime + note.time;
        
        // Ensure each note time is strictly greater than previous scheduled time
        if (noteTime <= lastScheduledTime) {
          noteTime = lastScheduledTime + 0.001; // Small epsilon to ensure strictly greater
        }
        lastScheduledTime = noteTime;
        
        const eventId = Tone.Transport.schedule(() => {
          synth.triggerAttackRelease(
            note.name,
            note.duration,
            Tone.now(),
            note.velocity / 127 // Normalize velocity from 0-127 to 0-1
          );
        }, noteTime);

        eventIds.push(eventId);
      });
    });

    synthsRef.current = synths;
    scheduledEventsRef.current = eventIds;

    // Schedule loop restart - reschedule all notes when the song ends
    // Use a small offset to ensure next start time is strictly greater
    const loopEndTime = Math.max(lastScheduledTime + 0.01, safeStartTime + midi.duration);
    const loopEventId = Tone.Transport.schedule(() => {
      // Only continue looping if we're still supposed to be playing
      if (midiRef.current && isPlayingRef.current) {
        // Get current time and add a small buffer to ensure strictly greater
        const nextStartTime = Tone.Transport.now() + 0.01;
        scheduleMidiPlayback(nextStartTime);
      }
    }, loopEndTime);

    loopIdRef.current = loopEventId;
  }, [clearScheduledEvents]);

  const startMusic = useCallback(async () => {
    if (!isInitialized) {
      console.log("Music not initialized yet");
      return;
    }

    if (!midiRef.current) {
      console.error("MIDI file not loaded");
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

      // Schedule MIDI playback starting from current Transport time
      isPlayingRef.current = true;
      scheduleMidiPlayback(Tone.Transport.now());

      setIsPlaying(true);
      console.log("Chinese background music started");
    } catch (error) {
      console.error("Failed to start Chinese background music:", error);
    }
  }, [isInitialized, isPlaying, scheduleMidiPlayback]);

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
