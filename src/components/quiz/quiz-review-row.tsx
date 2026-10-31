import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Text, View } from "react-native";

import type { QuizReview } from "@/domain/quiz";
import { Brands } from "@/lib/themes";

type QuizReviewRowProps = { review: QuizReview };

export function QuizReviewRow({ review }: QuizReviewRowProps): ReactElement {
  return (
    <View
      className="min-h-[46px] flex-row items-center gap-[11px] px-[13px] py-2 border-b-[1px] border-b-resultRowBackground"
      accessibilityLabel={`Question ${review.number}, ${review.title}, ${review.correct ? "correct" : "incorrect"}`}
    >
      <Text className="text-textMuted font-brand-mono text-[11px] w-[23px]">
        {String(review.number).padStart(2, "0")}
      </Text>
      <Text
        className="text-text font-brand-regular text-[13px] flex-1"
        numberOfLines={2}
      >
        {review.title}
      </Text>
      <SymbolView
        name={{
          ios: review.correct ? "checkmark.circle" : "xmark.circle",
          android: review.correct ? "check_circle" : "cancel",
          web: review.correct ? "check_circle" : "cancel",
        }}
        size={19}
        tintColor={review.correct ? Brands.colors.success : Brands.colors.error}
      />
    </View>
  );
}
