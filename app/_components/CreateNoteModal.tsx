// app/components/CreateNoteModal.tsx

import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NotebookStyle } from "../_types/NoteTypes";
import ColorPicker from "./ColorPicker";
import StylePicker from "./StylePicker";

const COLOR_OPTIONS = ["#f97316", "#22c55e", "#3b82f6", "#e11d48", "#a855f7"];

type Props = {
  visible: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  onCreate: (title: string, color: string, style: NotebookStyle) => void;
};

export default function CreateNoteModal({
  visible,
  isDarkMode,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(
    COLOR_OPTIONS[0]
  );
  const [styleType, setStyleType] = useState<NotebookStyle>("plain");

  useEffect(() => {
    if (visible) {
      setTitle("");
      setSelectedColor(COLOR_OPTIONS[0]);
      setStyleType("plain");
    }
  }, [visible]);

  const handleCreate = () => {
    const trimmed = title.trim();
    if (!trimmed || !selectedColor) return;
    onCreate(trimmed, selectedColor, styleType);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.modalContentNew,
            isDarkMode && styles.modalContentNewDark,
          ]}
        >
          <View style={styles.modalHeaderRow}>
            <Text
              style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}
            >
              Yeni not
            </Text>

            <View style={styles.modalButtonsRowTop}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  !title.trim() && styles.createButtonDisabled,
                ]}
                onPress={handleCreate}
                disabled={!title.trim()}
              >
                <Text style={styles.createButtonText}>Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={[styles.modalLabel, isDarkMode && styles.modalLabelDark]}
          >
            Not adı
          </Text>
          <TextInput
            style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
            placeholder="Örneğin: Mikroekonomi ödevi"
            placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
            value={title}
            onChangeText={setTitle}
          />

          <Text
            style={[
              styles.modalLabel,
              { marginTop: 12 },
              isDarkMode && styles.modalLabelDark,
            ]}
          >
            Renk seç
          </Text>
          <ColorPicker
            colors={COLOR_OPTIONS}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />

          <Text
            style={[
              styles.modalLabel,
              { marginTop: 12 },
              isDarkMode && styles.modalLabelDark,
            ]}
          >
            Sayfa stili
          </Text>
          <StylePicker value={styleType} onChange={setStyleType} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentNew: {
    width: "90%",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 18,
  },
  modalContentNewDark: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  modalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalTitleDark: {
    color: "#e5e7eb",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  modalLabelDark: {
    color: "#e5e7eb",
  },
  modalInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  modalInputDark: {
    backgroundColor: "#020617",
    borderColor: "#1f2937",
    color: "#e5e7eb",
  },
  modalButtonsRowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 14,
  },
  createButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#4f46e5",
  },
  createButtonDisabled: {
    backgroundColor: "#c7d2fe",
  },
  createButtonText: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },
});
