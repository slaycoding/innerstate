import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#EDEDF2",
    mutedText: "#9A9AA8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9A9AA8",
    tabIconSelected: "#7C7CFF",
    link: "#7C7CFF",
    backgroundRoot: "#0F0F14",
    backgroundDefault: "#1A1A22",
    backgroundSecondary: "#15151D",
    backgroundTertiary: "#1C1C26",
    primary: "#7C7CFF",
    primaryText: "#FFFFFF",
    secondary: "#15151D",
    secondaryText: "#EDEDF2",
    accent: "#7C7CFF",
    accentText: "#FFFFFF",
    destructive: "#FF6B6B",
    destructiveText: "#0F0F14",
    card: "#15151D",
    cardText: "#EDEDF2",
    popover: "#1C1C26",
    popoverText: "#EDEDF2",
    focusBorder: "#7C7CFF",
    inputBorder: "#2A2A38",
  },
  dark: {
    text: "#EDEDF2",
    mutedText: "#9A9AA8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9A9AA8",
    tabIconSelected: "#7C7CFF",
    link: "#7C7CFF",
    backgroundRoot: "#0F0F14",
    backgroundDefault: "#1A1A22",
    backgroundSecondary: "#15151D",
    backgroundTertiary: "#1C1C26",
    primary: "#7C7CFF",
    primaryText: "#FFFFFF",
    secondary: "#15151D",
    secondaryText: "#EDEDF2",
    accent: "#7C7CFF",
    accentText: "#FFFFFF",
    destructive: "#FF6B6B",
    destructiveText: "#0F0F14",
    card: "#15151D",
    cardText: "#EDEDF2",
    popover: "#1C1C26",
    popoverText: "#EDEDF2",
    focusBorder: "#7C7CFF",
    inputBorder: "#2A2A38",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 56,
};

export const EmotionalColors = {
  calm: {
    palette: ["#6EC6CA", "#8DD8DC", "#4FA8AC", "#A8E6CF", "#88D8B0", "#7FCDCD"],
  },
  uplifted: {
    palette: ["#FFD166", "#FFBA42", "#FFE599", "#FF9F45", "#FFC857", "#FFEB99", "#F9A825"],
  },
  heavy: {
    palette: ["#5B6BAA", "#7A88C2", "#4A5A99", "#6C5B7B", "#8E7CC3", "#5C6BC0", "#7986CB"],
  },
  turbulent: {
    palette: ["#E85D5D", "#FF7E7E", "#CC4A4A", "#FF6B6B", "#F06292", "#EF5350", "#FF8A65"],
  },
  distant: {
    palette: ["#8B8BA3", "#A3A3B8", "#6E6E88", "#9E9E9E", "#B0BEC5", "#78909C", "#90A4AE"],
  },
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 18,
    fontWeight: "500" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  reflection: {
    fontSize: 22,
    fontWeight: "400" as const,
    lineHeight: 35,
  },
  metaphor: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 28,
  },
  prompt: {
    fontSize: 26,
    fontWeight: "500" as const,
    lineHeight: 36,
  },
  innerVoice: {
    fontSize: 34,
    fontWeight: "400" as const,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "Georgia",
    serifItalic: "Georgia-Italic",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    serifItalic: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
    serifItalic: "'DM Serif Display', 'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono: "'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
