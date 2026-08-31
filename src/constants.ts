// Classic monochrome LCD look (Nokia 3310 style)
export const COLORS = {
  screenBg: "#9bbc0f", // retro LCD green background
  screenBgDark: "#8bac0f",
  pixelDark: "#0f380f", // snake / food / border pixel color
  bezel: "#2b2b2b", // phone body
  bezelHighlight: "#3a3a3a",
  bezelText: "#c8c8c8",
  keyFace: "#3d3d3d",
  keyFacePressed: "#2a2a2a",
  danger: "#c8442f",
};

// Size of a single grid cell in pixels. Columns/rows are worked out at
// runtime from the real screen size (see useBoardDimensions) so the
// board fills the device instead of sitting in a small fixed box.
export const CELL_SIZE = 18;

// Fallback grid size, only used before real screen dimensions are known.
export const DEFAULT_COLS = 15;
export const DEFAULT_ROWS = 17;

// Difficulty / speed. The game starts slow (easy) and gets faster in
// clear stages as the player's score climbs, instead of one flat ramp.
export const START_TICK_MS = 260; // slower, easier first level
export const MIN_TICK_MS = 80;
export const SPEEDUP_PER_FOOD_MS = 2; // small, steady creep within a level
export const SCORE_PER_LEVEL = 5; // points needed to reach the next level
export const LEVEL_SPEEDUP_MS = 14; // extra speed kick on every level-up

// Lives: how many times the snake can run into itself before the game
// actually ends, instead of exiting on the very first mistake. The screen
// edges are not walls — the snake wraps around them instead of dying.
export const MAX_LIVES = 3;
