import {
  TILE_WIDTH,
  TILE_HEIGHT,
  TILE_OFFSET_X,
  TILE_OFFSET_Y,
} from "../constants/gameConstants.js";

export const areTilesMatch = (t1, t2) => {
  if (!t1 || !t2) return false;

  if (t1.suit === "flower" && t2.suit === "flower") return true;
  if (t1.suit === "season" && t2.suit === "season") return true;

  return t1.key === t2.key;
};

export const checkForMoves = (boardToCheck) => {
  const selectable = boardToCheck.filter((t) => t.isSelectable && !t.isMatched);

  for (let i = 0; i < selectable.length; i++) {
    for (let j = i + 1; j < selectable.length; j++) {
      if (areTilesMatch(selectable[i].tile, selectable[j].tile)) {
        return true;
      }
    }
  }

  return false;
};

export const findValidPairs = (boardToCheck) => {
  const validPairs = [];
  const selectable = boardToCheck.filter((t) => t.isSelectable && !t.isMatched);

  for (let i = 0; i < selectable.length; i++) {
    for (let j = i + 1; j < selectable.length; j++) {
      if (areTilesMatch(selectable[i].tile, selectable[j].tile)) {
        validPairs.push([selectable[i].id, selectable[j].id]);
      }
    }
  }

  return validPairs;
};

export const updateSelectable = (currentBoard) => {
  const occupied = new Map();

  currentBoard.forEach((t) => {
    if (!t.isMatched) {
      const key = `${t.x},${t.y},${t.z}`;
      occupied.set(key, true);
    }
  });

  const isOccupied = (x, y, z) => occupied.has(`${x},${y},${z}`);

  return currentBoard.map((t) => {
    if (t.isMatched) {
      return { ...t, isSelectable: false };
    }

    let isBlockedTop = false;
    if (t.z === 0) {
      if (
        isOccupied(t.x - 1, t.y - 1, 1) ||
        isOccupied(t.x + 1, t.y - 1, 1) ||
        isOccupied(t.x - 1, t.y + 1, 1) ||
        isOccupied(t.x + 1, t.y + 1, 1)
      ) {
        isBlockedTop = true;
      }
    }

    if (isBlockedTop) {
      return { ...t, isSelectable: false };
    }

    const hasLeft = isOccupied(t.x - 2, t.y, t.z);
    const hasRight = isOccupied(t.x + 2, t.y, t.z);
    const isSelectable = !hasLeft || !hasRight;

    return { ...t, isSelectable };
  });
};

export const shuffleBoard = (boardToShuffle) => {
  let newBoard = [...boardToShuffle];
  const remainingTiles = newBoard.filter((t) => !t.isMatched);
  let tileData = remainingTiles.map((t) => t.tile);

  for (let i = tileData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tileData[i], tileData[j]] = [tileData[j], tileData[i]];
  }

  let tileIndex = 0;
  newBoard = newBoard.map((t) => {
    if (t.isMatched) return t;
    return { ...t, tile: tileData[tileIndex++] };
  });

  return newBoard;
};

export const calculateBoardDimensions = (layout) => {
  if (!layout || layout.length === 0) {
    return { width: 30, height: 30 };
  }

  let maxX = 0;
  let maxY = 0;

  layout.forEach((pos) => {
    if (pos[0] > maxX) maxX = pos[0];
    if (pos[1] > maxY) maxY = pos[1];
  });

  const width = maxX * TILE_OFFSET_X + TILE_WIDTH;
  const height = maxY * TILE_OFFSET_Y + TILE_HEIGHT;

  return { width, height };
};
