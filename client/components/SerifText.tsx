import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Typography, Fonts } from "@/constants/theme";

interface SerifTextProps extends TextProps {
  variant?: "reflection" | "metaphor" | "prompt";
  color?: string;
}

export function SerifText({
  style,
  variant = "reflection",
  color,
  ...rest
}: SerifTextProps) {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case "metaphor":
        return Typography.metaphor;
      case "prompt":
        return Typography.prompt;
      default:
        return Typography.reflection;
    }
  };

  return (
    <Text
      style={[
        { 
          color: color || theme.text,
          fontFamily: Fonts.serif,
        },
        getVariantStyle(),
        style,
      ]}
      {...rest}
    />
  );
}
