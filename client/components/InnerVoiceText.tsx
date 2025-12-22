import React, { useEffect } from "react";
import { Text, TextProps, StyleSheet, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { Typography, Fonts } from "@/constants/theme";

interface InnerVoiceTextProps extends TextProps {
  delay?: number;
  duration?: number;
}

export function InnerVoiceText({
  style,
  delay = 200,
  duration = 800,
  children,
  ...rest
}: InnerVoiceTextProps) {
  const { theme } = useTheme();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text
        style={[
          styles.text,
          {
            color: "#EDEDF2",
            fontFamily: Fonts.serifItalic,
            fontStyle: Platform.OS === "web" ? "italic" : "normal",
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: Typography.innerVoice.fontSize,
    lineHeight: Typography.innerVoice.lineHeight,
    letterSpacing: Typography.innerVoice.letterSpacing,
    fontWeight: Typography.innerVoice.fontWeight,
  },
});
