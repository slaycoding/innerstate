import { EmotionalFamily, colorWithOpacity } from "./emotion-map";
import { EmotionalColors } from "@/constants/theme";

export type VisualType = "orbs" | "waves" | "particles" | "shards" | "rings";

export type VisualRecipe = {
  primary: VisualType;
  secondary?: VisualType;
  speed: number;
  intensity: number;
  colors: string[];
  particlePattern?: "scatter" | "rise" | "swirl";
  waveDirection?: "up" | "down";
  ringsExpanding?: boolean;
};

const recipes: Record<EmotionalFamily, VisualRecipe> = {
  calm: {
    primary: "orbs",
    speed: 0.7,
    intensity: 0.6,
    colors: [
      colorWithOpacity(EmotionalColors.calm.primary, 0.6),
      colorWithOpacity(EmotionalColors.calm.secondary, 0.45),
      colorWithOpacity(EmotionalColors.calm.tertiary, 0.3),
    ],
  },
  
  uplifted: {
    primary: "particles",
    secondary: "rings",
    speed: 1.0,
    intensity: 0.8,
    particlePattern: "rise",
    ringsExpanding: true,
    colors: [
      colorWithOpacity(EmotionalColors.uplifted.primary, 0.7),
      colorWithOpacity(EmotionalColors.uplifted.secondary, 0.55),
      colorWithOpacity(EmotionalColors.uplifted.tertiary, 0.4),
    ],
  },
  
  heavy: {
    primary: "waves",
    speed: 0.4,
    intensity: 0.5,
    waveDirection: "down",
    colors: [
      colorWithOpacity(EmotionalColors.heavy.primary, 0.45),
      colorWithOpacity(EmotionalColors.heavy.secondary, 0.35),
      colorWithOpacity(EmotionalColors.heavy.tertiary, 0.25),
    ],
  },
  
  turbulent: {
    primary: "shards",
    secondary: "particles",
    speed: 1.5,
    intensity: 1.0,
    particlePattern: "swirl",
    colors: [
      colorWithOpacity(EmotionalColors.turbulent.primary, 0.65),
      colorWithOpacity(EmotionalColors.turbulent.secondary, 0.5),
      colorWithOpacity(EmotionalColors.turbulent.tertiary, 0.4),
    ],
  },
  
  distant: {
    primary: "waves",
    secondary: "orbs",
    speed: 0.3,
    intensity: 0.3,
    waveDirection: "up",
    colors: [
      colorWithOpacity(EmotionalColors.distant.primary, 0.25),
      colorWithOpacity(EmotionalColors.distant.secondary, 0.18),
      colorWithOpacity(EmotionalColors.distant.tertiary, 0.12),
    ],
  },
};

export function getRecipe(family: EmotionalFamily): VisualRecipe {
  return recipes[family];
}

export function blendRecipes(
  primary: VisualRecipe,
  secondary: VisualRecipe | null,
  weight: number
): VisualRecipe {
  if (!secondary) return primary;

  return {
    primary: primary.primary,
    secondary: secondary.primary,
    speed: primary.speed * weight + secondary.speed * (1 - weight),
    intensity: primary.intensity * weight + secondary.intensity * (1 - weight),
    colors: primary.colors,
    particlePattern: primary.particlePattern || secondary.particlePattern,
    waveDirection: primary.waveDirection || secondary.waveDirection,
    ringsExpanding: primary.ringsExpanding ?? secondary.ringsExpanding,
  };
}
