import { TILE_TYPES } from "./gameConstants.js";

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
      layout.push([x * 2 + 3, y * 2 + 3, 1]);
    }
  }

  return layout;
};

const createLayoutFourCorners = () => {
  const layout = [];
  const corner = [
    [0, 0, 0],
    [2, 0, 0],
    [0, 2, 0],
    [2, 2, 0],
  ];

  corner.forEach((p) => layout.push([p[0], p[1], p[2]]));
  corner.forEach((p) => layout.push([p[0] + 8, p[1], p[2]]));
  corner.forEach((p) => layout.push([p[0], p[1] + 12, p[2]]));
  corner.forEach((p) => layout.push([p[0] + 8, p[1] + 12, p[2]]));

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
      layout.push([x * 2 + 4, y * 2 + 4, 0]);
    }
  }

  return layout;
};

const createLayoutHole = () => {
  const layout = [];

  // Capa 0: 6x8 con un hueco de 2x2 en el centro
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 6; x++) {
      const isHole = x >= 2 && x <= 3 && y >= 3 && y <= 4;
      if (!isHole) {
        layout.push([x * 2, y * 2, 0]);
      }
    }
  }

  return layout;
};

// Triple Pyramid - 3 layers
const createLayoutTriplePyramid = () => {
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
      layout.push([x * 2 + 3, y * 2 + 3, 1]);
    }
  }

  // Capa 2 (Capa superior de 2x4 = 8 tiles, centrada)
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([x * 2 + 5, y * 2 + 5, 2]);
    }
  }

  return layout;
};

// Random Islands - Multiple formations at different heights
const createLayoutRandomIslands = () => {
  const layout = [];

  // Base layer - large island (4x4)
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      layout.push([x * 2 + 2, y * 2 + 2, 0]);
    }
  }

  // Medium islands at z=1
  // Island 1 (2x2)
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([x * 2 + 12, y * 2 + 4, 1]);
    }
  }

  // Island 2 (2x2)
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([x * 2 + 4, y * 2 + 14, 1]);
    }
  }

  // Small islands at z=2
  // Island 3 (1x2)
  layout.push([14, 10, 2]);
  layout.push([14, 12, 2]);

  // Island 4 (2x1)
  layout.push([16, 14, 2]);
  layout.push([18, 14, 2]);

  // Additional base tiles to ensure even count
  layout.push([12, 2, 0]);
  layout.push([14, 2, 0]);

  return layout;
};

// Spiral Tower - Spiral pattern across 3 layers
const createLayoutSpiralTower = () => {
  const layout = [];

  // Base layer - outer spiral (6x6)
  for (let y = 0; y < 6; y++) {
    layout.push([0, y * 2, 0]); // Left edge
    layout.push([10, y * 2, 0]); // Right edge
  }
  for (let x = 1; x < 5; x++) {
    layout.push([x * 2, 0, 0]); // Top edge
    layout.push([x * 2, 10, 0]); // Bottom edge
  }

  // Middle layer - inner spiral (4x4)
  for (let y = 0; y < 4; y++) {
    layout.push([2, y * 2 + 2, 1]); // Left edge
    layout.push([8, y * 2 + 2, 1]); // Right edge
  }
  for (let x = 2; x < 4; x++) {
    layout.push([x * 2, 2, 1]); // Top edge
    layout.push([x * 2, 8, 1]); // Bottom edge
  }

  // Top layer - center (2x2)
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([x * 2 + 4, y * 2 + 4, 2]);
    }
  }

  return layout;
};

// Cross Pattern - Cross shape with elevated center
const createLayoutCrossPattern = () => {
  const layout = [];

  // Base layer (z=0) - Cross arms
  // Horizontal arm
  for (let x = 0; x < 6; x++) {
    layout.push([x * 2 + 4, 6, 0]);
  }

  // Vertical arm
  for (let y = 0; y < 6; y++) {
    layout.push([8, y * 2 + 2, 0]);
  }

  // Middle layer (z=1) - Smaller cross
  // Horizontal arm
  for (let x = 0; x < 4; x++) {
    layout.push([x * 2 + 5, 7, 1]);
  }

  // Vertical arm
  for (let y = 0; y < 4; y++) {
    layout.push([9, y * 2 + 3, 1]);
  }

  // Top layer (z=2) - Center point
  layout.push([8, 6, 2]);
  layout.push([10, 6, 2]);
  layout.push([8, 8, 2]);
  layout.push([10, 8, 2]);

  // Fill base to ensure even count
  layout.push([4, 4, 0]);
  layout.push([12, 4, 0]);
  layout.push([4, 10, 0]);
  layout.push([12, 10, 0]);

  return layout;
};

// Random Clusters - Clusters at different heights
const createLayoutRandomClusters = () => {
  const layout = [];

  // Cluster 1 at z=0 (3x3)
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      layout.push([x * 2 + 2, y * 2 + 2, 0]);
    }
  }

  // Cluster 2 at z=1 (2x2)
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([x * 2 + 10, y * 2 + 4, 1]);
    }
  }

  // Cluster 3 at z=2 (2x2)
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([x * 2 + 6, y * 2 + 12, 2]);
    }
  }

  // Cluster 4 at z=0 (2x3)
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 2; x++) {
      layout.push([x * 2 + 14, y * 2 + 8, 0]);
    }
  }

  // Cluster 5 at z=1 (3x2)
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 3; x++) {
      layout.push([x * 2 + 4, y * 2 + 16, 1]);
    }
  }

  // Additional tiles to ensure even count
  layout.push([16, 4, 0]);
  layout.push([18, 4, 0]);
  layout.push([18, 6, 0]); // Added to make even

  return layout;
};

// Diamond Layers - Diamond shapes at each layer
const createLayoutDiamondLayers = () => {
  const layout = [];

  // Base layer (z=0) - Large diamond
  const baseDiamond = [
    [8, 0, 0],
    [6, 2, 0],
    [8, 2, 0],
    [10, 2, 0],
    [4, 4, 0],
    [6, 4, 0],
    [8, 4, 0],
    [10, 4, 0],
    [12, 4, 0],
    [4, 6, 0],
    [6, 6, 0],
    [8, 6, 0],
    [10, 6, 0],
    [12, 6, 0],
    [6, 8, 0],
    [8, 8, 0],
    [10, 8, 0],
    [8, 10, 0],
  ];
  baseDiamond.forEach((pos) => layout.push(pos));

  // Middle layer (z=1) - Medium diamond
  const midDiamond = [
    [8, 2, 1],
    [6, 4, 1],
    [8, 4, 1],
    [10, 4, 1],
    [6, 6, 1],
    [8, 6, 1],
    [10, 6, 1],
    [8, 8, 1],
  ];
  midDiamond.forEach((pos) => layout.push(pos));

  // Top layer (z=2) - Small diamond
  const topDiamond = [
    [8, 4, 2],
    [6, 6, 2],
    [8, 6, 2],
    [10, 6, 2],
    [8, 8, 2],
  ];
  topDiamond.forEach((pos) => layout.push(pos));

  // Additional tiles to ensure even count
  layout.push([2, 4, 0]);
  layout.push([14, 4, 0]);
  layout.push([14, 6, 0]); // Added to make even

  return layout;
};

// Staircase Pattern - Step-like height progression
const createLayoutStaircasePattern = () => {
  const layout = [];

  // Left side - ascending staircase
  // Step 1 (z=0) - 2 tiles
  layout.push([2, 2, 0]);
  layout.push([2, 4, 0]);

  // Step 2 (z=0) - 2 tiles
  layout.push([4, 4, 0]);
  layout.push([4, 6, 0]);

  // Step 3 (z=1) - 2 tiles
  layout.push([6, 6, 1]);
  layout.push([6, 8, 1]);

  // Step 4 (z=1) - 2 tiles
  layout.push([8, 8, 1]);
  layout.push([8, 10, 1]);

  // Step 5 (z=2) - 2 tiles
  layout.push([10, 10, 2]);
  layout.push([10, 12, 2]);

  // Right side - descending staircase
  // Step 1 (z=2) - 2 tiles
  layout.push([14, 2, 2]);
  layout.push([14, 4, 2]);

  // Step 2 (z=1) - 2 tiles
  layout.push([16, 4, 1]);
  layout.push([16, 6, 1]);

  // Step 3 (z=1) - 2 tiles
  layout.push([18, 6, 1]);
  layout.push([18, 8, 1]);

  // Step 4 (z=0) - 2 tiles
  layout.push([20, 8, 0]);
  layout.push([20, 10, 0]);

  // Step 5 (z=0) - 2 tiles
  layout.push([22, 10, 0]);
  layout.push([22, 12, 0]);

  // Center base tiles
  for (let y = 0; y < 6; y++) {
    layout.push([12, y * 2 + 2, 0]);
  }

  return layout;
};

// Random Heights - Random z-level distribution in grid
const createLayoutRandomHeights = () => {
  const layout = [];
  const gridSize = 5;

  // Create a 5x5 grid with random heights
  const positions = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      // Random height: 70% z=0, 20% z=1, 10% z=2
      const rand = Math.random();
      let z = 0;
      if (rand < 0.1) {
        z = 2;
      } else if (rand < 0.3) {
        z = 1;
      }
      positions.push([x * 2 + 4, y * 2 + 4, z]);
    }
  }

  // Use a fixed seed pattern for consistency (deterministic)
  // Pattern: alternating heights in a checkerboard-like pattern
  const heightPattern = [
    [0, 1, 0, 1, 2],
    [1, 0, 1, 2, 0],
    [0, 1, 2, 0, 1],
    [1, 2, 0, 1, 0],
    [2, 0, 1, 0, 1],
  ];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      layout.push([x * 2 + 4, y * 2 + 4, heightPattern[y][x]]);
    }
  }

  // Add border tiles to ensure even count
  layout.push([2, 6, 0]);
  layout.push([14, 6, 0]);
  layout.push([14, 8, 0]); // Added to make even

  return layout;
};

export const BOARD_LAYOUTS = [
  { name: "LAYOUT_DIAMOND_LAYERS", layout: createLayoutDiamondLayers() },
  { name: "LAYOUT_TRIPLE_PYRAMID", layout: createLayoutTriplePyramid() },
  { name: "LAYOUT_SIMPLE_PYRAMID", layout: createLayoutSimplePyramid() },
  { name: "LAYOUT_FOUR_CORNERS", layout: createLayoutFourCorners() },
  { name: "LAYOUT_ARENA", layout: createLayoutArena() },
  { name: "LAYOUT_HOLE", layout: createLayoutHole() },
  { name: "LAYOUT_RANDOM_ISLANDS", layout: createLayoutRandomIslands() },
  { name: "LAYOUT_SPIRAL_TOWER", layout: createLayoutSpiralTower() },
  { name: "LAYOUT_CROSS_PATTERN", layout: createLayoutCrossPattern() },
  { name: "LAYOUT_RANDOM_CLUSTERS", layout: createLayoutRandomClusters() },
  { name: "LAYOUT_STAIRCASE_PATTERN", layout: createLayoutStaircasePattern() },
  { name: "LAYOUT_RANDOM_HEIGHTS", layout: createLayoutRandomHeights() },
];
