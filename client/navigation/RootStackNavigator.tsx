import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useScreenOptions } from "@/hooks/useScreenOptions";

import CheckInScreen from "@/screens/CheckInScreen";
import ReflectionScreen from "@/screens/ReflectionScreen";
import VisualStateScreen from "@/screens/VisualStateScreen";
import SettingsScreen from "@/screens/SettingsScreen";

export type RootStackParamList = {
  CheckIn: undefined;
  Reflection: {
    userInput: string;
    reflection: string;
    metaphor: string;
  };
  VisualState: {
    emotionalTone: string;
  };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reflection"
        component={ReflectionScreen}
        options={{ 
          headerTitle: "",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="VisualState"
        component={VisualStateScreen}
        options={{ 
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ 
          headerTitle: "Settings",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
