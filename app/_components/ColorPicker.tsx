// app/components/ColorPicker.tsx

import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  colors: string[];
  selectedColor: string | null;
  onSelect: (color: string) => void;
};

export default function ColorPicker({ colors, selectedColor, onSelect }: Props) {
  return (
    <View style={styles.colorRow}>
      {colors.map((color) => {
        const active = selectedColor === color;
        return (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              active && styles.colorCircleActive,
            ]}
            onPress={() => onSelect(color)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorCircleActive: {
    borderColor: "#111827",
  },
});
