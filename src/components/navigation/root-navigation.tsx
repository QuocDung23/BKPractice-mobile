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
import { router, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, type ReactElement } from "react";
import { ActivityIndicator, View } from "react-native";

import { useSessionRestore } from "@/hooks/auth";
import { Brands } from "@/lib/themes";
import { AuthSessionProvider, useAuthSession } from "@/stores/auth-session";

SplashScreen.preventAutoHideAsync();

const PUBLIC_ROUTES = new Set([
  "",
  "index",
  "onboarding",
  "sign-in",
  "forgot-password",
  "auth",
]);

function AppNavigator(): ReactElement {
  useSessionRestore();
  const { status, notice } = useAuthSession();
  const segments = useSegments();
  const currentRoute = segments[0] ?? "";
  const isPublicRoute = PUBLIC_ROUTES.has(currentRoute);
  const isRootRoute = !segments.length;
  const showGate =
    status === "loading" || (status === "signedOut" && !isPublicRoute);

  useEffect(() => {
    if (status === "loading") return;
    if (
      status === "signedOut" && (!isPublicRoute || (notice && isRootRoute))
    ) {
      router.replace("/sign-in");
      return;
    }
    if (
      status === "signedIn" &&
      (currentRoute === "sign-in" || currentRoute === "onboarding")
    )
      router.replace("/home");
  }, [status, notice, isPublicRoute, isRootRoute, currentRoute]);

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Brands.colors.surface },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="auth/callback" />
        <Stack.Protected guard={status === "signedIn"}>
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
          <Stack.Screen name="ranking" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="profile-edit" />
          <Stack.Screen name="change-password" />
        </Stack.Protected>
      </Stack>
      {showGate ? (
        <View
          accessibilityLabel="Checking your session"
          className="absolute top-0 right-0 bottom-0 left-0 bg-surface items-center justify-center"
        >
          <ActivityIndicator size="small" color={Brands.colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

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
      <AppNavigator />
    </AuthSessionProvider>
  );
}
