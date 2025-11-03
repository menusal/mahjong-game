import React from 'react';
import { GAME_STATES } from '../constants/uiConstants.js';

const GameOverlay = ({ gameState, level, onStartGame, onNextLevel, onRestart }) => {
  if (gameState === GAME_STATES.START) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center p-4">
        <div 
          className="text-5xl font-bold text-white mb-6" 
          style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.7)' }}
        >
          Nivel {level}
        </div>
        <button 
          onClick={onStartGame} 
          className="px-8 py-4 bg-yellow-500 text-gray-900 text-2xl font-bold rounded-lg shadow-xl hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105"
          aria-label="Comenzar nivel"
        >
          Comenzar
        </button>
      </div>
    );
  }
  
  if (gameState === GAME_STATES.WON) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center p-4">
        <h2 
          className="text-5xl font-bold text-green-400 mb-4" 
          style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.7)' }}
        >
          ¡Enhorabuena!
        </h2>
        <p className="text-2xl text-white mb-10">
          Nivel {level} completado
        </p>
        <button 
          onClick={onNextLevel} 
          className="px-8 py-4 bg-blue-600 text-white text-2xl font-bold rounded-lg shadow-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          aria-label="Siguiente nivel"
        >
          Siguiente Nivel
        </button>
      </div>
    );
  }
  
  if (gameState === GAME_STATES.SHUFFLING) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center p-4">
        <h2 
          className="text-4xl font-bold text-yellow-400 mb-10 animate-pulse" 
          style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.7)' }}
        >
          Barajando fichas...
        </h2>
      </div>
    );
  }
  
  if (gameState === GAME_STATES.STUCK) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center p-4 bg-black bg-opacity-60">
        <h2 
          className="text-4xl font-bold text-red-500 mb-10" 
          style={{ textShadow: '3px 3px 10px rgba(0,0,0,0.7)' }}
        >
          ¡No hay más movimientos!
        </h2>
        <p className="text-xl text-white mb-10">El barajado automático falló.</p>
        <button 
          onClick={onRestart} 
          className="px-8 py-4 bg-gray-600 text-white text-2xl font-bold rounded-lg shadow-xl hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
          aria-label="Reiniciar nivel"
        >
          Reiniciar Nivel
        </button>
      </div>
    );
  }
  
  return null;
};

export default GameOverlay;

