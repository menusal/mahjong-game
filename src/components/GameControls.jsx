import React from 'react';

const GameControls = ({ onHint, canHint, hintsRemaining, level, remainingTiles }) => {
  return (
    <div className="flex justify-between items-center w-full mt-4">
      <div className="text-2xl font-bold text-white shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Level {level}
      </div>
      
      <div className="text-2xl font-bold text-white shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Restantes {remainingTiles}
      </div>
      
      <button
        onClick={onHint}
        disabled={!canHint}
        className="relative px-4 py-2 bg-yellow-500 text-gray-900 rounded-md shadow-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
        aria-label="Mostrar pista"
      >
        Pista
        {hintsRemaining > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
            {hintsRemaining}
          </span>
        )}
      </button>
    </div>
  );
};

export default GameControls;

