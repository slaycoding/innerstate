import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { SerifText } from "@/components/SerifText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Reflection">;
type ReflectionRouteProp = RouteProp<RootStackParamList, "Reflection">;

export default function ReflectionScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReflectionRouteProp>();

  const { userInput, reflection, metaphor, emotionalTone } = route.params;

  const handleExploreVisual = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate("VisualState", { emotionalTone });
  };

  const handleNewReflection = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userInputSection}>
          <Feather name="edit-3" size={16} color={theme.mutedText} style={styles.quoteIcon} />
          <SerifText variant="metaphor" style={{ color: theme.mutedText }}>
            {userInput}
          </SerifText>
        </View>

        <View style={styles.reflectionSection}>
          <SerifText variant="reflection" style={{ color: theme.text }}>
            {reflection}
          </SerifText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.backgroundDefault }]} />

        <View style={styles.metaphorSection}>
          <ThemedText type="small" style={[styles.metaphorLabel, { color: theme.mutedText }]}>
            Metaphor of the day
          </ThemedText>
          <SerifText variant="metaphor" style={{ color: theme.accent }}>
            {metaphor}
          </SerifText>
        </View>

        <View style={styles.actionsSection}>
          <Button onPress={handleExploreVisual} variant="secondary">
            Explore visual state
          </Button>
          
          <Pressable
            onPress={handleNewReflection}
            style={({ pressed }) => [
              styles.newReflectionButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText type="body" style={{ color: theme.mutedText }}>
              New reflection
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
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
    flexGrow: 1,
    paddingHorizontal: Spacing["2xl"],
  },
  userInputSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing["3xl"],
    gap: Spacing.sm,
  },
  quoteIcon: {
    marginTop: 4,
  },
  reflectionSection: {
    marginBottom: Spacing["3xl"],
  },
  divider: {
    height: 1,
    marginVertical: Spacing["2xl"],
    borderRadius: 1,
  },
  metaphorSection: {
    marginBottom: Spacing["4xl"],
  },
  metaphorLabel: {
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
  },
  actionsSection: {
    gap: Spacing.lg,
    marginTop: "auto",
  },
  newReflectionButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
