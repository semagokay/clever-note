// app/components/NoteCard.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NoteCard as NoteModel } from "../_types/NoteTypes";

type Props = {
  note: NoteModel;
  isDarkMode: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
};

export default function NoteCard({
  note,
  isDarkMode,
  onOpen,
  onToggleFavorite,
  onDelete,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.noteCard,
        { borderColor: note.color },
        isDarkMode && styles.noteCardDark,
      ]}
      onPress={onOpen}
      activeOpacity={0.8}
    >
      <View style={styles.cardTopRow}>
        <Text
          style={[styles.noteTitle, isDarkMode && styles.noteTitleDark]}
          numberOfLines={2}
        >
          {note.title}
        </Text>

        <TouchableOpacity onPress={onToggleFavorite}>
          <Text
            style={[
              styles.starIcon,
              note.isFavorite && styles.starIconActive,
            ]}
          >
            {note.isFavorite ? "★" : "☆"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBottomRow}>
        <Text style={[styles.noteDate, isDarkMode && styles.noteDateDark]}>
          {note.createdAt}
        </Text>

        <TouchableOpacity
          style={styles.cardDeleteButton}
          onPress={onDelete}
        >
          <Text style={styles.cardDeleteText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    width: "48%",
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
    justifyContent: "space-between",
  },
  noteCardDark: {
    backgroundColor: "#020617",
    borderColor: "#1f2937",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 4,
  },
  noteTitleDark: {
    color: "#e5e7eb",
  },
  starIcon: {
    fontSize: 16,
    color: "#9ca3af",
  },
  starIconActive: {
    color: "#facc15",
  },
  cardBottomRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteDate: {
    fontSize: 11,
    color: "#6b7280",
  },
  noteDateDark: {
    color: "#9ca3af",
  },
  cardDeleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
  },
  cardDeleteText: {
    fontSize: 11,
    color: "#b91c1c",
    fontWeight: "600",
  },
});
