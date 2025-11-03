import React from 'react';
import { MOTIVATIONAL_WORDS } from '../constants/gameConstants.js';

const MotivationalWord = ({ word }) => {
  if (!word) return null;
  
  return (
    <div 
      key={word + Date.now()}
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <span 
        className="text-5xl font-bold text-white opacity-0 animate-pop-out"
        style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.7)' }}
      >
        {word}
      </span>
    </div>
  );
};

export const getRandomMotivationalWord = () => {
  return MOTIVATIONAL_WORDS[Math.floor(Math.random() * MOTIVATIONAL_WORDS.length)];
};

export default MotivationalWord;

