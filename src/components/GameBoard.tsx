import { Pressable, StyleSheet, Text, View } from "react-native";
import { CELL_SIZE, COLORS } from "../constants";
import { Point } from "../types";

type Props = {
  snake: Point[];
  food: Point;
  isGameOver: boolean;
  score: number;
  onRestart: () => void;
  boardWidth: number;
  boardHeight: number;
  flashMessage: string | null;
};

const INNER = CELL_SIZE - 2;

// Works out which way the head is currently facing from the head/neck
// cells, correcting for the wrap-around edges (a huge jump in x or y
// means the snake wrapped, not that it reversed direction).
function facingDirection(snake: Point[], cols: number, rows: number) {
  if (snake.length < 2) return { dx: 1, dy: 0 };
  const head = snake[0];
  const neck = snake[1];
  let dx = head.x - neck.x;
  let dy = head.y - neck.y;
  if (dx > 1) dx -= cols;
  if (dx < -1) dx += cols;
  if (dy > 1) dy -= rows;
  if (dy < -1) dy += rows;
  if (dx === 0 && dy === 0) return { dx: 1, dy: 0 };
  return { dx, dy };
}

function eyeOffsets(dx: number, dy: number) {
  const near = INNER * 0.62;
  const far = INNER * 0.18;
  const midA = INNER * 0.22;
  const midB = INNER * 0.62;
  if (dx === 1) return [{ left: near, top: midA }, { left: near, top: midB }];
  if (dx === -1) return [{ left: far, top: midA }, { left: far, top: midB }];
  if (dy === 1) return [{ left: midA, top: near }, { left: midB, top: near }];
  return [{ left: midA, top: far }, { left: midB, top: far }]; // facing up
}

function tongueRect(dx: number, dy: number) {
  const len = 6;
  if (dx === 1) return { left: INNER, top: INNER / 2 - 1, width: len, height: 2 };
  if (dx === -1) return { left: -len, top: INNER / 2 - 1, width: len, height: 2 };
  if (dy === 1) return { left: INNER / 2 - 1, top: INNER, width: 2, height: len };
  return { left: INNER / 2 - 1, top: -len, width: 2, height: len }; // facing up
}

export default function GameBoard({
  snake,
  food,
  isGameOver,
  score,
  onRestart,
  boardWidth,
  boardHeight,
  flashMessage,
}: Props) {
  const cols = Math.round(boardWidth / CELL_SIZE);
  const rows = Math.round(boardHeight / CELL_SIZE);
  const { dx, dy } = facingDirection(snake, cols, rows);
  const [eyeA, eyeB] = eyeOffsets(dx, dy);
  const tongue = tongueRect(dx, dy);

  return (
    <View style={styles.frame}>
      <View style={[styles.board, { width: boardWidth, height: boardHeight }]}>
        <View
          style={[
            styles.cell,
            styles.food,
            { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE },
          ]}
        />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          const isTailTip = index === snake.length - 1 && index > 0;
          const isTailNeck = index === snake.length - 2 && index > 0;
          const scale = isTailTip ? 0.55 : isTailNeck ? 0.78 : 1;
          const size = INNER * scale;
          const offset = (INNER - size) / 2;

          return (
            <View
              key={`${segment.x}-${segment.y}-${index}`}
              style={[
                styles.segment,
                {
                  left: segment.x * CELL_SIZE + offset,
                  top: segment.y * CELL_SIZE + offset,
                  width: size,
                  height: size,
                  borderRadius: isHead ? size * 0.42 : size * 0.32,
                  opacity: isHead ? 1 : index % 2 === 0 ? 0.9 : 0.78,
                },
              ]}
            >
              {isHead && (
                <>
                  <View style={[styles.eye, { left: eyeA.left, top: eyeA.top }]} />
                  <View style={[styles.eye, { left: eyeB.left, top: eyeB.top }]} />
                  <View style={[styles.tongue, tongue]} />
                </>
              )}
            </View>
          );
        })}

        {!isGameOver && flashMessage && (
          <View style={styles.flashBanner} pointerEvents="none">
            <Text style={styles.flashText}>{flashMessage}</Text>
          </View>
        )}

        {isGameOver && (
          <Pressable style={styles.overlay} onPress={onRestart}>
            <Text style={styles.overlayTitle}>GAME OVER</Text>
            <Text style={styles.overlayScore}>Score: {score}</Text>
            <Text style={styles.overlayHint}>TAP TO PLAY AGAIN</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: 10,
    backgroundColor: COLORS.bezel,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.bezelHighlight,
  },
  board: {
    backgroundColor: COLORS.screenBg,
    overflow: "hidden",
  },
  cell: {
    position: "absolute",
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    margin: 1,
    backgroundColor: COLORS.pixelDark,
  },
  food: {
    borderRadius: CELL_SIZE / 2,
  },
  segment: {
    position: "absolute",
    backgroundColor: COLORS.pixelDark,
  },
  eye: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.screenBg,
  },
  tongue: {
    position: "absolute",
    backgroundColor: COLORS.danger,
    borderRadius: 1,
  },
  flashBanner: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    alignItems: "center",
  },
  flashText: {
    backgroundColor: "rgba(15, 56, 15, 0.85)",
    color: COLORS.screenBg,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(155, 188, 15, 0.94)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayTitle: {
    color: COLORS.pixelDark,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 8,
  },
  overlayScore: {
    color: COLORS.pixelDark,
    fontSize: 14,
    marginBottom: 18,
  },
  overlayHint: {
    color: COLORS.pixelDark,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
