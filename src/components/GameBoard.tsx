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

        {snake.map((segment, index) => (
          <View
            key={`${segment.x}-${segment.y}-${index}`}
            style={[
              styles.cell,
              {
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                opacity: index === 0 ? 1 : 0.85,
              },
            ]}
          />
        ))}

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
