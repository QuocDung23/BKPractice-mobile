import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { BrandMark } from "@/components/ui";
import { Brands } from "@/lib/themes";

type ChangePasswordHeaderProps = {
  onBack: () => void;
};

export function ChangePasswordHeader({
  onBack,
}: ChangePasswordHeaderProps): ReactElement {
  return (
    <View className="px-5 pt-2 pb-4 gap-3">
      <View className="h-11 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
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
        Change password
      </Text>
      <Text className="text-signInCaption font-brand-light text-[14px] leading-[21px]">
        Confirm your current password, then choose a new one. Other devices will
        be signed out.
      </Text>
    </View>
  );
}
