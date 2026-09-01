import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

type Props = {
  onPress: () => void;
};

// Lets the player cancel/reset the current run at any time, not just
// after a game over — tapping it starts a brand new game immediately.
export default function RestartButton({ onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={styles.button}>
      <Text style={styles.label}>↺ Restart</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: COLORS.keyFace,
    borderWidth: 1,
    borderColor: "#1a1a1a",
  },
  label: {
    color: COLORS.bezelText,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
