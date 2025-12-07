import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STORAGE_KEYS } from '@/constants/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Credentials = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.userCredentials);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Credentials;
          setEmail(parsed.email ?? '');
          setPassword(parsed.password ?? '');
        } catch {
          // ignore
        }
      }
    };
    loadCredentials();
  }, []);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setError('Lütfen e-posta ve şifreni gir.');
      return;
    }
    if (!trimmedEmail.includes('@')) {
      setError('Geçerli bir e-posta yazmalısın.');
      return;
    }
    setBusy(true);
    try {
      const payload: Credentials = { email: trimmedEmail, password: trimmedPassword };
      await AsyncStorage.setItem(STORAGE_KEYS.userCredentials, JSON.stringify(payload));
      await AsyncStorage.setItem(STORAGE_KEYS.loginState, 'true');
      router.replace('/note');
    } catch (e) {
      setError('Kaydederken sorun oluştu.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, isDark && styles.safeDark]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ThemedView style={styles.container}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            Hesap aç veya giriş yap
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            E-postanı ve şifreni kaydediyoruz. Daha sonra Hesabım sekmesinden durumunu yönetebilirsin.
          </ThemedText>
          <View style={styles.form}>
            <Text style={styles.label}>E-posta</Text>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError(null);
              }}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="ornek@clevernote.com"
              placeholderTextColor="#94a3b8"
              style={[styles.input, isDark && styles.inputDark]}
            />
            <Text style={[styles.label, { marginTop: 16 }]}>Şifre</Text>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              style={[styles.input, isDark && styles.inputDark]}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.submitButton, (busy || !email || !password) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={busy || !email || !password}>
            <Text style={styles.submitButtonText}>{busy ? 'Kaydediliyor...' : 'Kaydet ve giriş yap'}</Text>
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  safeDark: {
    backgroundColor: '#020617',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: '#475569',
  },
  form: {
    marginTop: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5f5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1f2937',
    color: '#f1f5f9',
  },
  errorText: {
    marginTop: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
