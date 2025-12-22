import { EmotionalFamily, colorWithOpacity } from "./emotion-map";

export type VisualType = "orbs" | "waves" | "particles" | "shards" | "rings";

export type VisualRecipe = {
  primary: VisualType;
  secondary?: VisualType;
  speed: number;
  intensity: number;
  colorStrategy: (theme: ThemeColors) => string[];
  particlePattern?: "scatter" | "rise" | "swirl";
  waveDirection?: "up" | "down";
  ringsExpanding?: boolean;
};

type ThemeColors = {
  primary: string;
  accent: string;
  backgroundDefault: string;
  backgroundRoot: string;
  mutedText: string;
};

const recipes: Record<EmotionalFamily, VisualRecipe> = {
  calm: {
    primary: "orbs",
    speed: 0.7,
    intensity: 0.6,
    colorStrategy: (theme) => [
      colorWithOpacity(theme.primary, 0.5),
      colorWithOpacity(theme.accent, 0.35),
      colorWithOpacity(theme.backgroundDefault, 0.2),
    ],
  },
  
  uplifted: {
    primary: "particles",
    secondary: "rings",
    speed: 1.0,
    intensity: 0.8,
    particlePattern: "rise",
    ringsExpanding: true,
    colorStrategy: (theme) => [
      colorWithOpacity(theme.primary, 0.6),
      colorWithOpacity(theme.accent, 0.5),
      colorWithOpacity(theme.primary, 0.4),
    ],
  },
  
  heavy: {
    primary: "waves",
    speed: 0.4,
    intensity: 0.5,
    waveDirection: "down",
    colorStrategy: (theme) => [
      colorWithOpacity(theme.mutedText, 0.3),
      colorWithOpacity(theme.backgroundDefault, 0.25),
      colorWithOpacity(theme.mutedText, 0.2),
    ],
  },
  
  turbulent: {
    primary: "shards",
    secondary: "particles",
    speed: 1.5,
    intensity: 1.0,
    particlePattern: "swirl",
    colorStrategy: (theme) => [
      colorWithOpacity(theme.primary, 0.6),
      colorWithOpacity(theme.accent, 0.5),
      colorWithOpacity(theme.primary, 0.4),
    ],
  },
  
  distant: {
    primary: "waves",
    secondary: "orbs",
    speed: 0.3,
    intensity: 0.3,
    waveDirection: "up",
    colorStrategy: (theme) => [
      colorWithOpacity(theme.mutedText, 0.15),
      colorWithOpacity(theme.backgroundDefault, 0.12),
      colorWithOpacity(theme.mutedText, 0.08),
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
    colorStrategy: primary.colorStrategy,
    particlePattern: primary.particlePattern || secondary.particlePattern,
    waveDirection: primary.waveDirection || secondary.waveDirection,
    ringsExpanding: primary.ringsExpanding ?? secondary.ringsExpanding,
  };
}
