import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform as RNPlatform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { InnerVoiceText } from "@/components/InnerVoiceText";
import { SerifText } from "@/components/SerifText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { apiRequest } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "CheckIn">;

interface ReflectionResponse {
  reflection: string;
  metaphor: string;
  emotionalTone: string;
}

export default function CheckInScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const reflectionMutation = useMutation({
    mutationFn: async (userInput: string): Promise<ReflectionResponse> => {
      const response = await apiRequest("POST", "/api/reflect", { input: userInput });
      return response.json();
    },
    onSuccess: (data) => {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      navigation.navigate("Reflection", {
        userInput: input,
        reflection: data.reflection,
        metaphor: data.metaphor,
        emotionalTone: data.emotionalTone,
      });
      setInput("");
    },
    onError: () => {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
  });

  const handleReflect = () => {
    if (input.trim().length > 0) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      reflectionMutation.mutate(input.trim());
    }
  };

  const handleSettingsPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate("Settings");
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      behavior={RNPlatform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing["4xl"],
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Pressable
            onPress={handleSettingsPress}
            style={({ pressed }) => [
              styles.settingsButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            hitSlop={12}
          >
            <Feather name="settings" size={22} color={theme.mutedText} />
          </Pressable>
        </View>

        <View style={styles.promptContainer}>
          <InnerVoiceText>
            How do I feel right now?
          </InnerVoiceText>
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.card,
              borderColor: isFocused ? theme.focusBorder : theme.inputBorder,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { color: theme.text, fontFamily: Fonts.sans },
            ]}
            placeholder="Take a moment to describe how you feel..."
            placeholderTextColor={theme.mutedText}
            value={input}
            onChangeText={setInput}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={500}
          />
        </View>

        {reflectionMutation.isError ? (
          <SerifText
            variant="metaphor"
            style={[styles.errorText, { color: theme.destructive }]}
          >
            Unable to process your reflection. Please try again.
          </SerifText>
        ) : null}
      </KeyboardAwareScrollViewCompat>

      <View
        style={[
          styles.buttonContainer,
          {
            paddingBottom: insets.bottom + Spacing.xl,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <Button
          onPress={handleReflect}
          disabled={input.trim().length === 0}
          loading={reflectionMutation.isPending}
        >
          Reflect my state
        </Button>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: Spacing["3xl"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing["5xl"],
  },
  headerSpacer: {
    width: 44,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  promptContainer: {
    marginBottom: Spacing["4xl"],
    paddingRight: Spacing.lg,
  },
  inputContainer: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    minHeight: 160,
    padding: Spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    minHeight: 140,
  },
  errorText: {
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing.lg,
    borderTopWidth: 0,
  },
});
