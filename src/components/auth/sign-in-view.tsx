import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState, type ReactElement } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, InputField, MascotPlaceholder } from "@/components/ui";
import { useMicrosoftSignIn, useSignIn } from "@/hooks/auth";
import { Brands } from "@/lib/themes";
import { useAuthSession } from "@/stores/auth-session";

export function SignInView(): ReactElement {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { error, isSubmitting, submitSignIn, clearError, retryStorageCleanup } = useSignIn();
  const { notice, clearNotice } = useAuthSession();
  useEffect(() => () => clearNotice(), [clearNotice]);
  const {
    error: ssoError,
    isSubmitting: isSsoSubmitting,
    submitMicrosoftSignIn,
    clearError: clearSsoError,
  } = useMicrosoftSignIn();
  const busy = isSubmitting || isSsoSubmitting || notice?.code === "storage";
  const feedback = error ?? ssoError ?? notice?.message;

  function clearFeedback(): void {
    clearError();
    clearSsoError();
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
          <View className="h-[151px] bg-learn rounded-bl-[48px] rounded-br-[48px] overflow-hidden flex-row items-center justify-between px-5">
            <View className="absolute top-[-41px] left-[-30px] w-[120px] h-[120px] rounded-[60px] bg-courseMint" />
            <View className="flex-1 gap-1">
              <View className="flex-row items-center gap-[9px] mb-1">
                <BrandMark size={30} />
                <Text className="text-darkGreen font-brand-regular text-[19px] tracking-[-0.7px]">
                  BKPractice
                </Text>
              </View>
              <Text className="text-text font-brand-regular text-[24px] tracking-[-0.9px]">
                Welcome back
              </Text>
              <Text className="text-signInCaption font-brand-light text-[14px]">
                Bytey missed you.
              </Text>
            </View>
            <MascotPlaceholder
              title="BYTEY"
              description="peeking"
              width={74}
              height={90}
              compact
            />
          </View>

          <View className="px-5 pt-7 gap-4">
            <InputField
              label="Student ID or email"
              icon={{
                ios: "person.crop.rectangle",
                android: "badge",
                web: "badge",
              }}
              iconTintColor={Brands.colors.primary}
              borderColor={Brands.colors.primary}
              accessibilityLabel="Student ID or email"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect={false}
              editable={!busy}
              keyboardType="email-address"
              onChangeText={(value) => {
                setIdentifier(value);
                clearFeedback();
              }}
              placeholder="22520000"
              placeholderTextColor={Brands.colors.textMuted}
              textContentType="username"
              value={identifier}
            />

            <InputField
              label="Password"
              icon={{ ios: "lock", android: "lock", web: "lock" }}
              iconTintColor={Brands.colors.primary}
              borderColor={Brands.colors.primary}
              accessibilityLabel="Password"
              autoComplete="current-password"
              editable={!busy}
              onChangeText={(value) => {
                setPassword(value);
                clearFeedback();
              }}
              onSubmitEditing={() => {
                if (!busy) submitSignIn(identifier, password, rememberMe);
              }}
              placeholder="••••••••••"
              placeholderTextColor={Brands.colors.textMuted}
              returnKeyType="go"
              secureTextEntry={!passwordVisible}
              textContentType="password"
              value={password}
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
                      web: passwordVisible ? "visibility" : "visibility_off",
                    }}
                    size={21}
                    tintColor={Brands.colors.textSecondary}
                  />
                </Pressable>
              }
            />

            <View className="flex-row items-center justify-between">
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                onPress={() => setRememberMe(!rememberMe)}
                className="min-h-11 flex-row items-center gap-[9px]"
              >
                <View
                  className={`w-[21px] h-[21px] rounded-[11px] items-center justify-center border-primary border-[1px] ${!rememberMe ? "bg-surface" : "bg-primary"}`}
                >
                  {rememberMe && (
                    <SymbolView
                      name={{
                        ios: "checkmark",
                        android: "check",
                        web: "check",
                      }}
                      size={13}
                      tintColor={Brands.colors.surface}
                    />
                  )}
                </View>
                <Text className="text-text font-brand-light text-[14px]">
                  Remember me
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push("/forgot-password")}
                className="min-h-11 justify-center"
              >
                <Text className="text-primary font-brand-medium text-[14px]">
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: busy, busy: isSubmitting }}
              disabled={busy}
              onPress={() => submitSignIn(identifier, password, rememberMe)}
              className={`h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98] ${busy ? "opacity-[0.72]" : ""}`}
              style={{
                shadowColor: Brands.colors.primary,
                shadowOpacity: 0.24,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              {isSubmitting ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator
                    size="small"
                    color={Brands.colors.surface}
                  />
                  <Text className="text-surface font-brand-regular text-[16px]">
                    Signing in…
                  </Text>
                </View>
              ) : (
                <Text className="text-surface font-brand-regular text-[16px]">
                  Sign In
                </Text>
              )}
            </Pressable>

            {feedback ? (
              <View
                accessibilityRole="alert"
                className="rounded-[16px] border-[1px] border-errorBorder bg-errorBackground px-3 py-[10px] flex-row items-start gap-2"
              >
                <SymbolView
                  name={{
                    ios: "exclamationmark.circle",
                    android: "error",
                    web: "error",
                  }}
                  size={16}
                  tintColor={Brands.colors.error}
                />
                <Text className="flex-1 text-hardText font-brand-regular text-[13px] leading-[18px]">
                  {feedback}
                </Text>
              </View>
            ) : null}

            {notice?.code === "storage" ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retry clearing saved session"
                disabled={isSubmitting}
                onPress={() => { clearFeedback(); void retryStorageCleanup(); }}
                className="min-h-11 items-center justify-center"
              >
                <Text className="text-primary font-brand-medium text-[14px]">
                  {isSubmitting ? "Retrying…" : "Retry"}
                </Text>
              </Pressable>
            ) : null}

            <View className="flex-row items-center gap-3 my-[1px]">
              <View className="flex-1 h-[1px] bg-border" />
              <Text className="text-textMuted font-brand-light text-[12px]">
                or
              </Text>
              <View className="flex-1 h-[1px] bg-border" />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: busy, busy: isSsoSubmitting }}
              disabled={busy}
              onPress={() => {
                clearFeedback();
                submitMicrosoftSignIn();
              }}
              className={`h-[52px] rounded-[28px] border-fieldBorder border-[1px] bg-surface flex-row items-center justify-center gap-[10px] active:opacity-[0.84] active:scale-[0.98] ${busy ? "opacity-[0.72]" : ""}`}
            >
              {isSsoSubmitting ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator
                    size="small"
                    color={Brands.colors.primary}
                  />
                  <Text className="text-text font-brand-medium text-[15px]">
                    Opening Microsoft…
                  </Text>
                </View>
              ) : (
                <>
                  <SymbolView
                    name={{
                      ios: "graduationcap",
                      android: "school",
                      web: "school",
                    }}
                    size={18}
                    tintColor={Brands.colors.primary}
                  />
                  <Text className="text-text font-brand-medium text-[15px]">
                    Login with Microsoft
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
