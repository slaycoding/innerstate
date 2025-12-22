import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Props = {
  colors: string[];
  speed: number;
  direction: "up" | "down";
};

export function WaveLayer({ colors, speed, direction }: Props) {
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    const duration1 = 6000 / speed;
    const duration2 = 8000 / speed;
    const duration3 = 10000 / speed;

    fadeIn.value = withTiming(1, { duration: 1000 });

    wave1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration1, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: duration1, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    wave2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration2, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: duration2, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    wave3.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration3, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: duration3, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [speed]);

  const dirMultiplier = direction === "down" ? 1 : -1;

  const wave1Style = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 0.25,
    transform: [
      { translateY: interpolate(wave1.value, [0, 1], [0, 30 * dirMultiplier]) },
      { scaleY: interpolate(wave1.value, [0, 0.5, 1], [1, 1.1, 1]) },
    ],
  }));

  const wave2Style = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 0.2,
    transform: [
      { translateY: interpolate(wave2.value, [0, 1], [0, 20 * dirMultiplier]) },
      { scaleY: interpolate(wave2.value, [0, 0.5, 1], [1, 1.15, 1]) },
    ],
  }));

  const wave3Style = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 0.15,
    transform: [
      { translateY: interpolate(wave3.value, [0, 1], [0, 25 * dirMultiplier]) },
      { scaleY: interpolate(wave3.value, [0, 0.5, 1], [1, 1.08, 1]) },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.wave,
          { backgroundColor: colors[0], top: "20%" },
          wave1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          { backgroundColor: colors[1] || colors[0], top: "45%" },
          wave2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          { backgroundColor: colors[2] || colors[0], top: "70%" },
          wave3Style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  wave: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.5,
    height: 120,
    left: -SCREEN_WIDTH * 0.25,
    borderRadius: 60,
  },
});
