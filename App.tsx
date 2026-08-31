import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { COLORS } from "./src/constants";
import { useBoardDimensions } from "./src/hooks/useBoardDimensions";
import { useSnakeGame } from "./src/hooks/useSnakeGame";
import ScoreBar from "./src/components/ScoreBar";
import GameBoard from "./src/components/GameBoard";
import DPad from "./src/components/DPad";

export default function App() {
  const { cols, rows, boardWidth, boardHeight } = useBoardDimensions();
  const {
    snake,
    food,
    score,
    level,
    lives,
    highScore,
    isGameOver,
    flashMessage,
    changeDirection,
    restart,
  } = useSnakeGame(cols, rows);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.phone}>
        <Text style={styles.brand}>SNAKE</Text>

        <ScoreBar
          score={score}
          highScore={highScore}
          level={level}
          lives={lives}
          boardWidth={boardWidth}
        />

        <GameBoard
          snake={snake}
          food={food}
          isGameOver={isGameOver}
          score={score}
          onRestart={restart}
          boardWidth={boardWidth}
          boardHeight={boardHeight}
          flashMessage={flashMessage}
        />

        <DPad onPress={changeDirection} onCenterPress={restart} />

        <Text style={styles.hint}>
          {isGameOver ? "Tap the screen or ● to play again" : "Use the arrows to steer"}
        </Text>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  phone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  brand: {
    color: COLORS.bezelText,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 4,
    marginBottom: 14,
  },
  hint: {
    color: "#6b6b6b",
    fontSize: 11,
    marginTop: 18,
  },
});
