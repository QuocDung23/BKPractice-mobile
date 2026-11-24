import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { CourseChapterQuiz } from "@/domain/courses";
import type { LearningRequest } from "@/domain/learning";
import type { QuizProgressCollection } from "@/domain/quiz";
import { Brands } from "@/lib/themes";

type QuizListProps = {
  quizzes: readonly CourseChapterQuiz[];
  progress: LearningRequest<QuizProgressCollection>;
  retryProgress: () => void;
};

export function QuizList({
  quizzes,
  progress,
  retryProgress,
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

  const progressData =
    progress.status === "success" ? progress.data : undefined;
  const hasUnavailableResults =
    Boolean(progressData?.unavailableQuizIds.size) ||
    progress.status === "error";
  const canRetry =
    progress.status === "error"
      ? progress.retryable
      : Boolean(progressData?.retryableQuizIds.size);

  return (
    <View className="gap-3">
      {hasUnavailableResults ? (
        canRetry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry loading quiz results"
            onPress={retryProgress}
            className="min-h-10 flex-row items-center justify-between rounded-[15px] bg-resultRowBackground px-3"
          >
            <Text className="text-textSecondary font-brand-regular text-[12px]">
              {progress.status === "error"
                ? progress.message
                : "Một số kết quả chưa tải được."}
            </Text>
            <Text className="text-primary font-brand-medium text-[12px]">
              Thử lại
            </Text>
          </Pressable>
        ) : (
          <View className="min-h-10 justify-center rounded-[15px] bg-resultRowBackground px-3">
            <Text className="text-textSecondary font-brand-regular text-[12px]">
              {progress.status === "error"
                ? progress.message
                : "Một số kết quả không khả dụng."}
            </Text>
          </View>
        )
      ) : null}
      {quizzes.map((quiz) => {
        const quizProgress = progressData?.progressByQuizId.get(quiz.id);
        const isUnavailable = progressData?.unavailableQuizIds.has(quiz.id);
        const isLoading = progress.status === "loading";
        const isInProgress = quizProgress?.latestAttempt?.status === "IN_PROGRESS";
        const completed = Boolean(quizProgress?.completed);
        const hasFinishedAttempt = Boolean(
          quizProgress &&
            (quizProgress.latestAttempt?.status === "FINISHED" ||
              (isInProgress && quizProgress.attemptCount > 1)),
        );
        const status = isLoading
          ? "Đang tải kết quả…"
          : progress.status === "error" || isUnavailable
            ? "Kết quả chưa tải được"
            : completed
              ? "Hoàn thành"
              : isInProgress
                ? `Tiếp tục · ${quizProgress.latestAttempt?.answeredCount}/${quizProgress.latestAttempt?.totalQuestions}`
                : quizProgress && quizProgress.attemptCount > 0
                  ? "Chưa đạt"
                  : "Chưa làm";
        const statusClass = completed
          ? "bg-successBackground text-success"
          : isInProgress
            ? "bg-courseMint text-primary"
            : quizProgress && quizProgress.attemptCount > 0
              ? "bg-warningBackground text-warningText"
              : "bg-resultRowBackground text-textSecondary";
        return (
          <Pressable
            key={quiz.id}
            accessibilityRole="button"
            accessibilityLabel={`${quiz.title}, ${status}${hasFinishedAttempt && quizProgress ? `, kết quả cao nhất ${Math.round(quizProgress.bestPercentage)} phần trăm` : ""}`}
            onPress={() =>
              router.push({
                pathname: "/quiz-question",
                params: { quizId: quiz.id },
              })
            }
            className="min-h-[94px] flex-row items-center gap-3 rounded-[22px] border border-border bg-surface p-4"
          >
            <View
              className={`h-9 w-9 items-center justify-center rounded-full ${completed ? "bg-courseMint" : "bg-primary"}`}
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
            <View className="min-w-0 flex-1 gap-[7px]">
              <Text
                numberOfLines={2}
                className="text-text font-brand-medium text-[15px] leading-[20px]"
              >
                {quiz.title}
              </Text>
              <View className="flex-row flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <Text
                  className={`rounded-[12px] px-[9px] py-[4px] font-brand-medium text-[10px] ${statusClass}`}
                >
                  {status}
                </Text>
                {hasFinishedAttempt && quizProgress ? (
                  <Text className="text-textSecondary font-brand-mono text-[10px]">
                    Cao nhất {Math.round(quizProgress.bestPercentage)}%
                  </Text>
                ) : null}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
