import { EmotionalFamily, colorWithOpacity } from "./emotion-map";
import { EmotionalColors } from "@/constants/theme";

export type VisualType = "orbs" | "waves" | "particles" | "shards" | "rings";

export type RecipeBase = {
  primary: VisualType;
  secondary?: VisualType;
  speed: number;
  intensity: number;
  particlePattern?: "scatter" | "rise" | "swirl";
  waveDirection?: "up" | "down";
  ringsExpanding?: boolean;
};

export type VisualRecipe = RecipeBase & {
  colors: string[];
};

function pickRandomColors(palette: string[], count: number = 4): string[] {
  if (!palette || palette.length === 0) {
    return ["#7C7CFF", "#8DD8DC", "#FFD166", "#E85D5D"];
  }
  const shuffled = [...palette].sort(() => Math.random() - 0.5);
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[i % shuffled.length]);
  }
  return result;
}

function generateColors(family: EmotionalFamily, opacities: number[]): string[] {
  const familyColors = EmotionalColors[family];
  if (!familyColors || !familyColors.palette) {
    return opacities.map(op => colorWithOpacity("#7C7CFF", op));
  }
  const selectedColors = pickRandomColors(familyColors.palette, opacities.length);
  return selectedColors.map((color, i) => colorWithOpacity(color, opacities[i] || 0.5));
}

const recipeConfigs: Record<EmotionalFamily, RecipeBase & { opacities: number[] }> = {
  calm: {
    primary: "orbs",
    speed: 0.7,
    intensity: 0.6,
    opacities: [0.6, 0.5, 0.4, 0.35],
  },
  
  uplifted: {
    primary: "particles",
    secondary: "rings",
    speed: 1.0,
    intensity: 0.8,
    particlePattern: "rise",
    ringsExpanding: true,
    opacities: [0.7, 0.6, 0.5, 0.45],
  },
  
  heavy: {
    primary: "waves",
    speed: 0.4,
    intensity: 0.5,
    waveDirection: "down",
    opacities: [0.5, 0.4, 0.35, 0.3],
  },
  
  turbulent: {
    primary: "shards",
    secondary: "particles",
    speed: 1.5,
    intensity: 1.0,
    particlePattern: "swirl",
    opacities: [0.65, 0.55, 0.5, 0.4],
  },
  
  distant: {
    primary: "waves",
    secondary: "orbs",
    speed: 0.3,
    intensity: 0.3,
    waveDirection: "up",
    opacities: [0.3, 0.25, 0.2, 0.15],
  },
};

export function getRecipe(family: EmotionalFamily): VisualRecipe {
  const config = recipeConfigs[family];
  const colors = generateColors(family, config.opacities);
  
  return {
    primary: config.primary,
    secondary: config.secondary,
    speed: config.speed,
    intensity: config.intensity,
    colors,
    particlePattern: config.particlePattern,
    waveDirection: config.waveDirection,
    ringsExpanding: config.ringsExpanding,
  };
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
