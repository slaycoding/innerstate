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

type Particle = {
  id: number;
  size: number;
  startX: number;
  startY: number;
  delay: number;
};

type Props = {
  colors: string[];
  speed: number;
  count: number;
  pattern: "scatter" | "rise" | "swirl";
};

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      size: 4 + Math.random() * 8,
      startX: Math.random() * SCREEN_WIDTH,
      startY: Math.random() * SCREEN_HEIGHT * 0.8,
      delay: Math.random() * 2000,
    });
  }
  return particles;
}

function ParticleItem({
  particle,
  color,
  speed,
  pattern,
}: {
  particle: Particle;
  color: string;
  speed: number;
  pattern: "scatter" | "rise" | "swirl";
}) {
  const progress = useSharedValue(0);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    const duration = (3000 + Math.random() * 2000) / speed;

    fadeIn.value = withDelay(particle.delay, withTiming(1, { duration: 600 }));

    progress.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    let translateX = 0;
    let translateY = 0;

    if (pattern === "scatter") {
      translateX = interpolate(progress.value, [0, 1], [0, (Math.random() - 0.5) * 60]);
      translateY = interpolate(progress.value, [0, 1], [0, (Math.random() - 0.5) * 60]);
    } else if (pattern === "rise") {
      translateY = interpolate(progress.value, [0, 1], [0, -80]);
      translateX = interpolate(progress.value, [0, 1], [0, (Math.random() - 0.5) * 20]);
    } else if (pattern === "swirl") {
      const angle = progress.value * Math.PI * 2;
      translateX = Math.sin(angle) * 30;
      translateY = Math.cos(angle) * 30 - progress.value * 40;
    }

    return {
      opacity: fadeIn.value * interpolate(progress.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
      transform: [{ translateX }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: particle.size,
          height: particle.size,
          left: particle.startX,
          top: particle.startY,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

export function ParticleSwarm({ colors, speed, count, pattern }: Props) {
  const particles = useMemo(() => generateParticles(count), [count]);

  return (
    <View style={styles.container}>
      {particles.map((particle, index) => (
        <ParticleItem
          key={particle.id}
          particle={particle}
          color={colors[index % colors.length]}
          speed={speed}
          pattern={pattern}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: "absolute",
    borderRadius: 100,
  },
});
