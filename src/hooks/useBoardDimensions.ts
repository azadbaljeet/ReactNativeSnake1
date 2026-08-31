import { useWindowDimensions } from "react-native";
import { CELL_SIZE, DEFAULT_COLS, DEFAULT_ROWS } from "../constants";

// Space reserved outside the board for the brand title, score bar,
// D-pad, hint text, and safe-area breathing room (notch / home indicator).
const HORIZONTAL_MARGIN = 40;
// Bumped up to make room for the bigger, easier-to-tap D-pad buttons.
const RESERVED_VERTICAL_SPACE = 570;

const MIN_COLS = 9;
const MIN_ROWS = 11;

export function useBoardDimensions() {
  const { width, height } = useWindowDimensions();

  const cols = Math.max(
    MIN_COLS,
    Math.floor((width - HORIZONTAL_MARGIN) / CELL_SIZE) || DEFAULT_COLS
  );
  const rows = Math.max(
    MIN_ROWS,
    Math.floor((height - RESERVED_VERTICAL_SPACE) / CELL_SIZE) || DEFAULT_ROWS
  );

  return {
    cols,
    rows,
    boardWidth: cols * CELL_SIZE,
    boardHeight: rows * CELL_SIZE,
  };
}
