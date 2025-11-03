export const MOTIVATIONAL_WORDS = [
  "¡Fabuloso!",
  "¡Genial!",
  "¡Maravilloso!",
  "¡Increíble!",
  "¡Perfecto!",
  "¡Súper!",
  "¡Bien Hecho!",
];

export const TILE_TYPES = {
  dots: { base: 0x1f019, count: 9, suit: "dots" },
  bams: { base: 0x1f010, count: 9, suit: "bams" },
  cracks: { base: 0x1f007, count: 9, suit: "cracks" },
  winds: { base: 0x1f000, count: 4, suit: "wind", names: ["E", "S", "W", "N"] },
  dragons: { base: 0x1f004, count: 3, suit: "dragon", names: ["R", "G", "W"] },
  flowers: { base: 0x1f022, count: 4, suit: "flower" },
  seasons: { base: 0x1f026, count: 4, suit: "season" },
};

export const TILE_WIDTH = 7;
export const TILE_HEIGHT = 5;
export const TILE_OFFSET_X = TILE_WIDTH / 2.5;
export const TILE_OFFSET_Y = TILE_HEIGHT / 2.5;
