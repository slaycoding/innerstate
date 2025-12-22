export type EmotionalFamily = 
  | "calm"      // Peaceful, serene, content, relaxed
  | "uplifted"  // Hopeful, happy, joyful, optimistic
  | "heavy"     // Sad, melancholic, grieving, down
  | "turbulent" // Anxious, stressed, overwhelmed, chaotic
  | "distant";  // Numb, disconnected, tired, empty

export type ResolvedState = {
  primary: EmotionalFamily;
  secondary: EmotionalFamily | null;
  intensity: number; // 0-1 scale
  weight: number;    // 0-1 primary vs secondary blend
};

const synonymMap: Record<string, EmotionalFamily> = {
  // Calm family
  calm: "calm",
  peaceful: "calm",
  serene: "calm",
  relaxed: "calm",
  content: "calm",
  tranquil: "calm",
  still: "calm",
  quiet: "calm",
  centered: "calm",
  grounded: "calm",
  present: "calm",
  
  // Uplifted family  
  uplifted: "uplifted",
  hopeful: "uplifted",
  happy: "uplifted",
  joyful: "uplifted",
  optimistic: "uplifted",
  grateful: "uplifted",
  excited: "uplifted",
  inspired: "uplifted",
  energized: "uplifted",
  light: "uplifted",
  alive: "uplifted",
  
  // Heavy family
  heavy: "heavy",
  sad: "heavy",
  melancholic: "heavy",
  grieving: "heavy",
  down: "heavy",
  low: "heavy",
  depressed: "heavy",
  somber: "heavy",
  blue: "heavy",
  sorrowful: "heavy",
  heartbroken: "heavy",
  
  // Turbulent family
  turbulent: "turbulent",
  anxious: "turbulent",
  stressed: "turbulent",
  overwhelmed: "turbulent",
  chaotic: "turbulent",
  restless: "turbulent",
  worried: "turbulent",
  panicked: "turbulent",
  tense: "turbulent",
  agitated: "turbulent",
  frantic: "turbulent",
  
  // Distant family
  distant: "distant",
  numb: "distant",
  disconnected: "distant",
  tired: "distant",
  empty: "distant",
  exhausted: "distant",
  detached: "distant",
  foggy: "distant",
  drained: "distant",
  lost: "distant",
  confused: "distant",
};

function parseTokens(tone: string): string[] {
  return tone
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/[\s,]+/)
    .filter(Boolean);
}

function mapToFamily(token: string): EmotionalFamily | null {
  return synonymMap[token] || null;
}

export function resolveEmotionalState(tone: string): ResolvedState {
  const tokens = parseTokens(tone);
  const families: EmotionalFamily[] = [];
  
  for (const token of tokens) {
    const family = mapToFamily(token);
    if (family && !families.includes(family)) {
      families.push(family);
    }
  }
  
  // Default to calm if no recognized emotions
  if (families.length === 0) {
    return {
      primary: "calm",
      secondary: null,
      intensity: 0.5,
      weight: 1,
    };
  }
  
  // Single emotion
  if (families.length === 1) {
    return {
      primary: families[0],
      secondary: null,
      intensity: 0.7,
      weight: 1,
    };
  }
  
  // Mixed emotions - blend primary and secondary
  return {
    primary: families[0],
    secondary: families[1],
    intensity: 0.8,
    weight: 0.7, // 70% primary, 30% secondary
  };
}

// Color tinting helpers
export function colorWithOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
