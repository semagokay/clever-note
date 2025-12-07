import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import CreateNoteModal from '@/app/_components/CreateNoteModal';
import { NoteCard as NoteModel, NotebookStyle } from '@/app/_types/NoteTypes';
import { loadNotes, saveNotes } from '@/app/_storage/notesStorage';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { ExploreIdeas, StudyTemplate } from '@/components/explore-ideas';
import { useColorScheme } from '@/hooks/use-color-scheme';

type CreationContext =
  | { type: 'template'; template: StudyTemplate }
  | { type: 'prompt'; prompt: string };

export default function TabTwoScreen() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [creationContext, setCreationContext] = useState<CreationContext | null>(null);
  const [creationModalVisible, setCreationModalVisible] = useState(false);
  const [highlightedPrompt, setHighlightedPrompt] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = (colorScheme ?? 'light') === 'dark';

  const refreshNotes = useCallback(async () => {
    const stored = await loadNotes();
    const sorted = [...stored].sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
    setNotes(sorted);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshNotes();
    }, [refreshNotes])
  );

  const handleLaunchTemplate = (template: StudyTemplate) => {
    setCreationContext({ type: 'template', template });
    setCreationModalVisible(true);
  };

  const handleQuickPrompt = (prompt: string) => {
    setCreationContext({ type: 'prompt', prompt });
    setCreationModalVisible(true);
  };

  const closeCreationModal = () => {
    setCreationModalVisible(false);
    setCreationContext(null);
  };

  const handleCreateNote = async (title: string, color: string, style: NotebookStyle) => {
    if (!creationContext) return;

    const now = Date.now();
    const newNote: NoteModel = {
      id: now,
      title,
      color,
      createdAt: new Date(now).toLocaleString('tr-TR'),
      createdAtMs: now,
      content: creationContext.type === 'template' ? creationContext.template.noteScaffold : `# ${title}\n\n`,
      notebookStyle: style,
      isFavorite: false,
    };

    const currentNotes = await loadNotes();
    const updatedNotes = [newNote, ...currentNotes];
    await saveNotes(updatedNotes);
    setNotes(updatedNotes);
    setCreationModalVisible(false);
    if (creationContext.type === 'prompt') {
      setHighlightedPrompt(title);
    }
    setCreationContext(null);
    router.push({ pathname: '/note', params: { focusNoteId: String(newNote.id) } });
  };

  const handleOpenSavedNote = (noteId: number) => {
    router.push({ pathname: '/note', params: { focusNoteId: String(noteId) } });
  };

  const handleSeeAllNotes = () => {
    router.push('/note');
  };

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={
          <Image
            source="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60"
            style={styles.headerPhoto}
            contentFit="cover"
            transition={600}
          />
        }>
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backFab,
            {
              backgroundColor: isDarkMode ? '#b91c1c' : '#ef4444',
              shadowColor: isDarkMode ? '#000' : '#fca5a5',
            },
          ]}>
          <ThemedText style={styles.backFabIcon}>←</ThemedText>
        </Pressable>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: Fonts.rounded,
              textAlign: 'center',
            }}>
            Tasarımla & Çalış
          </ThemedText>
        </ThemedView>
        <ExploreIdeas
          onLaunchTemplate={handleLaunchTemplate}
          notes={notes}
          onOpenSavedNote={handleOpenSavedNote}
          onQuickPrompt={handleQuickPrompt}
          highlightedPrompt={highlightedPrompt ?? undefined}
          onSeeAllNotes={handleSeeAllNotes}
        />
      </ParallaxScrollView>
      <CreateNoteModal
        visible={creationModalVisible}
        isDarkMode={isDarkMode}
        onClose={closeCreationModal}
        onCreate={handleCreateNote}
        initialTitle={
          creationContext
            ? creationContext.type === 'template'
              ? creationContext.template.defaultTitle
              : creationContext.prompt
            : undefined
        }
        initialColor={
          creationContext
            ? creationContext.type === 'template'
              ? creationContext.template.suggestedColor
              : '#0ea5e9'
            : undefined
        }
        initialStyle={
          creationContext
            ? creationContext.type === 'template'
              ? creationContext.template.defaultStyle
              : 'plain'
            : undefined
        }
        confirmLabel="Notu aç"
        titleLabel="Ders notu adı"
        titlePlaceholder={
          creationContext && creationContext.type === 'template'
            ? `${creationContext.template.course} için başlık`
            : 'Not adı'
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerPhoto: {
    width: '100%',
    height: 220,
  },
  backFab: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  backFabIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  titleContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
