import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { Brands } from "@/lib/themes";

type ChangePasswordSuccessProps = {
  onBack: () => void;
};

export function ChangePasswordSuccess({
  onBack,
}: ChangePasswordSuccessProps): ReactElement {
  return (
    <>
      <View className="items-center gap-4 py-6">
        <View className="w-[76px] h-[76px] rounded-full bg-successBackground items-center justify-center">
          <SymbolView
            name={{
              ios: "checkmark.seal.fill",
              android: "verified",
              web: "verified",
            }}
            size={38}
            tintColor={Brands.colors.success}
          />
        </View>
        <Text className="text-text font-brand-light text-[14px] leading-[21px] text-center">
          Your password was updated. Other devices have been signed out, and this
          session stays active.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        className="h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98]"
      >
        <Text className="text-surface font-brand-regular text-[16px]">
          Back to profile
        </Text>
      </Pressable>
    </>
  );
}
