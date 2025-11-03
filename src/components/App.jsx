import React, { useState, useCallback, useEffect } from "react";
import { useGameState } from "../hooks/useGameState.js";
import { useSoundEffects } from "../hooks/useSoundEffects.js";
import { useConfetti } from "../hooks/useConfetti.js";
import { useChineseBackgroundMusic } from "../hooks/useChineseBackgroundMusic.js";
import {
  areTilesMatch,
  checkForMoves,
  findValidPairs,
  updateSelectable,
} from "../utils/gameUtils.js";
import { GAME_STATES } from "../constants/uiConstants.js";
import GameBoard from "./GameBoard.jsx";
import GameControls from "./GameControls.jsx";
import GameOverlay from "./GameOverlay.jsx";
import MotivationalWord, {
  getRandomMotivationalWord,
} from "./MotivationalWord.jsx";

const App = () => {
  const {
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
  } = useGameState();

  const {
    playClickSound,
    playMatchSound,
    playWinSound,
    playErrorSound,
    playShuffleSound,
    playUndoSound,
    startAudioContext,
  } = useSoundEffects();

  const { triggerConfetti, triggerWinConfetti } = useConfetti();

  const { startMusic, stopMusic, isPlaying, isInitialized } =
    useChineseBackgroundMusic(true, -25);

  const [motivationalWord, setMotivationalWord] = useState(null);

  // Start music when game starts playing and music is initialized
  useEffect(() => {
    if (!isInitialized) return;

    if (gameState === GAME_STATES.PLAYING && !isPlaying) {
      startMusic();
    } else if (gameState !== GAME_STATES.PLAYING && isPlaying) {
      stopMusic();
    }
  }, [gameState, isPlaying, isInitialized, startMusic, stopMusic]);

  const handleTileClick = useCallback(
    (id) => {
      if (gameState !== GAME_STATES.PLAYING) return;

      setHint(null);
      const clickedTile = board.find((t) => t.id === id);
      if (!clickedTile || !clickedTile.isSelectable) return;

      playClickSound();

      if (selectedId === null) {
        setSelectedId(id);
      } else {
        if (selectedId === id) {
          setSelectedId(null);
          return;
        }

        const selectedTile = board.find((t) => t.id === selectedId);

        if (areTilesMatch(selectedTile.tile, clickedTile.tile)) {
          playMatchSound();

          const word = getRandomMotivationalWord();
          setMotivationalWord(word);
          setTimeout(() => setMotivationalWord(null), 1200);

          triggerConfetti();

          setMoveHistory([...moveHistory, [selectedTile.id, clickedTile.id]]);

          let newBoard = board.map((t) =>
            t.id === selectedId || t.id === id
              ? { ...t, isMatched: true, isSelectable: false }
              : t
          );

          newBoard = updateSelectable(newBoard);
          setBoard(newBoard);
          setSelectedId(null);

          const remainingTiles = newBoard.filter((t) => !t.isMatched).length;
          if (remainingTiles === 0) {
            setGameState(GAME_STATES.WON);
            playWinSound();
            triggerWinConfetti();
          } else {
            const hasMoves = checkForMoves(newBoard);
            if (!hasMoves) {
              playShuffleSound();
              handleShuffleRemaining(newBoard);
            }
          }
        } else {
          playErrorSound();
          setSelectedId(id);
        }
      }
    },
    [
      board,
      selectedId,
      gameState,
      moveHistory,
      playClickSound,
      playMatchSound,
      playWinSound,
      playErrorSound,
      playShuffleSound,
      setBoard,
      setSelectedId,
      setGameState,
      setMoveHistory,
      setHint,
      handleShuffleRemaining,
      triggerConfetti,
      triggerWinConfetti,
    ]
  );

  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0) return;

    playUndoSound();

    const lastMove = moveHistory[moveHistory.length - 1];
    const newHistory = moveHistory.slice(0, -1);

    let newBoard = board.map((t) => {
      if (t.id === lastMove[0] || t.id === lastMove[1]) {
        return { ...t, isMatched: false };
      }
      return t;
    });

    newBoard = updateSelectable(newBoard);
    setBoard(newBoard);
    setMoveHistory(newHistory);
    setSelectedId(null);
    setGameState(GAME_STATES.PLAYING);
    setHint(null);
  }, [
    board,
    moveHistory,
    playUndoSound,
    setBoard,
    setMoveHistory,
    setSelectedId,
    setGameState,
    setHint,
  ]);

  const handleHint = useCallback(() => {
    if (gameState !== GAME_STATES.PLAYING) return;

    const selectableTiles = board.filter((t) => t.isSelectable && !t.isMatched);

    for (let i = 0; i < selectableTiles.length; i++) {
      for (let j = i + 1; j < selectableTiles.length; j++) {
        if (areTilesMatch(selectableTiles[i].tile, selectableTiles[j].tile)) {
          setHint([selectableTiles[i].id, selectableTiles[j].id]);
          setTimeout(() => setHint(null), 1500);
          return;
        }
      }
    }

    if (selectableTiles.length > 0) {
      playShuffleSound();
      handleShuffleRemaining(board);
    }
  }, [board, gameState, playShuffleSound, handleShuffleRemaining, setHint]);

  const handleStartGameWithAudio = useCallback(async () => {
    await startAudioContext();
    handleStartGame();
  }, [startAudioContext, handleStartGame]);

  const gameWorldClasses = `
    flex flex-col items-center justify-center w-full max-w-md mx-auto
    transition-all duration-500 ease-in-out
    ${
      gameState === GAME_STATES.START ||
      gameState === GAME_STATES.WON ||
      gameState === GAME_STATES.STUCK ||
      gameState === GAME_STATES.SHUFFLING
        ? "filter blur-md brightness-50 transform scale-105 pointer-events-none"
        : "filter-none"
    }
  `;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-2 font-sans overflow-hidden relative">
      <style>
        {`
          @keyframes pop-out {
            0% { opacity: 1; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0; transform: scale(1.5); }
          }
          .animate-pop-out {
            animation: pop-out 1.2s ease-out forwards;
          }
        `}
      </style>

      <MotivationalWord word={motivationalWord} />

      <GameOverlay
        gameState={gameState}
        level={level}
        onStartGame={handleStartGameWithAudio}
        onNextLevel={handleNextLevel}
        onRestart={handleRestart}
      />

      <div className={gameWorldClasses}>
        <GameBoard
          board={board}
          onTileClick={handleTileClick}
          selectedId={selectedId}
          hint={hint}
          level={level}
        />

        <GameControls
          onRestart={handleRestart}
          onUndo={handleUndo}
          onHint={handleHint}
          canUndo={moveHistory.length > 0 && gameState === GAME_STATES.PLAYING}
          canHint={gameState === GAME_STATES.PLAYING}
        />

        <div className="mt-4 text-base text-gray-400">
          Nivel: {level} | Fichas restantes:{" "}
          {board.filter((t) => !t.isMatched).length}
        </div>
      </div>
    </div>
  );
};

export default App;
