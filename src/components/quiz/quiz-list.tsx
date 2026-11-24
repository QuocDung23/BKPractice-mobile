import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Text, View } from "react-native";

import type { CourseChapterQuiz } from "@/domain/courses";
import { Brands } from "@/lib/themes";

type QuizListProps = {
  quizzes: readonly CourseChapterQuiz[];
  completedQuizIds: ReadonlySet<string>;
};

export function QuizList({
  quizzes,
  completedQuizIds,
}: QuizListProps): ReactElement {
  if (!quizzes.length) {
    return (
      <View className="items-center rounded-[22px] bg-resultRowBackground px-5 py-8">
        <Text className="text-center text-textSecondary font-brand-regular text-[13px]">
          No quizzes in this chapter yet.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {quizzes.map((quiz) => {
        const completed = completedQuizIds.has(quiz.id);
        return (
          <View
            key={quiz.id}
            accessibilityLabel={`${quiz.title}, ${completed ? "completed" : "not completed"}`}
            accessible
            className="min-h-[76px] flex-row items-center gap-3 rounded-[22px] border border-border bg-surface p-4"
          >
            <View
              className={`h-9 w-9 items-center justify-center rounded-full ${
                completed ? "bg-courseMint" : "bg-primary"
              }`}
            >
              <SymbolView
                name={
                  completed
                    ? {
                        ios: "checkmark",
                        android: "check",
                        web: "check",
                      }
                    : {
                        ios: "play.fill",
                        android: "play_arrow",
                        web: "play_arrow",
                      }
                }
                size={12}
                tintColor={
                  completed ? Brands.colors.primary : Brands.colors.surface
                }
              />
            </View>
            <Text
              numberOfLines={2}
              className="min-w-0 flex-1 text-text font-brand-medium text-[15px] leading-[20px]"
            >
              {quiz.title}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
