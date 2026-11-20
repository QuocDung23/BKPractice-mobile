import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, FeedbackBanner, InputField } from "@/components/ui";
import { usePasswordReset } from "@/hooks/auth";
import { Brands } from "@/lib/themes";

const STEP_LABELS = ["Email", "Code", "Password"] as const;

export function PasswordResetView(): ReactElement {
  const reset = usePasswordReset();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const stepIndex =
    reset.step === "email" ? 0 : reset.step === "otp" ? 1 : 2;

  const title =
    reset.step === "email"
      ? "Reset password"
      : reset.step === "otp"
        ? "Check your email"
        : reset.step === "password"
          ? "Choose a new password"
          : "You're all set";
  const subtitle =
    reset.step === "email"
      ? "Enter the email linked to your BKPractice account. We'll send a 6-digit code."
      : reset.step === "otp"
        ? `We sent a code to ${reset.email}. Enter it below to continue.`
        : reset.step === "password"
          ? "Use 8–128 characters. Avoid reusing your old password."
          : "Your password has been updated. Sign in with your new password.";

  function goBack(): void {
    if (reset.step === "done") {
      router.replace("/sign-in");
      return;
    }
    if (reset.step === "email") {
      if (router.canGoBack()) router.back();
      else router.replace("/sign-in");
      return;
    }
    reset.editEmail();
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
          <View className="px-5 pt-2 pb-4 gap-3">
            <View className="h-11 flex-row items-center justify-between">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={goBack}
                className="w-11 h-11 -ml-2 items-center justify-center active:opacity-[0.7]"
              >
                <SymbolView
                  name={{
                    ios: "chevron.left",
                    android: "arrow_back",
                    web: "arrow_back",
                  }}
                  size={21}
                  tintColor={Brands.colors.text}
                />
              </Pressable>
              <View className="flex-row items-center gap-2">
                <BrandMark size={24} />
                <Text className="text-darkGreen font-brand-regular text-[16px] tracking-[-0.5px]">
                  BKPractice
                </Text>
              </View>
              <View className="w-11" />
            </View>
            <Text className="text-text font-brand-regular text-[25px] tracking-[-0.9px]">
              {title}
            </Text>
            <Text className="text-signInCaption font-brand-light text-[14px] leading-[21px]">
              {subtitle}
            </Text>
            {reset.step !== "done" ? (
              <View
                className="flex-row gap-2 mt-1"
                accessibilityLabel={`Step ${stepIndex + 1} of 3`}
              >
                {STEP_LABELS.map((label, index) => (
                  <View key={label} className="flex-1 gap-[5px]">
                    <View
                      className={`h-[4px] rounded-full ${
                        index <= stepIndex ? "bg-primary" : "bg-progressTrack"
                      }`}
                    />
                    <Text
                      className={`font-brand-monoMedium text-[9px] uppercase tracking-[0.6px] ${
                        index <= stepIndex ? "text-primary" : "text-textMuted"
                      }`}
                    >
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>

          <View className="px-5 pt-3 gap-4">
            {reset.step === "email" ? (
              <>
                <InputField
                  label="Email"
                  icon={{
                    ios: "envelope",
                    android: "mail",
                    web: "mail",
                  }}
                  iconTintColor={Brands.colors.primary}
                  borderColor={Brands.colors.primary}
                  accessibilityLabel="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  editable={!reset.isSubmitting}
                  keyboardType="email-address"
                  onChangeText={reset.setEmail}
                  onSubmitEditing={() => reset.submitEmail()}
                  placeholder="you@sv1.dut.udn.vn"
                  placeholderTextColor={Brands.colors.textMuted}
                  returnKeyType="send"
                  textContentType="emailAddress"
                  value={reset.email}
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: reset.isSubmitting,
                    busy: reset.isSubmitting,
                  }}
                  disabled={reset.isSubmitting}
                  onPress={() => reset.submitEmail()}
                  className={`h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98] ${
                    reset.isSubmitting ? "opacity-[0.72]" : ""
                  }`}
                >
                  {reset.isSubmitting ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator
                        size="small"
                        color={Brands.colors.surface}
                      />
                      <Text className="text-surface font-brand-regular text-[16px]">
                        Sending code…
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-surface font-brand-regular text-[16px]">
                      Send code
                    </Text>
                  )}
                </Pressable>

                <Text className="text-textMuted font-brand-light text-[12px] leading-[18px]">
                  For your privacy, the response is the same whether or not the
                  email is registered.
                </Text>
              </>
            ) : null}

            {reset.step === "otp" ? (
              <>
                <View className="gap-2">
                  <Text className="text-text font-brand-medium text-[13px]">
                    6-digit code
                  </Text>
                  <TextInput
                    accessibilityLabel="6-digit code"
                    autoComplete="one-time-code"
                    editable={!reset.isSubmitting}
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={reset.setOtp}
                    onSubmitEditing={() => reset.submitOtp()}
                    placeholder="000000"
                    placeholderTextColor={Brands.colors.textMuted}
                    returnKeyType="done"
                    textContentType="oneTimeCode"
                    className="h-[58px] rounded-[28px] border-[1px] border-fieldBorder bg-surface text-center text-text font-brand-mono text-[22px] tracking-[6px] py-0"
                    value={reset.otp}
                  />
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: reset.isSubmitting,
                    busy: reset.isSubmitting,
                  }}
                  disabled={reset.isSubmitting}
                  onPress={() => reset.submitOtp()}
                  className={`h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98] ${
                    reset.isSubmitting ? "opacity-[0.72]" : ""
                  }`}
                >
                  {reset.isSubmitting ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator
                        size="small"
                        color={Brands.colors.surface}
                      />
                      <Text className="text-surface font-brand-regular text-[16px]">
                        Verifying…
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-surface font-brand-regular text-[16px]">
                      Verify code
                    </Text>
                  )}
                </Pressable>

                <View className="flex-row items-center justify-between">
                  <Pressable
                    accessibilityRole="button"
                    disabled={reset.isSubmitting}
                    onPress={() => reset.editEmail()}
                    className="min-h-11 justify-center"
                  >
                    <Text className="text-textSecondary font-brand-medium text-[14px]">
                      Change email
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ disabled: !reset.canResend }}
                    disabled={!reset.canResend}
                    onPress={() => reset.resendOtp()}
                    className="min-h-11 justify-center"
                  >
                    <Text
                      className={`font-brand-medium text-[14px] ${
                        reset.canResend ? "text-primary" : "text-textMuted"
                      }`}
                    >
                      {reset.resendSeconds > 0
                        ? `Resend in ${reset.resendSeconds}s`
                        : "Resend code"}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : null}

            {reset.step === "password" ? (
              <>
                <InputField
                  label="New password"
                  icon={{ ios: "lock", android: "lock", web: "lock" }}
                  iconTintColor={Brands.colors.primary}
                  borderColor={Brands.colors.primary}
                  accessibilityLabel="New password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  editable={!reset.isSubmitting}
                  onChangeText={reset.setNewPassword}
                  onSubmitEditing={() => reset.submitPassword()}
                  placeholder="At least 8 characters"
                  placeholderTextColor={Brands.colors.textMuted}
                  returnKeyType="done"
                  secureTextEntry={!passwordVisible}
                  textContentType="newPassword"
                  value={reset.newPassword}
                  rightElement={
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        passwordVisible ? "Hide password" : "Show password"
                      }
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      className="w-11 h-11 items-center justify-center"
                    >
                      <SymbolView
                        name={{
                          ios: passwordVisible ? "eye" : "eye.slash",
                          android: passwordVisible
                            ? "visibility"
                            : "visibility_off",
                          web: passwordVisible
                            ? "visibility"
                            : "visibility_off",
                        }}
                        size={21}
                        tintColor={Brands.colors.textSecondary}
                      />
                    </Pressable>
                  }
                />
                <Text className="text-textMuted font-brand-light text-[12px]">
                  {reset.newPassword.length}/128 characters
                </Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{
                    disabled: reset.isSubmitting,
                    busy: reset.isSubmitting,
                  }}
                  disabled={reset.isSubmitting}
                  onPress={() => reset.submitPassword()}
                  className={`h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98] ${
                    reset.isSubmitting ? "opacity-[0.72]" : ""
                  }`}
                >
                  {reset.isSubmitting ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator
                        size="small"
                        color={Brands.colors.surface}
                      />
                      <Text className="text-surface font-brand-regular text-[16px]">
                        Updating…
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-surface font-brand-regular text-[16px]">
                      Update password
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => reset.editEmail()}
                  className="min-h-11 items-center justify-center"
                >
                  <Text className="text-textSecondary font-brand-medium text-[14px]">
                    Start over
                  </Text>
                </Pressable>
              </>
            ) : null}

            {reset.step === "done" ? (
              <>
                <View className="items-center gap-4 py-6">
                  <View className="w-[76px] h-[76px] rounded-full bg-learn items-center justify-center">
                    <SymbolView
                      name={{
                        ios: "checkmark.seal.fill",
                        android: "verified",
                        web: "verified",
                      }}
                      size={38}
                      tintColor={Brands.colors.primary}
                    />
                  </View>
                  <Text className="text-text font-brand-light text-[14px] leading-[21px] text-center">
                    Your new password is ready. Keep it somewhere safe and use
                    it the next time you sign in.
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.replace("/sign-in")}
                  className="h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98]"
                >
                  <Text className="text-surface font-brand-regular text-[16px]">
                    Back to sign in
                  </Text>
                </Pressable>
              </>
            ) : null}

            {reset.error ? (
              <FeedbackBanner message={reset.error} tone="error" />
            ) : null}
            {reset.notice && reset.step !== "done" ? (
              <FeedbackBanner message={reset.notice} tone="notice" />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
