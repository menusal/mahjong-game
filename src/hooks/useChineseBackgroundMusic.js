import { useCallback, useEffect, useState, useRef } from "react";
import * as Tone from "tone";

// Background music file URL - served from public folder
const BACKGROUND_MUSIC_URL = "/sounds/s1.mp3";

export const useChineseBackgroundMusic = (enabled = true, volume = -25) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const playerRef = useRef(null);
  const reverbRef = useRef(null);
  const volumeRef = useRef(null);
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

        // Load MP3 file
        try {
          const absoluteUrl = new URL(
            BACKGROUND_MUSIC_URL,
            window.location.href
          ).href;
          console.log("Loading background music from:", absoluteUrl);

          // Pre-load the buffer using Tone.Buffer.load()
          const buffer = await Tone.Buffer.load(absoluteUrl);

          console.log(
            "Background music buffer loaded successfully, creating player..."
          );

          // Create player with the pre-loaded buffer
          const player = new Tone.Player(buffer);
          player.volume.value = volume;
          player.autostart = false;
          player.loop = true; // Enable looping
          player.connect(vol);

          // Set up loop callback to restart when track ends
          player.onstop = () => {
            // Only restart if we're still supposed to be playing
            if (isPlayingRef.current && playerRef.current) {
              playerRef.current.start();
            }
          };

          playerRef.current = player;
          reverbRef.current = reverb;
          volumeRef.current = vol;

          setIsInitialized(true);
          console.log("Background music player created successfully");
        } catch (error) {
          console.error("Failed to load background music:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            BACKGROUND_MUSIC_URL,
          });
          // Still set initialized to true to avoid blocking the app
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Failed to initialize background music:", error);
        setIsInitialized(true);
      }
    };

    initializeMusic();

    return () => {
      // Stop and dispose player
      if (playerRef.current) {
        playerRef.current.stop();
        playerRef.current.dispose();
        playerRef.current = null;
      }

      if (reverbRef.current) {
        reverbRef.current.dispose();
      }
      if (volumeRef.current) {
        volumeRef.current.dispose();
      }
    };
  }, [enabled, volume]);

  const stopMusic = useCallback(() => {
    isPlayingRef.current = false;
    if (playerRef.current) {
      playerRef.current.stop();
    }
    setIsPlaying(false);
    console.log("Background music stopped");
  }, []);

  const startMusic = useCallback(async () => {
    if (!isInitialized) {
      console.log("Music not initialized yet");
      return;
    }

    if (!playerRef.current) {
      console.error("Background music player not loaded");
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

      // Start playing the music
      isPlayingRef.current = true;
      playerRef.current.start();

      setIsPlaying(true);
      console.log("Background music started");
    } catch (error) {
      console.error("Failed to start background music:", error);
    }
  }, [isInitialized, isPlaying]);

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
