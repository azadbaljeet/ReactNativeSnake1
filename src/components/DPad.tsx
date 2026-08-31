import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants";
import { Direction } from "../types";

type Props = {
  onPress: (direction: Direction) => void;
  onCenterPress: () => void;
};

export default function DPad({ onPress, onCenterPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Key label="▲" onPress={() => onPress("UP")} />
      </View>
      <View style={styles.row}>
        <Key label="◀" onPress={() => onPress("LEFT")} />
        <Key label="●" onPress={onCenterPress} small />
        <Key label="▶" onPress={() => onPress("RIGHT")} />
      </View>
      <View style={styles.row}>
        <Key label="▼" onPress={() => onPress("DOWN")} />
      </View>
    </View>
  );
}

type KeyProps = {
  label: string;
  onPress: () => void;
  small?: boolean;
};

function Key({ label, onPress, small }: KeyProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.key, small ? styles.keySmall : null]}
    >
      <Text style={styles.keyLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const KEY_SIZE = 76;
const KEY_SIZE_SMALL = 60;

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    margin: 8,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: COLORS.keyFace,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  keySmall: {
    width: KEY_SIZE_SMALL,
    height: KEY_SIZE_SMALL,
    borderRadius: KEY_SIZE_SMALL / 2,
  },
  keyLabel: {
    color: COLORS.bezelText,
    fontSize: 28,
    fontWeight: "700",
  },
});
