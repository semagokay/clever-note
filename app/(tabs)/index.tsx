// app/index.tsx

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Üst içerik */}
      <View style={styles.topContent}>
        <Text style={styles.emoji}>🧠</Text>

        <Text style={styles.title}>Clever Note</Text>

        <Text style={styles.welcomeText}>
          Hoş geldin! Notların burada güvende. ✨
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Neler yapabilirsin?</Text>

          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Hızlıca not oluştur</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Notlarının tarihini ve saatini takip et
            </Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              Düşüncelerini tek bir yerde toparla
            </Text>
          </View>
        </View>
      </View>

      {/* Alt alan (buton + açıklama) */}
      <View style={styles.bottomArea}>
        {/* Not yazmaya başla → /note */}
        <Link href="/note" asChild>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Not yazmaya başla</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.linkText}>Hesap aç veya giriş yap</Text>
        </TouchableOpacity>

        <Text style={styles.smallText}>
          Clever Note, düşüncelerini saklayan küçük bir hafıza yardımcın. 💛
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcf9cc", // pastel sarı
    paddingHorizontal: 0,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  topContent: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    paddingHorizontal: 24,
  },

  emoji: {
    fontSize: 44,
    marginBottom: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4338ca", // mor
    textAlign: "center",
    marginBottom: 8,
  },

  welcomeText: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
  },

  infoCard: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1f2933",
    marginBottom: 8,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 15,
    marginRight: 6,
    color: "#4b5563",
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
  },

  bottomArea: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 24,
  },

  startButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#1d4ed8", // mavi
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f9fafb",
  },

  linkText: {
    fontSize: 15,
    color: "#1d4ed8",
    textDecorationLine: "underline",
    marginBottom: 8,
  },

  smallText: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
});
