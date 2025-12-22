import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { BorderRadius } from "@/constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type OrbConfig = {
  size: number;
  x: number;
  y: number;
  delay: number;
};

type Props = {
  colors: string[];
  speed: number;
  amplitude: number;
};

const orbConfigs: OrbConfig[] = [
  { size: 200, x: SCREEN_WIDTH * 0.15, y: SCREEN_HEIGHT * 0.25, delay: 0 },
  { size: 140, x: SCREEN_WIDTH * 0.55, y: SCREEN_HEIGHT * 0.40, delay: 200 },
  { size: 240, x: SCREEN_WIDTH * 0.20, y: SCREEN_HEIGHT * 0.60, delay: 400 },
];

export function OrbField({ colors, speed, amplitude }: Props) {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    const duration1 = 4000 / speed;
    const duration2 = 5000 / speed;
    const duration3 = 6000 / speed;

    fadeIn.value = withTiming(1, { duration: 800 });

    progress1.value = withDelay(
      orbConfigs[0].delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration1, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: duration1, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    progress2.value = withDelay(
      orbConfigs[1].delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration2, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: duration2, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    progress3.value = withDelay(
      orbConfigs[2].delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration3, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: duration3, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, [speed]);

  const orb1Style = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 0.6,
    transform: [
      { translateY: interpolate(progress1.value, [0, 1], [0, -amplitude * 25]) },
      { translateX: interpolate(progress1.value, [0, 1], [0, amplitude * 10]) },
      { scale: interpolate(progress1.value, [0, 0.5, 1], [1, 1.05, 1]) },
    ],
  }));

  const orb2Style = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 0.4,
    transform: [
      { translateX: interpolate(progress2.value, [0, 1], [0, -amplitude * 15]) },
      { translateY: interpolate(progress2.value, [0, 1], [0, amplitude * 18]) },
      { scale: interpolate(progress2.value, [0, 0.5, 1], [1, 1.08, 1]) },
    ],
  }));

  const orb3Style = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 0.3,
    transform: [
      { translateY: interpolate(progress3.value, [0, 1], [0, amplitude * 12]) },
      { translateX: interpolate(progress3.value, [0, 1], [0, -amplitude * 8]) },
      { scale: interpolate(progress3.value, [0, 0.5, 1], [1, 1.03, 1]) },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.orb,
          {
            width: orbConfigs[0].size,
            height: orbConfigs[0].size,
            left: orbConfigs[0].x,
            top: orbConfigs[0].y,
            backgroundColor: colors[0],
          },
          orb1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            width: orbConfigs[1].size,
            height: orbConfigs[1].size,
            left: orbConfigs[1].x,
            top: orbConfigs[1].y,
            backgroundColor: colors[1] || colors[0],
          },
          orb2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            width: orbConfigs[2].size,
            height: orbConfigs[2].size,
            left: orbConfigs[2].x,
            top: orbConfigs[2].y,
            backgroundColor: colors[2] || colors[0],
          },
          orb3Style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  orb: {
    position: "absolute",
    borderRadius: BorderRadius.full,
  },
});
