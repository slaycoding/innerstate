import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  colors: string[];
  speed: number;
  expanding: boolean;
};

export function PulseRing({ colors, speed, expanding }: Props) {
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const ring3 = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    const duration = 4000 / speed;

    fadeIn.value = withTiming(1, { duration: 800 });

    ring1.value = withRepeat(
      withSequence(
        withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );

    ring2.value = withDelay(
      duration / 3,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 100 })
        ),
        -1,
        false
      )
    );

    ring3.value = withDelay(
      (duration * 2) / 3,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 100 })
        ),
        -1,
        false
      )
    );
  }, [speed]);

  const baseSize = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * 0.3;

  const ring1Style = useAnimatedStyle(() => {
    const scale = expanding
      ? interpolate(ring1.value, [0, 1], [0.5, 2])
      : interpolate(ring1.value, [0, 1], [2, 0.5]);

    return {
      opacity: fadeIn.value * interpolate(ring1.value, [0, 0.3, 1], [0, 0.4, 0]),
      transform: [{ scale }],
    };
  });

  const ring2Style = useAnimatedStyle(() => {
    const scale = expanding
      ? interpolate(ring2.value, [0, 1], [0.5, 2])
      : interpolate(ring2.value, [0, 1], [2, 0.5]);

    return {
      opacity: fadeIn.value * interpolate(ring2.value, [0, 0.3, 1], [0, 0.35, 0]),
      transform: [{ scale }],
    };
  });

  const ring3Style = useAnimatedStyle(() => {
    const scale = expanding
      ? interpolate(ring3.value, [0, 1], [0.5, 2])
      : interpolate(ring3.value, [0, 1], [2, 0.5]);

    return {
      opacity: fadeIn.value * interpolate(ring3.value, [0, 0.3, 1], [0, 0.3, 0]),
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: baseSize,
            height: baseSize,
            borderColor: colors[0],
          },
          ring1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: baseSize,
            height: baseSize,
            borderColor: colors[1] || colors[0],
          },
          ring2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: baseSize,
            height: baseSize,
            borderColor: colors[2] || colors[0],
          },
          ring3Style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: 1000,
    borderWidth: 2,
  },
});
