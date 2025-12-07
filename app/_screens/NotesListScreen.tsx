// app/screens/NotesListScreen.tsx

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CreateNoteModal from "../_components/CreateNoteModal";
import NoteCard from "../_components/NoteCard";
import { loadNotes, saveNotes } from "../_storage/notesStorage";
import { NoteCard as NoteModel, NotebookStyle } from "../_types/NoteTypes";

// Defter sayfası component'i
type NotebookPageProps = {
  styleType: NotebookStyle;
  compact?: boolean;
  children: React.ReactNode;
};

function NotebookPage({ styleType, compact, children }: NotebookPageProps) {
  const horizontalLineCount = compact ? 4 : 16;
  const verticalLineCount = compact ? 4 : 10;

  return (
    <View
      style={[
        styles.pageContainer,
        compact ? styles.pageContainerCompact : styles.pageContainerFull,
        styleType === "plain" && styles.pagePlain,
        styleType === "dotted" && styles.pageDotted,
        styleType === "lined" && styles.pageLined,
        styleType === "grid" && styles.pageGrid,
      ]}
    >
      {(styleType === "lined" || styleType === "grid") && (
        <View style={styles.pageLines}>
          {Array.from({ length: horizontalLineCount }).map((_, index) => (
            <View key={index} style={styles.pageLine} />
          ))}
        </View>
      )}

      {styleType === "grid" && (
        <View style={styles.pageColumns}>
          {Array.from({ length: verticalLineCount }).map((_, index) => (
            <View key={index} style={styles.pageColumn} />
          ))}
        </View>
      )}

      <View
        style={[
          styles.pageContent,
          compact && styles.pageContentCompact,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export default function NotesListScreen() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  // yeni not modalı
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);

  // küçük önizleme + tam ekran
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isFullVisible, setIsFullVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteModel | null>(null);
  const [detailContent, setDetailContent] = useState("");

  // arama + sıralama + favori filtresi
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<
    "newest" | "oldest" | "title" | "color"
  >("newest");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // tema
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { focusNoteId } = useLocalSearchParams<{ focusNoteId?: string }>();
  const router = useRouter();
  const [autoOpenedNoteId, setAutoOpenedNoteId] = useState<number | null>(null);

  // notları yükle
  useEffect(() => {
    const init = async () => {
      const loaded = await loadNotes();
      setNotes(loaded);
    };
    init();
  }, []);

  // notlar değişince kaydet
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (!focusNoteId) return;
    const numericId = Number(focusNoteId);
    if (!numericId || autoOpenedNoteId === numericId || notes.length === 0) return;
    const noteToOpen = notes.find((n) => n.id === numericId);
    if (!noteToOpen) return;

    setSelectedNote(noteToOpen);
    setDetailContent(noteToOpen.content ?? "");
    setIsFullVisible(true);
    setAutoOpenedNoteId(numericId);
  }, [focusNoteId, notes, autoOpenedNoteId]);

  const openNewModal = () => setIsNewModalVisible(true);
  const closeNewModal = () => setIsNewModalVisible(false);

  const handleCreateNote = (
    title: string,
    color: string,
    style: NotebookStyle
  ) => {
    const now = Date.now();
    const newNote: NoteModel = {
      id: now,
      title,
      color,
      createdAt: new Date(now).toLocaleString("tr-TR"),
      createdAtMs: now,
      content: "",
      notebookStyle: style,
      isFavorite: false,
    };
    setNotes((prev) => [newNote, ...prev]);
    setIsNewModalVisible(false);
  };

  const handleDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));

    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
      setDetailContent("");
      setIsPreviewVisible(false);
      setIsFullVisible(false);
    }
  };

  const toggleFavorite = (id: number) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isFavorite: !n.isFavorite } : n
    );
    setNotes(updated);

    if (selectedNote && selectedNote.id === id) {
      const updatedNote = updated.find((n) => n.id === id) || null;
      setSelectedNote(updatedNote);
    }
  };

  const handleOpenNote = (note: NoteModel) => {
    setSelectedNote(note);
    setDetailContent(note.content ?? "");
    setIsPreviewVisible(true);
  };

  const closePreview = () => setIsPreviewVisible(false);

  const openFullScreen = () => {
    setIsPreviewVisible(false);
    setIsFullVisible(true);
  };

  const closeFullScreen = () => setIsFullVisible(false);

  const handleSaveDetail = () => {
    if (!selectedNote) return;

    const updatedNotes = notes.map((n) =>
      n.id === selectedNote.id ? { ...n, content: detailContent } : n
    );
    setNotes(updatedNotes);

    const updated = updatedNotes.find((n) => n.id === selectedNote.id) || null;
    setSelectedNote(updated);

    setIsFullVisible(false);
  };

  const handleDeleteFromFull = () => {
    if (!selectedNote) return;
    handleDeleteNote(selectedNote.id);
  };

  const normalizedQuery = searchQuery.toLowerCase();
  const filteredAndSortedNotes = notes
    .filter((note) => {
      if (showFavoritesOnly && !note.isFavorite) return false;
      if (!normalizedQuery) return true;
      const title = (note.title ?? "").toLowerCase();
      const content = (note.content ?? "").toLowerCase();
      return (
        title.includes(normalizedQuery) || content.includes(normalizedQuery)
      );
    })
    .sort((a, b) => {
      switch (sortMode) {
        case "newest":
          return (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0);
        case "oldest":
          return (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0);
        case "title":
          return (a.title ?? "").localeCompare(b.title ?? "", "tr");
        case "color":
          return (a.color ?? "").localeCompare(b.color ?? "");
        default:
          return 0;
      }
    });

  const renderSortButton = (
    key: "newest" | "oldest" | "title" | "color",
    label: string
  ) => (
    <TouchableOpacity
      key={key}
      style={[
        styles.sortButton,
        sortMode === key && styles.sortButtonActive,
      ]}
      onPress={() => setSortMode(key)}
    >
      <Text
        style={[
          styles.sortButtonText,
          sortMode === key && styles.sortButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: "Not Defteri" }} />

      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* Üst bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[
              styles.screenBackButton,
              {
                backgroundColor: isDarkMode ? "#1f2937" : "#e2e8f0",
                borderColor: isDarkMode ? "#334155" : "#cbd5f5",
              },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.screenBackButtonText,
                isDarkMode && styles.screenBackButtonTextDark,
              ]}
            >
              ←
            </Text>
          </TouchableOpacity>
          <Text
            style={[styles.appTitle, isDarkMode && styles.appTitleDark]}
          >
            Not Defteri
          </Text>

          <View style={styles.topBarRight}>
            <TouchableOpacity
              style={[
                styles.favoritesToggle,
                showFavoritesOnly && styles.favoritesToggleActive,
              ]}
              onPress={() => setShowFavoritesOnly((prev) => !prev)}
            >
              <Text
                style={[
                  styles.favoritesToggleText,
                  showFavoritesOnly && styles.favoritesToggleTextActive,
                ]}
              >
                {showFavoritesOnly ? "★ Yıldızlılar" : "☆ Tüm notlar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.themeToggle}
              onPress={() => setIsDarkMode((prev) => !prev)}
            >
              <Text style={styles.themeToggleText}>
                {isDarkMode ? "🌞" : "🌙"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Arama */}
        <TextInput
          style={[
            styles.searchInput,
            isDarkMode && styles.searchInputDark,
          ]}
          placeholder="Notlarda ara..."
          placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Sıralama */}
        <View style={styles.sortRow}>
          {renderSortButton("newest", "Yeni")}
          {renderSortButton("oldest", "Eski")}
          {renderSortButton("title", "A-Z")}
          {renderSortButton("color", "Renk")}
        </View>

        {/* + butonu */}
        <View style={styles.plusWrapper}>
          <TouchableOpacity style={styles.plusButton} onPress={openNewModal}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Liste */}
        <FlatList
          data={filteredAndSortedNotes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              isDarkMode={isDarkMode}
              onOpen={() => handleOpenNote(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onDelete={() => handleDeleteNote(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text
              style={[
                styles.emptyText,
                isDarkMode && styles.emptyTextDark,
              ]}
            >
              Henüz hiç not yok. Yukarıdaki + ile ilk notunu oluştur. 📒
            </Text>
          }
        />

        {/* YENİ NOT MODALI */}
        <CreateNoteModal
          visible={isNewModalVisible}
          isDarkMode={isDarkMode}
          onClose={closeNewModal}
          onCreate={handleCreateNote}
        />

        {/* KÜÇÜK ÖNİZLEME */}
        <Modal
          visible={isPreviewVisible}
          transparent
          animationType="fade"
          onRequestClose={closePreview}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContentPreview,
                isDarkMode && styles.modalContentPreviewDark,
              ]}
            >
              {selectedNote && (
                <>
                  <View style={styles.detailHeaderRow}>
                    <View style={styles.detailHeaderTextWrapper}>
                      <Text
                        style={[
                          styles.detailTitle,
                          isDarkMode && styles.detailTitleDark,
                        ]}
                      >
                        {selectedNote.title}
                      </Text>
                      <Text
                        style={[
                          styles.detailDate,
                          isDarkMode && styles.detailDateDark,
                        ]}
                      >
                        {selectedNote.createdAt}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleFavorite(selectedNote.id)}
                    >
                      <Text
                        style={[
                          styles.starIcon,
                          selectedNote.isFavorite &&
                            styles.starIconActive,
                        ]}
                      >
                        {selectedNote.isFavorite ? "★" : "☆"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[
                      styles.previewLabel,
                      isDarkMode && styles.previewLabelDark,
                    ]}
                  >
                    Önizleme
                  </Text>

                  <NotebookPage
                    styleType={selectedNote.notebookStyle}
                    compact
                  >
                    <Text
                      style={[
                        styles.previewText,
                        isDarkMode && styles.previewTextDark,
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {detailContent
                        ? detailContent
                        : "Bu notta henüz içerik yok. Tam ekranda yazmaya başlayabilirsin."}
                    </Text>
                  </NotebookPage>

                  <View style={styles.modalButtonsRow}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={closePreview}
                    >
                      <Text style={styles.cancelButtonText}>Kapat</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.createButton}
                      onPress={openFullScreen}
                    >
                      <Text style={styles.createButtonText}>
                        Tam ekranda aç
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* TAM EKRAN ÇALIŞMA */}
        <Modal
          visible={isFullVisible}
          animationType="slide"
          onRequestClose={closeFullScreen}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View
              style={[
                styles.fullContainer,
                isDarkMode && styles.fullContainerDark,
              ]}
            >
              {selectedNote && (
                <NotebookPage styleType={selectedNote.notebookStyle}>
                  <View style={styles.fullHeaderRow}>
                    <TouchableOpacity
                      style={[
                        styles.backButton,
                        {
                          backgroundColor: isDarkMode ? "#b91c1c" : "#ef4444",
                          shadowColor: isDarkMode ? "#000" : "#fca5a5",
                        },
                      ]}
                      onPress={closeFullScreen}
                    >
                      <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>

                    <View style={styles.fullHeaderTextWrapper}>
                      <Text
                        style={[
                          styles.detailTitle,
                          isDarkMode && styles.detailTitleDark,
                        ]}
                      >
                        {selectedNote.title}
                      </Text>
                      <Text
                        style={[
                          styles.detailDate,
                          isDarkMode && styles.detailDateDark,
                        ]}
                      >
                        {selectedNote.createdAt}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleFavorite(selectedNote.id)}
                    >
                      <Text
                        style={[
                          styles.starIcon,
                          selectedNote.isFavorite &&
                            styles.starIconActive,
                        ]}
                      >
                        {selectedNote.isFavorite ? "★" : "☆"}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.fullButtonsRowTop}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={closeFullScreen}
                      >
                        <Text style={styles.cancelButtonText}>Vazgeç</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.fullDeleteButton}
                        onPress={handleDeleteFromFull}
                      >
                        <Text style={styles.fullDeleteButtonText}>Sil</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleSaveDetail}
                      >
                        <Text style={styles.createButtonText}>Kaydet</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TextInput
                    style={[
                      styles.fullInput,
                      isDarkMode && styles.fullInputDark,
                    ]}
                    placeholder="Bu nota detay ekle..."
                    placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                    multiline
                    value={detailContent}
                    onChangeText={setDetailContent}
                    textAlignVertical="top"
                  />
                </NotebookPage>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  containerDark: {
    backgroundColor: "#020617",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  appTitleDark: {
    color: "#e5e7eb",
  },
  screenBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  screenBackButtonText: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "600",
  },
  screenBackButtonTextDark: {
    color: "#f8fafc",
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggle: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },
  themeToggleText: {
    fontSize: 14,
  },
  favoritesToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  favoritesToggleActive: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  favoritesToggleText: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
  },
  favoritesToggleTextActive: {
    color: "#ffffff",
  },

  searchInput: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#f9fafb",
    marginBottom: 8,
  },
  searchInputDark: {
    backgroundColor: "#020617",
    borderColor: "#1f2937",
    color: "#e5e7eb",
  },

  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sortButton: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },
  sortButtonActive: {
    backgroundColor: "#4f46e5",
    borderColor: "#4f46e5",
  },
  sortButtonText: {
    fontSize: 11,
    color: "#111827",
  },
  sortButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },

  plusWrapper: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  plusButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eef2ff",
  },
  plusText: {
    fontSize: 34,
    color: "#4f46e5",
    marginTop: -3,
  },

  listContent: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
  },

  emptyText: {
    marginTop: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
  },
  emptyTextDark: {
    color: "#6b7280",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentPreview: {
    width: "92%",
    maxHeight: "70%",
    borderRadius: 18,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  modalContentPreviewDark: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
    columnGap: 8,
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
  createButtonText: {
    color: "#f9fafb",
    fontSize: 14,
    fontWeight: "600",
  },

  detailHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    justifyContent: "space-between",
  },
  detailHeaderTextWrapper: {
    flex: 1,
    marginRight: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  detailTitleDark: {
    color: "#e5e7eb",
  },
  detailDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  detailDateDark: {
    color: "#9ca3af",
  },
  previewLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
  },
  previewLabelDark: {
    color: "#9ca3af",
  },
  previewText: {
    fontSize: 14,
    color: "#111827",
  },
  previewTextDark: {
    color: "#e5e7eb",
  },

  fullContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  fullContainerDark: {
    backgroundColor: "#020617",
  },
  fullHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    elevation: 6,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  backButtonText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "700",
  },
  fullHeaderTextWrapper: {
    flex: 1,
  },
  fullInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "transparent",
    marginTop: 4,
  },
  fullInputDark: {
    color: "#e5e7eb",
  },
  fullButtonsRowTop: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  fullDeleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 4,
  },
  fullDeleteButtonText: {
    color: "#b91c1c",
    fontSize: 14,
    fontWeight: "600",
  },

  pageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  pageContainerCompact: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginTop: 4,
    marginBottom: 8,
  },
  pageContainerFull: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pagePlain: {
    backgroundColor: "#ffffff",
  },
  pageDotted: {
    backgroundColor: "#fdf2ff",
    borderStyle: "dotted",
    borderColor: "#a855f7",
  },
  pageLined: {
    backgroundColor: "#fefce8",
  },
  pageGrid: {
    backgroundColor: "#eef2ff",
  },
  pageLines: {
    position: "absolute",
    inset: 0,
    justifyContent: "space-evenly",
  },
  pageLine: {
    height: 1,
    backgroundColor: "rgba(148,163,184,0.5)",
  },
  pageColumns: {
    position: "absolute",
    inset: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  pageColumn: {
    width: 1,
    backgroundColor: "rgba(148,163,184,0.4)",
  },
  pageContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    flex: 1,
  },
  pageContentCompact: {
    flex: 0,
    paddingVertical: 4,
  },
});
