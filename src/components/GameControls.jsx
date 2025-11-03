import React from 'react';

const GameControls = ({ onRestart, onUndo, onHint, canUndo, canHint }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-4 w-full">
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition-colors"
        aria-label="Reiniciar nivel"
      >
        Reiniciar
      </button>
      
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-4 py-2 bg-gray-600 rounded-md shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Deshacer último movimiento"
      >
        Deshacer
      </button>
      
      <button
        onClick={onHint}
        disabled={!canHint}
        className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md shadow-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
        aria-label="Mostrar pista"
      >
        Pista
      </button>
    </div>
  );
};

export default GameControls;

