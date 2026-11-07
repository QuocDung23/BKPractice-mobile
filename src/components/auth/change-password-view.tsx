import { router } from "expo-router";
import type { ReactElement } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useChangePassword } from "@/hooks/auth";

import { ChangePasswordForm } from "./change-password-form";
import { ChangePasswordHeader } from "./change-password-header";
import { ChangePasswordSuccess } from "./change-password-success";

export function ChangePasswordView(): ReactElement {
  const change = useChangePassword();

  function goBack(): void {
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="grow pb-6"
          keyboardShouldPersistTaps="handled"
        >
          <ChangePasswordHeader onBack={goBack} />
          <View className="px-5 pt-3 gap-4">
            {change.isChanged ? (
              <ChangePasswordSuccess onBack={goBack} />
            ) : (
              <ChangePasswordForm change={change} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
