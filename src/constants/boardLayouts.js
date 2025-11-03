import { TILE_TYPES } from './gameConstants.js';

const createLayoutSimplePyramid = () => {
  const layout = [];
  
  // Capa 0 (Base de 6x8 = 48 tiles)
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 6; x++) {
      layout.push([x * 2, y * 2, 0]);
    }
  }
  
  // Capa 1 (Capa de 4x6 = 24 tiles, centrada)
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 4; x++) {
      layout.push([(x * 2) + 3, (y * 2) + 3, 1]);
    }
  }
  
  return layout;
};

const createLayoutFourCorners = () => {
  const layout = [];
  const corner = [
    [0, 0, 0], [2, 0, 0],
    [0, 2, 0], [2, 2, 0],
  ];
  
  corner.forEach(p => layout.push([p[0], p[1], p[2]]));
  corner.forEach(p => layout.push([p[0] + 8, p[1], p[2]]));
  corner.forEach(p => layout.push([p[0], p[1] + 12, p[2]]));
  corner.forEach(p => layout.push([p[0] + 8, p[1] + 12, p[2]]));
  
  return layout;
};

const createLayoutArena = () => {
  const layout = [];
  
  // Anillo exterior 6x8
  for (let x = 0; x < 6; x++) {
    layout.push([x * 2, 0, 0]);
    layout.push([x * 2, 14, 0]);
  }
  
  for (let y = 1; y < 7; y++) {
    layout.push([0, y * 2, 0]);
    layout.push([10, y * 2, 0]);
  }
  
  // Centro 2x4 = 8 tiles
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([(x * 2) + 4, (y * 2) + 4, 0]);
    }
  }
  
  return layout;
};

const createLayoutHole = () => {
  const layout = [];
  
  // Capa 0: 6x8 con un hueco de 2x2 en el centro
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 6; x++) {
      const isHole = (x >= 2 && x <= 3) && (y >= 3 && y <= 4);
      if (!isHole) {
        layout.push([x * 2, y * 2, 0]);
      }
    }
  }
  
  return layout;
};

export const BOARD_LAYOUTS = [
  { name: 'LAYOUT_SIMPLE_PYRAMID', layout: createLayoutSimplePyramid() },
  { name: 'LAYOUT_FOUR_CORNERS', layout: createLayoutFourCorners() },
  { name: 'LAYOUT_ARENA', layout: createLayoutArena() },
  { name: 'LAYOUT_HOLE', layout: createLayoutHole() },
];

