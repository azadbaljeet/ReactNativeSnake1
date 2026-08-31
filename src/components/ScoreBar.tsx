import { StyleSheet, Text, View } from "react-native";
import { COLORS, MAX_LIVES } from "../constants";

type Props = {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  boardWidth: number;
};

export default function ScoreBar({ score, highScore, level, lives, boardWidth }: Props) {
  return (
    <View style={[styles.container, { width: boardWidth + 22 }]}>
      <View style={styles.item}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>LEVEL</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>LIVES</Text>
        <Text style={styles.hearts}>
          {"❤".repeat(lives)}
          {"♡".repeat(Math.max(0, MAX_LIVES - lives))}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>BEST</Text>
        <Text style={styles.value}>{highScore}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  item: {
    alignItems: "center",
  },
  label: {
    color: COLORS.bezelText,
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: {
    color: COLORS.pixelDark,
    backgroundColor: COLORS.screenBg,
    fontSize: 15,
    fontWeight: "700",
    minWidth: 36,
    textAlign: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  hearts: {
    fontSize: 13,
    color: COLORS.danger,
  },
});
