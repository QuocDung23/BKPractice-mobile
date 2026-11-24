import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { LearningStatus } from "@/components/ui";
import { useInProgressQuizzes } from "@/hooks/quiz";
import { Brands } from "@/lib/themes";

export function HomeInProgressQuizzes(): ReactElement {
  const { state, retry } = useInProgressQuizzes();

  return (
    <View className="gap-3">
      <Text
        accessibilityRole="header"
        className="text-text font-brand-regular text-[17px] tracking-[-0.3px]"
      >
        Continue Quizzes
      </Text>
      {state.status === "success" && state.data.length > 0 ? (
        state.data.map((quiz) => (
          <Pressable
            key={quiz.id}
            accessibilityRole="button"
            accessibilityLabel={`Resume ${quiz.title}, ${quiz.answeredCount} of ${quiz.totalQuestions} questions answered`}
            onPress={() =>
              router.push({
                pathname: "/quiz-question",
                params: { quizId: quiz.quizId, attemptId: quiz.id },
              })
            }
            className="gap-3 rounded-[22px] border border-border bg-surface p-4 active:opacity-75"
          >
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-courseMint">
                <SymbolView
                  name={{
                    ios: "checklist",
                    android: "checklist",
                    web: "checklist",
                  }}
                  size={23}
                  tintColor={Brands.colors.primary}
                />
              </View>
              <Text className="flex-1 font-brand-regular text-base text-text">
                {quiz.title}
              </Text>
              <SymbolView
                name={{
                  ios: "chevron.right",
                  android: "chevron_right",
                  web: "chevron_right",
                }}
                size={20}
                tintColor={Brands.colors.textMuted}
              />
            </View>
            <View className="flex-row items-center gap-3">
              <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-progressTrack">
                <View
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(quiz.answeredCount / quiz.totalQuestions) * 100}%`,
                  }}
                />
              </View>
              <Text className="font-brand-monoMedium text-[11px] text-text">
                {quiz.answeredCount}/{quiz.totalQuestions} answered
              </Text>
            </View>
          </Pressable>
        ))
      ) : (
        <View className="rounded-[22px] border border-border bg-surface p-4">
          <LearningStatus
            state={state}
            retry={retry}
            empty="No quizzes in progress."
          />
        </View>
      )}
    </View>
  );
}
