import React, { useEffect, useMemo } from "react";
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

type Shard = {
  id: number;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
};

type Props = {
  colors: string[];
  speed: number;
  intensity: number;
};

function generateShards(count: number): Shard[] {
  const shards: Shard[] = [];
  for (let i = 0; i < count; i++) {
    shards.push({
      id: i,
      width: 8 + Math.random() * 16,
      height: 40 + Math.random() * 80,
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT * 0.7 + SCREEN_HEIGHT * 0.1,
      rotation: Math.random() * 360,
      delay: Math.random() * 1500,
    });
  }
  return shards;
}

function ShardItem({
  shard,
  color,
  speed,
  intensity,
}: {
  shard: Shard;
  color: string;
  speed: number;
  intensity: number;
}) {
  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    const duration = (2000 + Math.random() * 1500) / speed;

    fadeIn.value = withDelay(shard.delay, withTiming(1, { duration: 400 }));

    progress.value = withDelay(
      shard.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.cubic) })
        ),
        -1,
        true
      )
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    const rotationAmount = 15 * intensity;
    const translateAmount = 20 * intensity;

    return {
      opacity: fadeIn.value * interpolate(progress.value, [0, 0.5, 1], [0.2, 0.5, 0.2]),
      transform: [
        { rotate: `${shard.rotation + interpolate(progress.value, [0, 1], [-rotationAmount, rotationAmount])}deg` },
        { translateX: interpolate(progress.value, [0, 1], [-translateAmount, translateAmount]) },
        { translateY: interpolate(progress.value, [0, 1], [0, translateAmount * 0.5]) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.shard,
        {
          width: shard.width,
          height: shard.height,
          left: shard.x,
          top: shard.y,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ShardCluster({ colors, speed, intensity }: Props) {
  const shards = useMemo(() => generateShards(12), []);

  return (
    <View style={styles.container}>
      {shards.map((shard, index) => (
        <ShardItem
          key={shard.id}
          shard={shard}
          color={colors[index % colors.length]}
          speed={speed}
          intensity={intensity}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  shard: {
    position: "absolute",
    borderRadius: 4,
  },
});
