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

const COLOR_OPTIONS = [
  "#2563eb",
  "#f97316",
  "#10b981",
  "#facc15",
  "#ef4444",
  "#a855f7",
  "#0ea5e9",
  "#fb7185",
  "#38bdf8",
  "#22d3ee",
  "#94a3b8",
  "#f472b6",
];

const EXTENDED_PALETTE = [
  "#2563eb",
  "#1e3a8a",
  "#3b82f6",
  "#0ea5e9",
  "#22d3ee",
  "#38bdf8",
  "#0ea89d",
  "#10b981",
  "#22c55e",
  "#84cc16",
  "#facc15",
  "#f97316",
  "#fb923c",
  "#f43f5e",
  "#ef4444",
  "#a855f7",
  "#9333ea",
  "#c084fc",
  "#f472b6",
  "#ec4899",
  "#94a3b8",
  "#475569",
  "#cbd5f5",
  "#818cf8",
  "#e11d48",
  "#f59e0b",
  "#14b8a6",
];

const normalizeHex = (value: string) => {
  let hex = value.trim();
  if (!hex) return null;
  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }
  const isValid = /^#([0-9A-Fa-f]{6})$/.test(hex);
  return isValid ? hex.toLowerCase() : null;
};

type Props = {
  visible: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  onCreate: (title: string, color: string, style: NotebookStyle) => void;
  initialTitle?: string;
  initialColor?: string;
  initialStyle?: NotebookStyle;
  confirmLabel?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
};

export default function CreateNoteModal({
  visible,
  isDarkMode,
  onClose,
  onCreate,
  initialTitle,
  initialColor,
  initialStyle,
  confirmLabel = "Oluştur",
  titleLabel = "Not adı",
  titlePlaceholder = "Örneğin: Mikroekonomi ödevi",
}: Props) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [selectedColor, setSelectedColor] = useState<string | null>(
    initialColor ?? COLOR_OPTIONS[0]
  );
  const [styleType, setStyleType] = useState<NotebookStyle>(
    initialStyle ?? "plain"
  );
  const [isPaletteVisible, setIsPaletteVisible] = useState(false);
  const [paletteValue, setPaletteValue] = useState(initialColor ?? COLOR_OPTIONS[0]);
  const [paletteError, setPaletteError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle ?? "");
      setSelectedColor(initialColor ?? COLOR_OPTIONS[0]);
      setStyleType(initialStyle ?? "plain");
      setPaletteValue(initialColor ?? COLOR_OPTIONS[0]);
      setPaletteError(null);
      setIsPaletteVisible(false);
    }
  }, [visible, initialTitle, initialColor, initialStyle]);

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
                <Text style={styles.createButtonText}>{confirmLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text
            style={[styles.modalLabel, isDarkMode && styles.modalLabelDark]}
          >
            {titleLabel}
          </Text>
          <TextInput
            style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
            placeholder={titlePlaceholder}
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
          <View style={styles.colorPickerRow}>
            <ColorPicker
              colors={COLOR_OPTIONS}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
            />
            <TouchableOpacity
              style={styles.customPaletteButton}
              onPress={() => setIsPaletteVisible(true)}
            >
              <Text style={styles.customPaletteButtonText}>Palet</Text>
            </TouchableOpacity>
          </View>

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

      <Modal
        visible={isPaletteVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPaletteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.customPaletteModal,
              isDarkMode && styles.customPaletteModalDark,
            ]}
          >
            <Text
              style={[
                styles.customPaletteTitle,
                isDarkMode && styles.modalTitleDark,
              ]}
            >
              Renk paleti
            </Text>
            <Text
              style={[
                styles.customPaletteDescription,
                isDarkMode && styles.modalLabelDark,
              ]}
            >
              Pastel tonlardan seç veya beğendiğin bir rengin hex kodunu gir.
            </Text>
            <View style={styles.paletteGrid}>
              {EXTENDED_PALETTE.map((color) => {
                const active =
                  paletteValue.toLowerCase() === color.toLowerCase();
                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.paletteSwatch,
                      { backgroundColor: color },
                      active && styles.paletteSwatchActive,
                    ]}
                    onPress={() => {
                      setPaletteValue(color);
                      setPaletteError(null);
                    }}
                  />
                );
              })}
            </View>
            <Text
              style={[
                styles.modalLabel,
                { marginTop: 12 },
                isDarkMode && styles.modalLabelDark,
              ]}
            >
              Burda yer almayan renkleri de istiyorsan hex koduyla girebilirsin:
            </Text>
            <View style={styles.paletteInputRow}>
              <TextInput
                style={[
                  styles.paletteInput,
                  isDarkMode && styles.modalInputDark,
                ]}
                value={paletteValue}
                onChangeText={(value) => {
                  setPaletteValue(value);
                  setPaletteError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="#aabbcc"
                placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                maxLength={7}
              />
              <View
                style={[
                  styles.palettePreview,
                  {
                    backgroundColor:
                      normalizeHex(paletteValue) ?? "#ffffff",
                  },
                ]}
              />
            </View>
            {paletteError ? (
              <Text style={styles.paletteErrorText}>{paletteError}</Text>
            ) : null}
            <View style={styles.paletteActionsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsPaletteVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => {
                  const normalized = normalizeHex(paletteValue);
                  if (normalized) {
                    setSelectedColor(normalized);
                    setIsPaletteVisible(false);
                  } else {
                    setPaletteError("Geçerli bir hex kodu gir");
                  }
                }}
              >
                <Text style={styles.createButtonText}>Uygula</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  colorPickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  customPaletteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
  },
  customPaletteButtonText: {
    color: "#4338ca",
    fontWeight: "600",
  },
  customPaletteModal: {
    width: "92%",
    borderRadius: 18,
    backgroundColor: "#ffffff",
    padding: 18,
  },
  customPaletteModalDark: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  customPaletteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  customPaletteDescription: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 4,
  },
  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  paletteSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "transparent",
  },
  paletteSwatchActive: {
    borderColor: "#111827",
  },
  paletteInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  paletteInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  palettePreview: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#d4d4d8",
  },
  paletteErrorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#dc2626",
  },
  paletteActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    columnGap: 8,
  },
});
