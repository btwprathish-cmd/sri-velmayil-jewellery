import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="about" options={{ title: "About Us", headerStyle: { backgroundColor: "#0c0418" }, headerTintColor: "#D4AF37", headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: "#fbf6e8" } }} />
      <Stack.Screen name="faq" options={{ title: "FAQ", headerStyle: { backgroundColor: "#0c0418" }, headerTintColor: "#D4AF37", headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: "#fbf6e8" } }} />
      <Stack.Screen name="blog" options={{ title: "Insights", headerStyle: { backgroundColor: "#0c0418" }, headerTintColor: "#D4AF37", headerTitleStyle: { fontFamily: "Inter_600SemiBold", color: "#fbf6e8" } }} />
      <Stack.Screen name="blog/[slug]" options={{ title: "", headerStyle: { backgroundColor: "#0c0418" }, headerTintColor: "#D4AF37" }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
