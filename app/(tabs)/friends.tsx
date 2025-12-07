import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STORAGE_KEYS } from '@/constants/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Friend = {
  id: string;
  name: string;
  commonNotes: number;
  status: 'online' | 'offline';
};

const FRIENDS: Friend[] = [
  { id: '1', name: 'Selin', commonNotes: 4, status: 'online' },
  { id: '2', name: 'Yusuf', commonNotes: 2, status: 'offline' },
  { id: '3', name: 'Derya', commonNotes: 5, status: 'online' },
  { id: '4', name: 'Emir', commonNotes: 1, status: 'offline' },
];

export default function FriendsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  const refreshLoginState = useCallback(async () => {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.loginState);
    setIsLoggedIn(value === 'true');
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshLoginState();
    }, [refreshLoginState])
  );

  const handleGoLogin = () => {
    router.push('/login');
  };

  return (
    <ThemedView style={[styles.container, isDark && styles.containerDark]}>
      <ThemedText type="title" style={styles.title}>
        Friends
      </ThemedText>
      <ThemedText style={styles.subtitle}>Notlarını paylaştığın kişiler</ThemedText>
      {isLoggedIn ? (
        <FlatList
          data={FRIENDS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.card, isDark && styles.cardDark]}>
              <View>
                <ThemedText style={styles.friendName}>{item.name}</ThemedText>
                <ThemedText style={styles.friendMeta}>{item.commonNotes} ortak not</ThemedText>
              </View>
              <View style={styles.cardRight}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.status === 'online' ? '#22c55e' : '#94a3b8' },
                  ]}
                />
                <TouchableOpacity style={styles.shareButton}>
                  <ThemedText style={styles.shareButtonText}>Paylaş</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={[styles.placeholderCard, isDark && styles.cardDark]}>
          <ThemedText style={styles.placeholderTitle}>Arkadaşlarınla paylaşmak için giriş yap</ThemedText>
          <ThemedText style={styles.placeholderText}>
            Paylaşım yapmak ve ortak notlarını görmek istersen hesabınla giriş yapmalısın.
          </ThemedText>
          <TouchableOpacity style={styles.loginButton} onPress={handleGoLogin}>
            <ThemedText style={styles.loginButtonText}>Hesabınla giriş yap</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f9fafb',
  },
  containerDark: {
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 20,
  },
  listContent: {
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    backgroundColor: '#fff',
  },
  cardDark: {
    borderColor: '#1f2937',
    backgroundColor: '#0f172a',
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
  },
  friendMeta: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748b',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  shareButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    backgroundColor: '#eef2ff',
  },
  shareButtonText: {
    fontWeight: '600',
    color: '#4338ca',
  },
  placeholderCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    gap: 12,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholderText: {
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#2563eb',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
