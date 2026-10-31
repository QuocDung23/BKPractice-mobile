import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, type ReactElement } from "react";

import { Brands } from "@/lib/themes";
import { AuthSessionProvider } from "@/stores/auth-session";

SplashScreen.preventAutoHideAsync();

export function RootNavigation(): ReactElement | null {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AuthSessionProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Brands.colors.surface },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="home" />
        <Stack.Screen name="courses" />
        <Stack.Screen name="course-detail" />
        <Stack.Screen name="lesson" />
        <Stack.Screen name="problems" />
        <Stack.Screen name="problem-detail" />
        <Stack.Screen name="submission-result" />
        <Stack.Screen name="quizzes" />
        <Stack.Screen name="quiz-question" />
        <Stack.Screen name="quiz-result" />
        <Stack.Screen name="assignments" />
        <Stack.Screen name="assignment-detail" />
      </Stack>
    </AuthSessionProvider>
  );
}
