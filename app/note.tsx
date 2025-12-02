// app/types/NoteTypes.ts

export type NotebookStyle = "plain" | "dotted" | "lined" | "grid";

export type NoteCard = {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  createdAtMs?: number;
  content: string;
  notebookStyle: NotebookStyle;
  isFavorite?: boolean;
};

// app/note.tsx
import NotesListScreen from "./_screens/NotesListScreen";

export default NotesListScreen;
