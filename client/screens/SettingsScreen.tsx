import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Alert, Platform, TextInput, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Settings">;

const STORAGE_PREFIX = "@stillness/";
const DISPLAY_NAME_KEY = `${STORAGE_PREFIX}displayName`;
const NOTIFICATIONS_KEY = `${STORAGE_PREFIX}notifications`;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isClearing, setIsClearing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const name = await AsyncStorage.getItem(DISPLAY_NAME_KEY);
      const notifications = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (name) setDisplayName(name);
      if (notifications) setNotificationsEnabled(notifications === "true");
    } catch {
      // Ignore load errors
    }
  };

  const saveDisplayName = async (name: string) => {
    setDisplayName(name);
    try {
      await AsyncStorage.setItem(DISPLAY_NAME_KEY, name);
    } catch {
      // Ignore save errors
    }
  };

  const toggleNotifications = async (enabled: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setNotificationsEnabled(enabled);
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, enabled.toString());
    } catch {
      // Ignore save errors
    }
  };

  const handleClearData = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "This will remove all your saved reflections and settings. This action cannot be undone."
      );
      if (confirmed) {
        await performClear();
      }
    } else {
      Alert.alert(
        "Clear All Data",
        "This will remove all your saved reflections and settings. This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear",
            style: "destructive",
            onPress: performClear,
          },
        ]
      );
    }
  };

  const performClear = async () => {
    setIsClearing(true);
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter(key => key.startsWith(STORAGE_PREFIX));
      await AsyncStorage.multiRemove(appKeys);
      setDisplayName("");
      setNotificationsEnabled(false);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Spacing["2xl"],
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <Card elevation={2} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={18} color={theme.mutedText} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Profile
            </ThemedText>
          </View>
          
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <View style={[styles.avatarInner, { backgroundColor: theme.backgroundDefault }]} />
            </View>
          </View>
          
          <View style={styles.inputWrapper}>
            <ThemedText type="small" style={[styles.inputLabel, { color: theme.mutedText }]}>
              Display Name
            </ThemedText>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.backgroundRoot,
                  color: theme.text,
                  borderColor: theme.inputBorder,
                  fontFamily: Fonts.sans,
                },
              ]}
              value={displayName}
              onChangeText={saveDisplayName}
              placeholder="Enter your name"
              placeholderTextColor={theme.mutedText}
              maxLength={50}
            />
          </View>
        </Card>

        <Card elevation={2} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="bell" size={18} color={theme.mutedText} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Preferences
            </ThemedText>
          </View>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <ThemedText type="body">Reminders</ThemedText>
              <ThemedText type="small" style={{ color: theme.mutedText }}>
                Gentle nudges to check in
              </ThemedText>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.inputBorder, true: theme.primary }}
              thumbColor={theme.primaryText}
            />
          </View>
        </Card>

        <Card elevation={2} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={18} color={theme.mutedText} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              About Stillness
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ color: theme.mutedText }}>
            A calm space for observing your emotional state. No tracking, no streaks, no judgment. Just a quiet moment of reflection.
          </ThemedText>
        </Card>

        <Card elevation={2} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="heart" size={18} color={theme.mutedText} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              How to Use
            </ThemedText>
          </View>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={[styles.tipBullet, { backgroundColor: theme.accent }]} />
              <ThemedText type="body" style={{ color: theme.mutedText, flex: 1 }}>
                Write 1-3 sentences about how you feel right now
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <View style={[styles.tipBullet, { backgroundColor: theme.accent }]} />
              <ThemedText type="body" style={{ color: theme.mutedText, flex: 1 }}>
                Receive a gentle AI reflection and metaphor
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <View style={[styles.tipBullet, { backgroundColor: theme.accent }]} />
              <ThemedText type="body" style={{ color: theme.mutedText, flex: 1 }}>
                Explore a visual representation of your state
              </ThemedText>
            </View>
          </View>
        </Card>

        <View style={styles.destructiveSection}>
          <ThemedText type="small" style={[styles.destructiveLabel, { color: theme.mutedText }]}>
            Data Management
          </ThemedText>
          <Button
            variant="destructive"
            onPress={handleClearData}
            loading={isClearing}
          >
            Clear All Data
          </Button>
        </View>

        <View style={styles.versionContainer}>
          <ThemedText type="small" style={{ color: theme.mutedText }}>
            Stillness v1.0.0
          </ThemedText>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing["2xl"],
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  sectionTitle: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.6,
  },
  inputWrapper: {
    gap: Spacing.xs,
  },
  inputLabel: {
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
  },
  textInput: {
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleInfo: {
    flex: 1,
    gap: 2,
  },
  tipsList: {
    gap: Spacing.md,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  destructiveSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  destructiveLabel: {
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
});
