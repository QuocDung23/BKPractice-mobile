import type { ReactElement } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { LearningRequest } from "@/domain/learning";
import { Brands } from "@/lib/themes";

type LearningStatusProps = {
  state: LearningRequest<unknown>;
  retry: () => void;
  empty: string;
  centered?: boolean;
};

export function LearningStatus({
  state,
  retry,
  empty,
  centered = false,
}: LearningStatusProps): ReactElement {
  return (
    <View
      className={`items-center gap-2 rounded-[20px] ${centered ? "flex-1 justify-center px-5" : ""}`}
    >
      {state.status === "loading" ? (
        <ActivityIndicator
          accessibilityLabel="Loading"
          color={Brands.colors.primary}
        />
      ) : (
        <Text
          accessibilityLiveRegion="polite"
          className="w-full text-center text-textSecondary font-brand-regular"
        >
          {state.status === "error" ? state.message : empty}
        </Text>
      )}
      {state.status === "error" && state.retryable ? (
        <Pressable
          accessibilityRole="button"
          onPress={retry}
          className="min-h-11 justify-center px-3"
        >
          <Text className="text-primary font-brand-medium">Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
