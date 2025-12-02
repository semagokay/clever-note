// app/components/StylePicker.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NotebookStyle } from "../_types/NoteTypes";

type Props = {
  value: NotebookStyle;
  onChange: (style: NotebookStyle) => void;
};

export default function StylePicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {(
        [
          ["plain", "Düz"],
          ["dotted", "Noktalı"],
          ["lined", "Çizgili"],
          ["grid", "Kareli"],
        ] as [NotebookStyle, string][]
      ).map(([key, label]) => {
        const active = value === key;
        return (
          <TouchableOpacity
            key={key}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => onChange(key)}
          >
            <Text style={[styles.optionText, active && styles.optionTextActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 6,
    marginTop: 4,
    backgroundColor: "#f9fafb",
  },
  optionActive: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  optionText: {
    fontSize: 12,
    color: "#111827",
  },
  optionTextActive: {
    color: "#ffffff",
  },
});
