// app/storage/notesStorage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { NoteCard, NotebookStyle } from "../_types/NoteTypes";

const STORAGE_KEY = "NOTES_V1";
const DEFAULT_COLOR = "#f97316";

export async function loadNotes(): Promise<NoteCard[]> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed: any[] = JSON.parse(saved);

    return parsed.map((note) => {
      const idNumber =
        typeof note.id === "number" ? note.id : Number(note.id) || Date.now();

      const createdMs =
        typeof note.createdAtMs === "number" ? note.createdAtMs : idNumber;

      return {
        id: idNumber,
        title: note.title ?? "Başlıksız not",
        color: note.color ?? DEFAULT_COLOR,
        createdAt:
          note.createdAt ?? new Date(createdMs).toLocaleString("tr-TR"),
        createdAtMs: createdMs,
        content: note.content ?? "",
        notebookStyle: (note.notebookStyle as NotebookStyle) ?? "plain",
        isFavorite: note.isFavorite ?? false,
      };
    });
  } catch (e) {
    console.log("Notları yüklerken hata:", e);
    return [];
  }
}

export async function saveNotes(notes: NoteCard[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.log("Notları kaydederken hata:", e);
  }
}
