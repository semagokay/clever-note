import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STORAGE_KEYS } from '@/constants/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AccountScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadState = async () => {
      const [loginState, savedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.loginState),
        AsyncStorage.getItem(STORAGE_KEYS.userCredentials),
      ]);
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as { email?: string };
          setUserEmail(parsed.email ?? null);
        } catch {
          setUserEmail(null);
        }
      }
      const stored = loginState;
      if (stored === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    loadState();
  }, []);

  const toggleLogin = async () => {
    if (isBusy || isLoggedIn === null) return;
    setIsBusy(true);
    const nextValue = !isLoggedIn;
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.loginState, nextValue ? 'true' : 'false');
      if (!nextValue) {
        await AsyncStorage.removeItem(STORAGE_KEYS.userCredentials);
        setUserEmail(null);
      }
      setIsLoggedIn(nextValue);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <ThemedView style={[styles.container, isDark && styles.containerDark]}>
      <ThemedText type="title" style={styles.title}>
        Hesabım
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Giriş durumun cihazında saklanır. Uygulamayı kapatsan bile hatırlanır.
      </ThemedText>

      <View style={[styles.statusCard, isDark && styles.statusCardDark]}>
        {isLoggedIn === null ? (
          <ActivityIndicator color={isDark ? '#facc15' : '#2563eb'} />
        ) : (
          <>
            <ThemedText style={styles.statusLabel}>Durum</ThemedText>
            <ThemedText style={[styles.statusValue, isLoggedIn ? styles.statusSuccess : styles.statusInfo]}>
              {isLoggedIn ? 'Giriş yapıldı' : 'Misafir modundasın'}
            </ThemedText>
            {userEmail && isLoggedIn ? (
              <ThemedText style={styles.emailText}>{userEmail}</ThemedText>
            ) : null}
            <TouchableOpacity
              onPress={toggleLogin}
              disabled={isBusy}
              style={[
                styles.primaryButton,
                isLoggedIn ? styles.logoutButton : styles.loginButton,
                isBusy && styles.primaryButtonDisabled,
              ]}>
              <ThemedText style={styles.primaryButtonText}>
                {isLoggedIn ? 'Çıkış yap' : 'Giriş yap'}
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f8',
  },
  containerDark: {
    backgroundColor: '#030712',
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
  statusCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 14,
  },
  statusCardDark: {
    borderColor: '#1f2937',
    backgroundColor: '#0f172a',
  },
  statusLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  statusValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  emailText: {
    marginTop: 4,
    fontSize: 14,
    color: '#94a3b8',
  },
  statusSuccess: {
    color: '#22c55e',
  },
  statusInfo: {
    color: '#fbbf24',
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#2563eb',
  },
  logoutButton: {
    backgroundColor: '#f97316',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
