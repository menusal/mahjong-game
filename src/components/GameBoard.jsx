import React from 'react';
import Tile from './Tile.jsx';
import { calculateBoardDimensions } from '../utils/gameUtils.js';
import { BOARD_LAYOUTS } from '../constants/boardLayouts.js';

const GameBoard = ({ board, onTileClick, selectedId, hint, level }) => {
  const layoutData = BOARD_LAYOUTS[(level - 1) % BOARD_LAYOUTS.length];
  const currentLayout = layoutData ? layoutData.layout : [];
  const { width: boardWidth, height: boardHeight } = calculateBoardDimensions(currentLayout);
  
  return (
    <div 
      className="flex items-center justify-center w-full rounded-lg bg-gray-700 shadow-inner transition-all duration-500 mt-4"
      style={{ 
        height: '85vh',
        aspectRatio: `${boardWidth + 4} / ${boardHeight + 4}`,
        maxWidth: '100%',
        padding: '1.5vmin'
      }}
    >
      <div className="relative w-full h-full">
        {board.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center p-10">
            Cargando...
          </div>
        )}
        
        {board.map(boardTile => (
          <Tile
            key={boardTile.id}
            boardTile={boardTile}
            onClick={onTileClick}
            isSelected={boardTile.id === selectedId}
            isHint={hint?.includes(boardTile.id)}
            boardWidth={boardWidth}
            boardHeight={boardHeight}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

