import { useCallback, useEffect, useState } from "react";
import * as Tone from "tone";

// Use public folder path - Vite serves files from public/ at root
const APPLAUSE_SOUND_URL = "/sounds/applause.mp3";
const BIEN_SOUND_URL = "/sounds/bien.mp3";
const MAL_SOUND_URL = "/sounds/mal.mp3";

export const useSoundEffects = () => {
  const [synth, setSynth] = useState(null);
  const [noiseSynth, setNoiseSynth] = useState(null);
  const [applausePlayer, setApplausePlayer] = useState(null);
  const [bienPlayer, setBienPlayer] = useState(null);
  const [malPlayer, setMalPlayer] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const reverb = new Tone.Reverb(0.5);
      const synthInstance = new Tone.Synth().connect(reverb);
      reverb.toDestination();
      setSynth(synthInstance);

      // Create noise synth for clap sound
      const noise = new Tone.Noise({
        type: "white",
        volume: -10,
      });

      const filter = new Tone.Filter({
        frequency: 2000,
        type: "bandpass",
      });

      const envelope = new Tone.AmplitudeEnvelope({
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
      });

      noise.connect(filter);
      filter.connect(envelope);
      envelope.toDestination();

      setNoiseSynth({ noise, envelope });

      // Load applause sound from public folder
      // Files in public/ are served at root, so /sounds/applause.mp3 is accessible
      // Use Tone.Buffer to load first, then create Player with buffer
      const loadApplauseSound = async () => {
        try {
          const absoluteUrl = new URL(APPLAUSE_SOUND_URL, window.location.href)
            .href;

          console.log("Loading applause sound from:", absoluteUrl);

          // Pre-load the buffer using Tone.Buffer.load()
          const buffer = await Tone.Buffer.load(absoluteUrl);

          console.log("Buffer loaded successfully, creating player...");

          // Create player with the pre-loaded buffer
          // Pass buffer directly (not wrapped in url property)
          const player = new Tone.Player(buffer);
          player.volume.value = -5;
          player.autostart = false;
          player.toDestination();

          setApplausePlayer(player);
          console.log("Applause sound player created successfully");
        } catch (e) {
          console.error("Failed to load applause sound:", e);
          console.error("Error details:", {
            message: e.message,
            stack: e.stack,
            APPLAUSE_SOUND_URL,
          });
        }
      };

      // Load asynchronously
      loadApplauseSound();

      // Load bien sound from public folder
      const loadBienSound = async () => {
        try {
          const absoluteUrl = new URL(BIEN_SOUND_URL, window.location.href).href;

          console.log("Loading bien sound from:", absoluteUrl);

          // Pre-load the buffer using Tone.Buffer.load()
          const buffer = await Tone.Buffer.load(absoluteUrl);

          console.log("Bien buffer loaded successfully, creating player...");

          // Create player with the pre-loaded buffer
          const player = new Tone.Player(buffer);
          player.volume.value = -5;
          player.autostart = false;
          player.toDestination();

          setBienPlayer(player);
          console.log("Bien sound player created successfully");
        } catch (e) {
          console.error("Failed to load bien sound:", e);
          console.error("Error details:", {
            message: e.message,
            stack: e.stack,
            BIEN_SOUND_URL,
          });
        }
      };

      // Load asynchronously
      loadBienSound();

      // Load mal sound from public folder
      const loadMalSound = async () => {
        try {
          const absoluteUrl = new URL(MAL_SOUND_URL, window.location.href).href;

          console.log("Loading mal sound from:", absoluteUrl);

          // Pre-load the buffer using Tone.Buffer.load()
          const buffer = await Tone.Buffer.load(absoluteUrl);

          console.log("Mal buffer loaded successfully, creating player...");

          // Create player with the pre-loaded buffer
          const player = new Tone.Player(buffer);
          player.volume.value = -5;
          player.autostart = false;
          player.toDestination();

          setMalPlayer(player);
          console.log("Mal sound player created successfully");
        } catch (e) {
          console.error("Failed to load mal sound:", e);
          console.error("Error details:", {
            message: e.message,
            stack: e.stack,
            MAL_SOUND_URL,
          });
        }
      };

      // Load asynchronously
      loadMalSound();
    } catch (e) {
      console.error("Failed to create Tone.Synth", e);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const playClickSound = useCallback(() => {
    if (noiseSynth) {
      try {
        const { noise, envelope } = noiseSynth;
        // Start noise if not already running
        if (noise.state !== "started") {
          noise.start();
        }
        // Trigger a short percussive clap sound
        envelope.triggerAttackRelease(0.08, Tone.now());
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    } else if (synth) {
      // Fallback to simple click if noise synth not ready
      try {
        synth.triggerAttackRelease("C5", "32n", Tone.now());
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [noiseSynth, synth]);

  const playMatchSound = useCallback(async () => {
    // Ensure audio context is started
    if (Tone.context.state !== "running") {
      try {
        await Tone.start();
      } catch (e) {
        console.error("Failed to start Tone context in playMatchSound:", e);
      }
    }

    // Play bien sound
    if (bienPlayer) {
      try {
        // Check if player is loaded
        if (bienPlayer.loaded) {
          // Stop and restart if already playing
          if (bienPlayer.state === "started") {
            bienPlayer.stop();
          }
          bienPlayer.start();
        } else {
          console.warn("Bien player not loaded yet");
        }
      } catch (e) {
        console.error("Error playing bien sound:", e);
        // Fallback to synth if player fails
        if (synth) {
          try {
            const now = Tone.now();
            synth.triggerAttackRelease("C5", "16n", now);
            synth.triggerAttackRelease("E5", "16n", now + 0.1);
            synth.triggerAttackRelease("G5", "8n", now + 0.2);
          } catch (synthError) {
            console.error("Error en sonido:", synthError);
          }
        }
      }
    } else if (synth) {
      // Fallback to synth if player not initialized
      try {
        const now = Tone.now();
        synth.triggerAttackRelease("C5", "16n", now);
        synth.triggerAttackRelease("E5", "16n", now + 0.1);
        synth.triggerAttackRelease("G5", "8n", now + 0.2);
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [bienPlayer, synth]);

  const playWinSound = useCallback(async () => {
    // Ensure audio context is started
    if (Tone.context.state !== "running") {
      try {
        await Tone.start();
      } catch (e) {
        console.error("Failed to start Tone context in playWinSound:", e);
      }
    }

    // Play applause sound only
    if (applausePlayer) {
      try {
        // Check if player is loaded
        if (applausePlayer.loaded) {
          // Stop and restart if already playing
          if (applausePlayer.state === "started") {
            applausePlayer.stop();
          }
          applausePlayer.start();
        } else {
          console.warn("Applause player not loaded yet");
        }
      } catch (e) {
        console.error("Error playing applause:", e);
      }
    } else {
      console.warn("Applause player not initialized");
    }
  }, [applausePlayer]);

  const playErrorSound = useCallback(async () => {
    // Ensure audio context is started
    if (Tone.context.state !== "running") {
      try {
        await Tone.start();
      } catch (e) {
        console.error("Failed to start Tone context in playErrorSound:", e);
      }
    }

    // Play mal sound
    if (malPlayer) {
      try {
        // Check if player is loaded
        if (malPlayer.loaded) {
          // Stop and restart if already playing
          if (malPlayer.state === "started") {
            malPlayer.stop();
          }
          malPlayer.start();
        } else {
          console.warn("Mal player not loaded yet");
        }
      } catch (e) {
        console.error("Error playing mal sound:", e);
        // Fallback to synth if player fails
        if (synth) {
          try {
            synth.triggerAttackRelease("C3", "8n", Tone.now());
          } catch (synthError) {
            console.error("Error en sonido:", synthError);
          }
        }
      }
    } else if (synth) {
      // Fallback to synth if player not initialized
      try {
        synth.triggerAttackRelease("C3", "8n", Tone.now());
      } catch (e) {
        console.error("Error en sonido:", e);
      }
    }
  }, [malPlayer, synth]);

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

  const startAudioContext = useCallback(async () => {
    if (synth && Tone.context.state !== "running") {
      try {
        await Tone.start();
      } catch (e) {
        console.error("Failed to start Tone context", e);
      }
    }
  }, [synth]);

  // Expose player state for testing (only in development/test)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV !== "production"
    ) {
      (window.__testSoundEffects =
        window.__testSoundEffects || {}).applausePlayer = applausePlayer;
      (window.__testSoundEffects = window.__testSoundEffects || {}).synth =
        synth;
      (window.__testSoundEffects = window.__testSoundEffects || {}).bienPlayer =
        bienPlayer;
      (window.__testSoundEffects = window.__testSoundEffects || {}).malPlayer =
        malPlayer;
    }
  }, [applausePlayer, synth, bienPlayer, malPlayer]);

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
