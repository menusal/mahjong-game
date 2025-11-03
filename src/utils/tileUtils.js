import { TILE_TYPES } from '../constants/gameConstants.js';
import { updateSelectable, findValidPairs } from './gameUtils.js';

export const createTileSet = () => {
  const tiles = [];
  let id = 0;
  
  // 4 copias de Palos, Vientos y Dragones
  for (let i = 0; i < 4; i++) {
    // Palos
    for (const suit of ['dots', 'bams', 'cracks']) {
      const type = TILE_TYPES[suit];
      for (let v = 1; v <= type.count; v++) {
        tiles.push({
          id: id++,
          key: `${suit}-${v}`,
          suit: type.suit,
          value: v,
          face: String.fromCodePoint(type.base + v - 1),
        });
      }
    }
    
    // Vientos
    const winds = TILE_TYPES.winds;
    for (let v = 0; v < winds.count; v++) {
      tiles.push({
        id: id++,
        key: `wind-${v}`,
        suit: winds.suit,
        value: winds.names[v],
        face: String.fromCodePoint(winds.base + v),
      });
    }
    
    // Dragones
    const dragons = TILE_TYPES.dragons;
    for (let v = 0; v < dragons.count; v++) {
      tiles.push({
        id: id++,
        key: `dragon-${v}`,
        suit: dragons.suit,
        value: dragons.names[v],
        face: String.fromCodePoint(dragons.base + v),
      });
    }
  }
  
  // 1 copia de Flores y Estaciones
  const flowers = TILE_TYPES.flowers;
  for (let v = 0; v < flowers.count; v++) {
    tiles.push({
      id: id++,
      key: `flower-${v + 1}`,
      suit: flowers.suit,
      value: v + 1,
      face: String.fromCodePoint(flowers.base + v),
    });
  }
  
  const seasons = TILE_TYPES.seasons;
  for (let v = 0; v < seasons.count; v++) {
    tiles.push({
      id: id++,
      key: `season-${v + 1}`,
      suit: seasons.suit,
      value: v + 1,
      face: String.fromCodePoint(seasons.base + v),
    });
  }
  
  // Barajar el mazo
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  
  return tiles;
};

export const createBoardFromLayout = (layout, level) => {
  const tilesNeeded = layout.length;
  const pairsNeeded = tilesNeeded / 2;
  
  if (tilesNeeded % 2 !== 0) {
    throw new Error("El layout seleccionado tiene un número impar de fichas.");
  }
  
  const allTiles = createTileSet();
  const pairPool = [];
  const tileGroups = new Map();
  
  allTiles.forEach(tile => {
    const key = tile.key;
    if (!tileGroups.has(key)) {
      tileGroups.set(key, []);
    }
    tileGroups.get(key).push(tile);
  });
  
  const flowerTiles = [];
  const seasonTiles = [];
  
  tileGroups.forEach((tiles, key) => {
    if (tiles.length === 4) {
      pairPool.push([tiles[0], tiles[1]]);
      pairPool.push([tiles[2], tiles[3]]);
    } else if (key.startsWith('flower')) {
      flowerTiles.push(tiles[0]);
    } else if (key.startsWith('season')) {
      seasonTiles.push(tiles[0]);
    }
  });
  
  pairPool.push([flowerTiles[0], flowerTiles[1]]);
  pairPool.push([flowerTiles[2], flowerTiles[3]]);
  pairPool.push([seasonTiles[0], seasonTiles[1]]);
  pairPool.push([seasonTiles[2], seasonTiles[3]]);
  
  // Barajar los pares
  for (let i = pairPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairPool[i], pairPool[j]] = [pairPool[j], pairPool[i]];
  }
  
  const selectedPairs = pairPool.slice(0, pairsNeeded);
  let tilesForBoard = selectedPairs.flat();
  
  // Barajar las fichas
  for (let i = tilesForBoard.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tilesForBoard[i], tilesForBoard[j]] = [tilesForBoard[j], tilesForBoard[i]];
  }
  
  // Crear el tablero
  return layout.map((pos, i) => ({
    id: tilesForBoard[i].id,
    tile: tilesForBoard[i],
    x: pos[0],
    y: pos[1],
    z: pos[2],
    isMatched: false,
    isSelectable: false,
  }));
};

export const autoSolveBoard = (board, pairsNeeded) => {
  const minMoves = Math.max(1, Math.floor(pairsNeeded * 0.02));
  const maxMoves = Math.max(minMoves, Math.floor(pairsNeeded * 0.05));
  const movesToMake = Math.floor(Math.random() * (maxMoves - minMoves + 1)) + minMoves;
  
  let autoSolvedBoard = board;
  
  for (let i = 0; i < movesToMake; i++) {
    autoSolvedBoard = updateSelectable(autoSolvedBoard);
    const validPairs = findValidPairs(autoSolvedBoard);
    
    if (validPairs.length === 0) {
      break;
    }
    
    const [id1, id2] = validPairs[Math.floor(Math.random() * validPairs.length)];
    
    autoSolvedBoard = autoSolvedBoard.map(t =>
      (t.id === id1 || t.id === id2) 
        ? { ...t, isMatched: true, isSelectable: false } 
        : t
    );
  }
  
  return updateSelectable(autoSolvedBoard);
};

