import { useCallback, useEffect, useState } from 'react';
import { BOARD_LAYOUTS } from '../constants/boardLayouts.js';
import { createBoardFromLayout, autoSolveBoard } from '../utils/tileUtils.js';
import { checkForMoves, shuffleBoard, updateSelectable } from '../utils/gameUtils.js';

export const useGameState = () => {
  const [board, setBoard] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [gameState, setGameState] = useState('loading');
  const [moveHistory, setMoveHistory] = useState([]);
  const [hint, setHint] = useState(null);
  const [level, setLevel] = useState(1);
  
  const setupGame = useCallback(() => {
    const layoutData = BOARD_LAYOUTS[(level - 1) % BOARD_LAYOUTS.length];
    const selectedLayout = layoutData.layout;
    const tilesNeeded = selectedLayout.length;
    const pairsNeeded = tilesNeeded / 2;
    
    try {
      let newBoard = createBoardFromLayout(selectedLayout, level);
      newBoard = updateSelectable(newBoard);
      
      let hasMoves = checkForMoves(newBoard);
      let attempts = 0;
      
      while (!hasMoves && attempts < 50) {
        newBoard = shuffleBoard(newBoard);
        newBoard = updateSelectable(newBoard);
        hasMoves = checkForMoves(newBoard);
        attempts++;
      }
      
      newBoard = autoSolveBoard(newBoard, pairsNeeded);
      
      setBoard(newBoard);
      setSelectedId(null);
      setMoveHistory([]);
      setHint(null);
    } catch (error) {
      console.error(error);
      setGameState('stuck');
    }
  }, [level]);
  
  useEffect(() => {
    let initialLevel = 1;
    try {
      const savedLevel = localStorage.getItem('mahjongLevel');
      if (savedLevel && !isNaN(parseInt(savedLevel, 10))) {
        initialLevel = parseInt(savedLevel, 10);
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
    
    setLevel(initialLevel);
    setGameState('start');
  }, []);
  
  useEffect(() => {
    if (gameState === 'start' || gameState === 'loading') {
      setupGame();
    }
  }, [level, gameState, setupGame]);
  
  const handleShuffleRemaining = useCallback((currentBoard) => {
    setGameState('shuffling');
    
    setTimeout(() => {
      let newBoard = [...currentBoard];
      let boardHasMoves = false;
      let shuffleAttempts = 0;
      
      while (!boardHasMoves && shuffleAttempts < 100) {
        shuffleAttempts++;
        newBoard = shuffleBoard(newBoard);
        newBoard = updateSelectable(newBoard);
        boardHasMoves = checkForMoves(newBoard);
      }
      
      if (!boardHasMoves) {
        setGameState('stuck');
      } else {
        setBoard(newBoard);
        setMoveHistory([]);
        setSelectedId(null);
        setHint(null);
        setGameState('playing');
      }
    }, 100);
  }, []);
  
  const handleNextLevel = useCallback(() => {
    const newLevel = level + 1;
    setLevel(newLevel);
    
    try {
      localStorage.setItem('mahjongLevel', newLevel.toString());
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
    
    setGameState('start');
  }, [level]);
  
  const handleRestart = useCallback(() => {
    setupGame();
    setGameState('playing');
  }, [setupGame]);
  
  const handleStartGame = useCallback(() => {
    setGameState('playing');
  }, []);
  
  return {
    board,
    selectedId,
    gameState,
    moveHistory,
    hint,
    level,
    setBoard,
    setSelectedId,
    setGameState,
    setMoveHistory,
    setHint,
    handleShuffleRemaining,
    handleNextLevel,
    handleRestart,
    handleStartGame,
  };
};

