import { useState, type ReactElement } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { FeedbackBanner, InputField } from "@/components/ui";
import type { useChangePassword } from "@/hooks/auth";
import { Brands } from "@/lib/themes";

import { PasswordVisibilityToggle } from "./password-visibility-toggle";

type ChangePasswordFormProps = {
  change: ReturnType<typeof useChangePassword>;
};

export function ChangePasswordForm({
  change,
}: ChangePasswordFormProps): ReactElement {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function togglePasswordVisibility(): void {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <>
      <InputField
        label="Current password"
        icon={{ ios: "lock", android: "lock", web: "lock" }}
        iconTintColor={Brands.colors.primary}
        borderColor={Brands.colors.primary}
        accessibilityLabel="Current password"
        autoCapitalize="none"
        autoComplete="current-password"
        autoCorrect={false}
        editable={!change.isSubmitting}
        onChangeText={change.setCurrentPassword}
        placeholder="••••••••••"
        placeholderTextColor={Brands.colors.textMuted}
        secureTextEntry={!passwordVisible}
        textContentType="password"
        value={change.currentPassword}
        rightElement={
          <PasswordVisibilityToggle
            passwordVisible={passwordVisible}
            onToggle={togglePasswordVisibility}
          />
        }
      />

      <InputField
        label="New password"
        icon={{ ios: "key", android: "key", web: "key" }}
        iconTintColor={Brands.colors.primary}
        borderColor={Brands.colors.primary}
        accessibilityLabel="New password"
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        editable={!change.isSubmitting}
        onChangeText={change.setNewPassword}
        placeholder="At least 8 characters"
        placeholderTextColor={Brands.colors.textMuted}
        secureTextEntry={!passwordVisible}
        textContentType="newPassword"
        value={change.newPassword}
        rightElement={
          <PasswordVisibilityToggle
            passwordVisible={passwordVisible}
            onToggle={togglePasswordVisibility}
          />
        }
      />
      <InputField
        label="Confirm new password"
        icon={{
          ios: "checkmark.shield",
          android: "verified_user",
          web: "verified_user",
        }}
        iconTintColor={Brands.colors.primary}
        borderColor={Brands.colors.primary}
        accessibilityLabel="Confirm new password"
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect={false}
        editable={!change.isSubmitting}
        onChangeText={change.setConfirmPassword}
        onSubmitEditing={() => change.submit()}
        placeholder="Re-enter new password"
        placeholderTextColor={Brands.colors.textMuted}
        returnKeyType="done"
        secureTextEntry={!passwordVisible}
        textContentType="newPassword"
        value={change.confirmPassword}
        rightElement={
          <PasswordVisibilityToggle
            passwordVisible={passwordVisible}
            onToggle={togglePasswordVisibility}
          />
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          disabled: change.isSubmitting,
          busy: change.isSubmitting,
        }}
        disabled={change.isSubmitting}
        onPress={() => change.submit()}
        className={`h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98] ${
          change.isSubmitting ? "opacity-[0.72]" : ""
        }`}
      >
        {change.isSubmitting ? (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" color={Brands.colors.surface} />
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

      {change.error ? (
        <FeedbackBanner message={change.error} tone="error" />
      ) : null}
    </>
  );
}
