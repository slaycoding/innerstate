import React, { useEffect, useMemo } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  interpolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "VisualState">;
type VisualStateRouteProp = RouteProp<RootStackParamList, "VisualState">;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type EmotionalSettings = {
  primaryOpacity: number;
  secondaryOpacity: number;
  tertiaryOpacity: number;
  speed: number;
};

const emotionalSettings: Record<string, EmotionalSettings> = {
  calm: { primaryOpacity: 0.6, secondaryOpacity: 0.4, tertiaryOpacity: 0.2, speed: 1 },
  peaceful: { primaryOpacity: 0.5, secondaryOpacity: 0.35, tertiaryOpacity: 0.15, speed: 0.8 },
  anxious: { primaryOpacity: 0.7, secondaryOpacity: 0.5, tertiaryOpacity: 0.3, speed: 1.5 },
  overwhelmed: { primaryOpacity: 0.8, secondaryOpacity: 0.6, tertiaryOpacity: 0.35, speed: 1.8 },
  hopeful: { primaryOpacity: 0.55, secondaryOpacity: 0.4, tertiaryOpacity: 0.2, speed: 0.9 },
  tired: { primaryOpacity: 0.35, secondaryOpacity: 0.25, tertiaryOpacity: 0.1, speed: 0.5 },
  sad: { primaryOpacity: 0.4, secondaryOpacity: 0.3, tertiaryOpacity: 0.15, speed: 0.6 },
  happy: { primaryOpacity: 0.65, secondaryOpacity: 0.5, tertiaryOpacity: 0.25, speed: 1.2 },
  present: { primaryOpacity: 0.6, secondaryOpacity: 0.4, tertiaryOpacity: 0.2, speed: 1 },
  default: { primaryOpacity: 0.6, secondaryOpacity: 0.4, tertiaryOpacity: 0.2, speed: 1 },
};

export default function VisualStateScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VisualStateRouteProp>();

  const emotionalTone = route.params?.emotionalTone?.toLowerCase() || "default";
  const settings = useMemo(() => {
    return emotionalSettings[emotionalTone] || emotionalSettings.default;
  }, [emotionalTone]);

  const fadeIn = useSharedValue(0);
  const orb1Scale = useSharedValue(0.3);
  const orb2Scale = useSharedValue(0.3);
  const orb3Scale = useSharedValue(0.3);
  const orb1Float = useSharedValue(0);
  const orb2Float = useSharedValue(0);
  const orb3Float = useSharedValue(0);

  useEffect(() => {
    const speed = settings.speed;
    const baseDuration1 = 3000 / speed;
    const baseDuration2 = 4000 / speed;
    const baseDuration3 = 5000 / speed;

    fadeIn.value = withTiming(1, { duration: 600 });
    
    orb1Scale.value = withDelay(200, withTiming(1, { duration: 800 }));
    orb2Scale.value = withDelay(400, withTiming(1, { duration: 800 }));
    orb3Scale.value = withDelay(600, withTiming(1, { duration: 800 }));
    
    orb1Float.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: baseDuration1 }),
          withTiming(0, { duration: baseDuration1 })
        ),
        -1,
        true
      )
    );
    
    orb2Float.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: baseDuration2 }),
          withTiming(0, { duration: baseDuration2 })
        ),
        -1,
        true
      )
    );
    
    orb3Float.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: baseDuration3 }),
          withTiming(0, { duration: baseDuration3 })
        ),
        -1,
        true
      )
    );
  }, [settings.speed]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { scale: orb1Scale.value },
      { translateY: interpolate(orb1Float.value, [0, 1], [0, -25]) },
      { translateX: interpolate(orb1Float.value, [0, 1], [0, 10]) },
    ],
    opacity: interpolate(orb1Scale.value, [0.3, 1], [0, settings.primaryOpacity]),
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { scale: orb2Scale.value },
      { translateX: interpolate(orb2Float.value, [0, 1], [0, -15]) },
      { translateY: interpolate(orb2Float.value, [0, 1], [0, 18]) },
    ],
    opacity: interpolate(orb2Scale.value, [0.3, 1], [0, settings.secondaryOpacity]),
  }));

  const orb3Style = useAnimatedStyle(() => ({
    transform: [
      { scale: orb3Scale.value },
      { translateY: interpolate(orb3Float.value, [0, 1], [0, 12]) },
      { translateX: interpolate(orb3Float.value, [0, 1], [0, -8]) },
    ],
    opacity: interpolate(orb3Scale.value, [0.3, 1], [0, settings.tertiaryOpacity]),
  }));

  const handleDismiss = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.goBack();
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      onPress={handleDismiss}
    >
      <Animated.View style={[styles.visualContainer, containerStyle]}>
        <Animated.View
          style={[
            styles.orb,
            styles.orb1,
            { backgroundColor: theme.primary },
            orb1Style,
          ]}
        />
        <Animated.View
          style={[
            styles.orb,
            styles.orb2,
            { backgroundColor: theme.accent },
            orb2Style,
          ]}
        />
        <Animated.View
          style={[
            styles.orb,
            styles.orb3,
            { backgroundColor: theme.backgroundDefault },
            orb3Style,
          ]}
        />
      </Animated.View>

      <View
        style={[
          styles.labelContainer,
          { bottom: insets.bottom + Spacing["2xl"] },
        ]}
      >
        <ThemedText type="small" style={{ color: theme.mutedText }}>
          Tap anywhere to close
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  visualContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  orb: {
    position: "absolute",
    borderRadius: BorderRadius.full,
  },
  orb1: {
    width: 220,
    height: 220,
    top: "30%",
    left: "20%",
  },
  orb2: {
    width: 160,
    height: 160,
    top: "45%",
    right: "15%",
  },
  orb3: {
    width: 280,
    height: 280,
    bottom: "15%",
    left: "25%",
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
  },
});
