import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Text, View } from "react-native";

import { Brands } from "@/lib/themes";

type FeedbackBannerProps = {
  message: string;
  tone: "error" | "notice" | "success";
};

export function FeedbackBanner({
  message,
  tone,
}: FeedbackBannerProps): ReactElement {
  const isError = tone === "error";
  const isSuccess = tone === "success";
  return (
    <View
      accessibilityRole={isError ? "alert" : "text"}
      className={`rounded-[16px] border-[1px] px-3 py-[10px] flex-row items-start gap-2 ${
        isError
          ? "border-errorBorder bg-errorBackground"
          : "border-signInAccent bg-learn"
      }`}
    >
      <SymbolView
        name={{
          ios: isError
            ? "exclamationmark.circle"
            : isSuccess
              ? "checkmark.circle"
              : "info.circle",
          android: isError ? "error" : isSuccess ? "check_circle" : "info",
          web: isError ? "error" : isSuccess ? "check_circle" : "info",
        }}
        size={16}
        tintColor={isError ? Brands.colors.error : Brands.colors.primary}
      />
      <Text
        className={`flex-1 font-brand-regular text-[13px] leading-[18px] ${
          isError ? "text-hardText" : "text-signInCaption"
        }`}
      >
        {message}
      </Text>
    </View>
  );
}
