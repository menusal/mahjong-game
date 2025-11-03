import { useEffect } from 'react';

export const useConfetti = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const scriptConfetti = document.createElement('script');
    scriptConfetti.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
    scriptConfetti.async = true;
    scriptConfetti.onload = () => console.log("Confetti script loaded");
    scriptConfetti.onerror = () => console.error("Failed to load confetti script");
    document.head.appendChild(scriptConfetti);
    
    return () => {
      try {
        document.head.removeChild(scriptConfetti);
      } catch (e) {
        // Ignore
      }
    };
  }, []);
  
  const triggerConfetti = (options = {}) => {
    if (window.confetti) {
      try {
        window.confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          zIndex: 1000,
          scalar: 0.7,
          ...options,
        });
      } catch (e) {
        console.error("Error en confeti:", e);
      }
    }
  };
  
  const triggerWinConfetti = () => {
    triggerConfetti({
      particleCount: 200,
      spread: 100,
    });
  };
  
  return {
    triggerConfetti,
    triggerWinConfetti,
  };
};


