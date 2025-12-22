import React, { useMemo } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { resolveEmotionalState } from "@/lib/emotion-map";
import { getRecipe, blendRecipes } from "@/lib/visual-recipes";
import {
  OrbField,
  WaveLayer,
  ParticleSwarm,
  ShardCluster,
  PulseRing,
} from "@/components/visuals";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "VisualState">;
type VisualStateRouteProp = RouteProp<RootStackParamList, "VisualState">;

export default function VisualStateScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VisualStateRouteProp>();

  const emotionalTone = route.params?.emotionalTone || "calm";
  
  const recipe = useMemo(() => {
    const state = resolveEmotionalState(emotionalTone);
    const primaryRecipe = getRecipe(state.primary);
    const secondaryRecipe = state.secondary ? getRecipe(state.secondary) : null;
    return blendRecipes(primaryRecipe, secondaryRecipe, state.weight);
  }, [emotionalTone]);

  const colors = recipe.colors;

  const handleDismiss = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.goBack();
  };

  const renderPrimaryVisual = () => {
    switch (recipe.primary) {
      case "orbs":
        return (
          <OrbField
            colors={colors}
            speed={recipe.speed}
            amplitude={recipe.intensity}
          />
        );
      case "waves":
        return (
          <WaveLayer
            colors={colors}
            speed={recipe.speed}
            direction={recipe.waveDirection || "down"}
          />
        );
      case "particles":
        return (
          <ParticleSwarm
            colors={colors}
            speed={recipe.speed}
            count={20}
            pattern={recipe.particlePattern || "scatter"}
          />
        );
      case "shards":
        return (
          <ShardCluster
            colors={colors}
            speed={recipe.speed}
            intensity={recipe.intensity}
          />
        );
      case "rings":
        return (
          <PulseRing
            colors={colors}
            speed={recipe.speed}
            expanding={recipe.ringsExpanding ?? true}
          />
        );
      default:
        return (
          <OrbField
            colors={colors}
            speed={recipe.speed}
            amplitude={recipe.intensity}
          />
        );
    }
  };

  const renderSecondaryVisual = () => {
    if (!recipe.secondary) return null;

    switch (recipe.secondary) {
      case "orbs":
        return (
          <OrbField
            colors={colors}
            speed={recipe.speed * 0.8}
            amplitude={recipe.intensity * 0.6}
          />
        );
      case "waves":
        return (
          <WaveLayer
            colors={colors}
            speed={recipe.speed * 0.7}
            direction={recipe.waveDirection || "up"}
          />
        );
      case "particles":
        return (
          <ParticleSwarm
            colors={colors}
            speed={recipe.speed * 0.9}
            count={12}
            pattern={recipe.particlePattern || "scatter"}
          />
        );
      case "shards":
        return (
          <ShardCluster
            colors={colors}
            speed={recipe.speed * 0.8}
            intensity={recipe.intensity * 0.5}
          />
        );
      case "rings":
        return (
          <PulseRing
            colors={colors}
            speed={recipe.speed * 0.6}
            expanding={recipe.ringsExpanding ?? true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      onPress={handleDismiss}
    >
      <View style={styles.visualContainer}>
        {renderPrimaryVisual()}
        {renderSecondaryVisual()}
      </View>

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
    ...StyleSheet.absoluteFillObject,
  },
  labelContainer: {
    position: "absolute",
    alignItems: "center",
  },
});
