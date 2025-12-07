import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NoteCard as NoteModel, NotebookStyle } from '@/app/_types/NoteTypes';

export type StudyTemplate = {
  id: string;
  emoji: string;
  course: string;
  focus: string;
  description: string;
  tasks: string[];
  defaultTitle: string;
  defaultStyle: NotebookStyle;
  suggestedColor: string;
  noteScaffold: string;
};

type StudyTip = {
  id: string;
  title: string;
  body: string;
};

const studyTemplates: StudyTemplate[] = [
  {
    id: 'math-final',
    emoji: '📐',
    course: 'Matematik Analiz',
    focus: 'Limit & Türev tekrar kartı',
    description: 'Hafta sonu sınavı için kritik formül ve örnek soruları tek sayfada topla.',
    tasks: ['Tanım ve kritik teoremler', 'Örnek soru + çözüm adımları', 'Yapamadıkların / soruların'],
    defaultTitle: 'Matematik - Limit özetim',
    defaultStyle: 'lined',
    suggestedColor: '#4f46e5',
    noteScaffold:
      '📌 Limit & Türev tekrar planı\n\n1. Önemli tanımlar / teoremler:\n- \n\n2. Örnek soru ve çözümü:\n- Soru:\n- Çözüm adımları:\n\n3. Takıldıklarım / hocaya soracaklarım:\n- ',
  },
  {
    id: 'biology-lab',
    emoji: '🧬',
    course: 'Biyoloji Laboratuvarı',
    focus: 'Deney raporu taslağı',
    description: 'Hipotez, deney aşamaları ve gözlemleri çizelge şeklinde kaydet.',
    tasks: ['Hipotez ve amaç', 'Malzemeler / yöntem', 'Gözlemler ve sonuç', 'Ek notlar'],
    defaultTitle: 'Biyo lab - Hücre mitoz deneyi',
    defaultStyle: 'grid',
    suggestedColor: '#059669',
    noteScaffold:
      '🔬 Deney raporu\n\nHipotez:\nAmaç:\n\nMalzemeler / Yöntem:\n- \n\nGözlem notları:\n- \n\nSonuç & yorum:\n- ',
  },
  {
    id: 'history-essay',
    emoji: '📚',
    course: 'Çağdaş Türk Tarihi',
    focus: 'Kompozisyon planı',
    description: 'Giriş – gelişme – sonuç yapısını ana argümanlarla doldur.',
    tasks: ['Tez cümlesi', '3 destek argümanı', 'Kaynak / alıntılar', 'Son cümle'],
    defaultTitle: 'Tarih - Değerlendirme yazısı',
    defaultStyle: 'plain',
    suggestedColor: '#c026d3',
    noteScaffold:
      '📝 Makale planı\n\nTez cümlesi:\n\nGiriş:\n- dikkat çekici giriş\n- bağlam\n\nGelişme argümanları:\n1)\n2)\n3)\n\nKaynak notları:\n- \n\nSonuç paragrafı:\n- ',
  },
];

const studyTips: StudyTip[] = [
  {
    id: 'blocks',
    title: '⏱️ 50 dakika blok',
    body: 'Her kart için 50 dakika + 10 dakika ara kuralını kullan. Not bitince kartı tamamla.',
  },
  {
    id: 'color',
    title: '🎨 Renk kodları',
    body: 'Aynı dersteki kartları aynı renkle aç. Tek dokunuşla aradığını bulursun.',
  },
  {
    id: 'after-class',
    title: '🧠 Ders sonrası 5 dk',
    body: 'Ders biter bitmez kart açıp “bugünün ana fikri” satırını doldur.',
  },
];

const quickPrompts = [
  'Ders sonrası içgörü',
  'Hoca vurgusu',
  'Sınavda sorulabilecekler',
  'Eksik bıraktıklarım',
];

type ExploreIdeasProps = {
  onLaunchTemplate: (template: StudyTemplate) => void;
  notes: NoteModel[];
  onOpenSavedNote: (noteId: number) => void;
  onQuickPrompt: (prompt: string) => void;
  highlightedPrompt?: string;
  onSeeAllNotes: () => void;
};

export function ExploreIdeas({
  onLaunchTemplate,
  notes,
  onOpenSavedNote,
  onQuickPrompt,
  highlightedPrompt,
  onSeeAllNotes,
}: ExploreIdeasProps) {
  const deviceScheme = useColorScheme() ?? 'light';
  const [manualScheme, setManualScheme] = useState<'light' | 'dark'>(deviceScheme);
  const isDark = manualScheme === 'dark';
  const [savedFilter, setSavedFilter] = useState<'recent' | 'favorites'>('recent');
  const primaryText = isDark ? '#f8fafc' : '#111827';
  const secondaryText = isDark ? '#cbd5f5' : '#475569';
  const accentText = isDark ? '#facc15' : '#2563eb';
  const cardBg = isDark ? '#111729' : '#ffffff';
  const tipBg = isDark ? '#1f2937' : '#f1f5f9';
  const quickBorder = isDark ? 'rgba(255,255,255,0.25)' : '#d4d4d8';
  const highlightedBg = isDark ? 'rgba(248,250,252,0.12)' : 'rgba(59,130,246,0.1)';
  const emptyTextColor = isDark ? '#94a3b8' : '#64748b';
  const seeAllColor = isDark ? '#93c5fd' : '#2563eb';

  const colorProps = (color: string) => ({ lightColor: color, darkColor: color });

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0)),
    [notes]
  );
  const filteredNotes = useMemo(() => {
    if (savedFilter === 'favorites') {
      return sortedNotes.filter((note) => note.isFavorite).slice(0, 3);
    }
    return sortedNotes.slice(0, 3);
  }, [savedFilter, sortedNotes]);
  const hasNotes = sortedNotes.length > 0;
  const toggleManualScheme = () => {
    setManualScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: isDark ? '#030712' : '#fff' }]}>
      <View style={[styles.heroCard, { backgroundColor: isDark ? '#0f172a' : '#e0f2fe' }]}>
        <View style={styles.heroHeader}>
          <ThemedText {...colorProps(secondaryText)} style={styles.heroEyebrow}>
            Ders keşfet
          </ThemedText>
          <TouchableOpacity
            onPress={toggleManualScheme}
            style={[
              styles.themeToggle,
              { backgroundColor: isDark ? '#1e1b4b' : '#dbeafe', borderColor: isDark ? '#312e81' : '#bfdbfe' },
            ]}>
            <Text style={{ color: isDark ? '#fef9c3' : '#0f172a', fontWeight: '600' }}>
              {isDark ? '🌙 Gece' : '☀️ Gündüz'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroCopy}>
          <ThemedText
            {...colorProps(primaryText)}
            style={[
              styles.heroTitle,
            ]}>
            Çalışma kartlarını bir dokunuşla başlat
          </ThemedText>
          <ThemedText
            {...colorProps(secondaryText)}
            style={[
              styles.heroSubtitle,
            ]}>
            Dersi seç, kartı aç, isim ve rengini belirle. Notunu kaydedince aşağıda görünür.
          </ThemedText>
        </View>
      </View>

      <SectionTitle colorProps={colorProps(primaryText)}>Hazır ders kartları</SectionTitle>
      {studyTemplates.map((template) => (
        <View
          key={template.id}
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.3)' },
          ]}>
          <ThemedText {...colorProps(secondaryText)} style={styles.cardCourse}>
            {template.emoji} {template.course}
          </ThemedText>
          <ThemedText {...colorProps(primaryText)} style={styles.cardTitle}>
            {template.focus}
          </ThemedText>
          <ThemedText {...colorProps(primaryText)} style={styles.cardDescription}>
            {template.description}
          </ThemedText>
          <View style={styles.taskList}>
            {template.tasks.map((task) => (
              <ThemedText key={`${template.id}-${task}`} {...colorProps(primaryText)} style={styles.task}>
                • {task}
              </ThemedText>
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.templateButton,
              { backgroundColor: isDark ? '#2563eb' : '#1d4ed8' },
            ]}
            onPress={() => onLaunchTemplate(template)}>
            <Text style={styles.templateButtonText}>Notu aç</Text>
          </TouchableOpacity>
        </View>
      ))}

      <SectionTitle colorProps={colorProps(primaryText)}>Çalışma rutinleri</SectionTitle>
      <View style={styles.tipGrid}>
        {studyTips.map((tip) => (
          <View key={tip.id} style={[styles.tipCard, { backgroundColor: tipBg }]}>
            <ThemedText {...colorProps(primaryText)} style={styles.tipTitle}>
              {tip.title}
            </ThemedText>
            <ThemedText {...colorProps(primaryText)} style={styles.tipBody}>
              {tip.body}
            </ThemedText>
          </View>
        ))}
      </View>

      <SectionTitle colorProps={colorProps(primaryText)}>Hızlı başlıklar</SectionTitle>
      {highlightedPrompt ? (
        <View style={[styles.highlightedPrompt, { backgroundColor: highlightedBg }]}>
          <ThemedText {...colorProps(accentText)} style={styles.highlightedPromptText}>
            Son başlık: {highlightedPrompt}
          </ThemedText>
        </View>
      ) : null}
      <View style={styles.quickActionsRow}>
        {quickPrompts.map((prompt) => (
          <TouchableOpacity
            key={prompt}
            style={[
              styles.quickAction,
              { borderColor: quickBorder },
            ]}
            onPress={() => onQuickPrompt(prompt)}>
            <ThemedText {...colorProps(primaryText)} style={styles.quickActionText}>
              {prompt}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle colorProps={colorProps(primaryText)}>Kaydedilen ders notların</SectionTitle>
      {hasNotes && (
        <View style={styles.savedHeaderRow}>
          <View style={styles.savedFilters}>
            {[
              { key: 'recent', label: 'Son notlar' },
              { key: 'favorites', label: 'Favoriler' },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterChip,
                  savedFilter === key && styles.filterChipActive,
                ]}
                onPress={() => setSavedFilter(key as 'recent' | 'favorites')}>
                <ThemedText
                  {...colorProps(savedFilter === key ? '#fff' : primaryText)}
                  style={[
                    styles.filterChipText,
                  ]}>
                  {label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={onSeeAllNotes}>
            <ThemedText {...colorProps(seeAllColor)} style={styles.seeAllText}>
              Daha fazlasını gör
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
      {filteredNotes.length === 0 ? (
        <ThemedText {...colorProps(emptyTextColor)} style={styles.emptyStateText}>
          Kartlardan açıp kaydettiğin notlar burada görünecek.
        </ThemedText>
      ) : (
        filteredNotes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.savedNoteCard}
            onPress={() => onOpenSavedNote(note.id)}>
            <View style={[styles.savedNoteAccent, { backgroundColor: note.color }]} />
            <View style={styles.savedNoteContent}>
              <ThemedText {...colorProps(primaryText)} style={styles.savedNoteTitle}>
                {note.title}
              </ThemedText>
              <ThemedText {...colorProps(secondaryText)} style={styles.savedNoteDate}>
                {note.createdAt}
              </ThemedText>
            </View>
            <ThemedText {...colorProps(accentText)} style={styles.savedNoteAction}>
              Düzenle →
            </ThemedText>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

function SectionTitle({
  children,
  colorProps,
}: {
  children: React.ReactNode;
  colorProps?: { lightColor: string; darkColor: string };
}) {
  return (
    <ThemedText
      type="subtitle"
      {...colorProps}
      style={{
        fontFamily: Fonts.rounded,
        fontSize: 18,
        marginBottom: 12,
        marginTop: 28,
      }}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  heroCard: {
    borderRadius: 26,
    padding: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroCopy: {
    flex: 1,
  },
  heroEyebrow: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: Fonts.rounded,
    marginTop: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    marginTop: 12,
    lineHeight: 22,
  },
  card: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
  },
  cardCourse: {
    fontSize: 14,
    color: '#475569',
  },
  cardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  taskList: {
    marginTop: 8,
    gap: 4,
  },
  task: {
    fontSize: 14,
  },
  templateButton: {
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  templateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tipCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 18,
    padding: 14,
  },
  tipTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAction: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  quickActionText: {
    fontWeight: '600',
  },
  highlightedPrompt: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  highlightedPromptText: {
    fontWeight: '600',
    color: '#1d4ed8',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
  },
  savedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  savedFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  filterChipActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  savedNoteCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedNoteAccent: {
    width: 12,
    height: 48,
    borderRadius: 6,
  },
  savedNoteContent: {
    flex: 1,
  },
  savedNoteTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  savedNoteDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  savedNoteAction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1d4ed8',
  },
});
