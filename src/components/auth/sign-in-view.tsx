import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, MascotPlaceholder } from "@/components/ui";
import { useDemoSignIn } from "@/hooks/auth/use-demo-sign-in";
import { Brands } from "@/lib/themes";

export function SignInView(): ReactElement {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { feedback, setFeedback, submitSignIn } = useDemoSignIn();

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
            <View className="gap-2">
              <Text className="text-text font-brand-medium text-[13px]">
                Student ID
              </Text>
              <View className="h-[52px] border-fieldBorder border-[1px] rounded-[28px] flex-row items-center gap-[11px] pl-[17px] pr-[10px] bg-surface">
                <SymbolView
                  name={{
                    ios: "person.crop.rectangle",
                    android: "badge",
                    web: "badge",
                  }}
                  size={19}
                  tintColor={Brands.colors.textMuted}
                />
                <TextInput
                  accessibilityLabel="Student ID"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  onChangeText={(value) => {
                    setStudentId(value);
                    setFeedback("");
                  }}
                  placeholder="123220145"
                  placeholderTextColor={Brands.colors.text}
                  className="flex-1 min-w-0 text-text font-brand-regular text-[15px] py-0"
                  value={studentId}
                />
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-text font-brand-medium text-[13px]">
                Password
              </Text>
              <View
                className="h-[52px] border-primary border-[1px] rounded-[28px] flex-row items-center gap-[11px] pl-[17px] pr-[10px] bg-surface"
                style={{
                  shadowColor: Brands.colors.primary,
                  shadowOpacity: 0.12,
                  shadowRadius: 5,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 1,
                }}
              >
                <SymbolView
                  name={{ ios: "lock", android: "lock", web: "lock" }}
                  size={19}
                  tintColor={Brands.colors.primary}
                />
                <TextInput
                  accessibilityLabel="Password"
                  autoComplete="password"
                  onChangeText={(value) => {
                    setPassword(value);
                    setFeedback("");
                  }}
                  placeholder="••••••••••"
                  placeholderTextColor={Brands.colors.text}
                  secureTextEntry={!passwordVisible}
                  className="flex-1 min-w-0 text-text font-brand-regular text-[15px] py-0"
                  value={password}
                />
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
              </View>
            </View>

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
                onPress={() =>
                  setFeedback("Password recovery is not connected yet.")
                }
                className="min-h-11 justify-center"
              >
                <Text className="text-primary font-brand-medium text-[14px]">
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => submitSignIn(studentId, password)}
              className="h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98]"
              style={{
                shadowColor: Brands.colors.primary,
                shadowOpacity: 0.24,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              <Text className="text-surface font-brand-regular text-[16px]">
                Sign In
              </Text>
            </Pressable>
            {feedback ? (
              <Text
                accessibilityRole="alert"
                className="text-hardText font-brand-regular text-[13px] leading-[18px]"
              >
                {feedback}
              </Text>
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
              onPress={() =>
                setFeedback("University SSO is not connected yet.")
              }
              className="h-[52px] rounded-[28px] border-fieldBorder border-[1px] bg-surface flex-row items-center justify-center gap-[10px] active:opacity-[0.84] active:scale-[0.98]"
            >
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
                Continue with university SSO
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
