import { router } from "expo-router";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Brands } from "@/lib/themes";

export default function AuthCallbackRoute(): ReactElement {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Text
          accessibilityRole="header"
          className="text-center text-text font-brand-medium text-[22px] tracking-[-0.6px]"
        >
          Microsoft sign-in could not be completed
        </Text>
        <Text className="text-center text-textSecondary font-brand-light text-[14px] leading-[20px]">
          The sign-in session expired before the app could finish. Return to
          sign in and try again.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/sign-in")}
          className="mt-2 h-[48px] rounded-[24px] bg-primary px-8 items-center justify-center active:opacity-[0.84] active:scale-[0.98]"
          style={{
            shadowColor: Brands.colors.primary,
            shadowOpacity: 0.24,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text className="text-surface font-brand-regular text-[15px]">
            Back to sign in
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
