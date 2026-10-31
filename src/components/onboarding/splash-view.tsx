import { router } from "expo-router";
import { useEffect, type ReactElement } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandMark, MascotPlaceholder } from "@/components/ui";

export function SplashView(): ReactElement {
  useEffect(() => {
    const timeout = setTimeout(() => router.replace("/onboarding"), 1700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-splash overflow-hidden">
      <View
        pointerEvents="none"
        className="absolute bg-splashAccent rounded-[150px] w-[220px] h-[220px] right-[-70px] top-[-70px] opacity-[0.6]"
      />
      <View
        pointerEvents="none"
        className="absolute bg-splashAccent rounded-[150px] w-60 h-60 left-[-75px] bottom-[-95px] opacity-[0.5]"
      />
      <Text className="absolute text-primary opacity-[0.2] font-brand-mono top-20 left-[34px] text-[25px]">
        {"</>"}
      </Text>
      <Text className="absolute text-primary opacity-[0.2] font-brand-mono top-[165px] right-[43px] text-[20px]">
        {"{ }"}
      </Text>
      <Text className="absolute text-primary opacity-[0.2] font-brand-mono top-[37%] left-5 text-[15px]">
        {"$_"}
      </Text>
      <Text className="absolute text-primary opacity-[0.2] font-brand-mono bottom-[27%] right-[34px] text-[24px]">
        {"✦"}
      </Text>
      <Text className="absolute text-primary opacity-[0.2] font-brand-mono bottom-[18%] left-[52px] text-[17px]">
        {";;"}
      </Text>

      <View className="flex-1 items-center justify-center pb-[35px]">
        <MascotPlaceholder
          title="BYTEY"
          description="waving mascot art"
          width={130}
          height={130}
        />
        <View className="flex-row items-center gap-[10px] mt-7">
          <BrandMark size={38} />
          <Text className="text-darkGreen font-brand-regular text-[30px] tracking-[-1.4px]">
            BKPractice
          </Text>
        </View>
        <Text className="text-splashText font-brand-light text-[15px] mt-[5px]">
          Grow your coding skills.
        </Text>
        <View
          className="flex-row gap-[6px] mt-[67px]"
          accessibilityLabel="Loading BKPractice"
        >
          <View className="w-[7px] h-[7px] rounded-[4px] bg-primary" />
          <View className="w-[7px] h-[7px] rounded-[4px] bg-primary opacity-[0.5]" />
          <View className="w-[7px] h-[7px] rounded-[4px] bg-primary opacity-[0.25]" />
        </View>
      </View>
    </SafeAreaView>
  );
}
