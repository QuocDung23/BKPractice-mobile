import { Redirect, router, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LearningStatus } from "@/components/ui";
import { useQuizResult } from "@/hooks/quiz";
import { Brands } from "@/lib/themes";
import { useAuthSession } from "@/stores/auth-session";

import { QuizReviewRow } from "./quiz-review-row";

export function QuizResultView(): ReactElement {
  const params = useLocalSearchParams<{ attemptId?: string | string[] }>();
  const attemptId =
    typeof params.attemptId === "string" ? params.attemptId : undefined;
  const { status: sessionStatus } = useAuthSession();
  const request = useQuizResult(attemptId);
  if (sessionStatus === "signedOut") return <Redirect href="/sign-in" />;
  if (!attemptId) return <Redirect href="/quizzes" />;

  if (request.state.status !== "success") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-5">
          <LearningStatus
            state={request.state}
            retry={request.retry}
            empty="Quiz results are unavailable."
            centered
          />
        </View>
      </SafeAreaView>
    );
  }

  const attempt = request.state.data;
  const result = attempt.summary;
  if (!result) return <Redirect href="/quizzes" />;

  const review = attempt.questions.map((question, index) => ({
    number: index + 1,
    title: question.content,
    correct: question.feedback?.isCorrect ?? false,
  }));
  const percent = Math.round(result.percentage);
  const closeResult = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace("/courses");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1 bg-background"
          contentContainerClassName="pb-5"
        >
          <View className="bg-splash rounded-bl-[46px] rounded-br-[46px] px-5 pb-[25px]">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close result"
              onPress={closeResult}
              className="w-11 h-11 items-center justify-center ml-[-10px]"
            >
              <SymbolView
                name={{ ios: "xmark", android: "close", web: "close" }}
                size={22}
                tintColor={Brands.colors.darkGreen}
              />
            </Pressable>
            <View className="flex-row items-center gap-[15px]">
              <View
                className="w-[106px] h-[106px] rounded-[53px] border-[10px] border-primary border-t-surfaceTranslucent items-center justify-center"
                accessibilityLabel={`${percent}% score, ${result.correctCount} of ${result.totalQuestions} correct`}
              >
                <View className="w-[85px] h-[85px] rounded-[43px] bg-surface items-center justify-center">
                  <Text className="text-text font-brand-regular text-[28px] tracking-[-1px]">
                    {percent}
                    <Text className="text-[15px]">%</Text>
                  </Text>
                  <Text className="text-textSecondary font-brand-medium text-[10px]">
                    {result.correctCount} of {result.totalQuestions}
                  </Text>
                </View>
              </View>
              <View className="flex-1 items-start gap-[7px]">
                <Text className="text-darkGreen font-brand-regular text-[21px] tracking-[-0.4px]">
                  {result.passed ? "Great work!" : "Keep practicing"}
                </Text>
                <Text className="text-splashText font-brand-light text-[12px] leading-[17px]">
                  {result.passed
                    ? "You passed this quiz. Keep building on what you learned."
                    : "Review the answers below and try again when you are ready."}
                </Text>
              </View>
            </View>
          </View>

          <View className="px-5 pt-[18px] gap-[14px]">
            <View className="flex-row gap-2">
              <View
                className="flex-1 min-w-0 bg-surface border-[1px] border-border rounded-[16px] p-[10px] gap-[5px]"
                accessibilityLabel={`${result.correctCount} correct`}
              >
                <View className="flex-row items-center gap-[3px]">
                  <SymbolView
                    name={{
                      ios: "checkmark.circle",
                      android: "check_circle",
                      web: "check_circle",
                    }}
                    size={17}
                    tintColor={Brands.colors.success}
                  />
                  <Text className="font-brand-mono text-[16px] text-success">
                    {result.correctCount}
                  </Text>
                </View>
                <Text className="text-textSecondary font-brand-light text-[11px]">
                  Correct
                </Text>
              </View>
              <View
                className="flex-1 min-w-0 bg-surface border-[1px] border-border rounded-[16px] p-[10px] gap-[5px]"
                accessibilityLabel={`${result.wrongCount} incorrect`}
              >
                <View className="flex-row items-center gap-[3px]">
                  <SymbolView
                    name={{
                      ios: "xmark.circle",
                      android: "cancel",
                      web: "cancel",
                    }}
                    size={17}
                    tintColor={Brands.colors.error}
                  />
                  <Text className="font-brand-mono text-[16px] text-error">
                    {result.wrongCount}
                  </Text>
                </View>
                <Text className="text-textSecondary font-brand-light text-[11px]">
                  Incorrect
                </Text>
              </View>
            </View>

            <Text className="text-text font-brand-regular text-[17px]">
              Review
            </Text>
            <ScrollView
              accessibilityLabel="Quiz answer review"
              nestedScrollEnabled
              showsVerticalScrollIndicator
              style={{ maxHeight: 340 }}
              className="bg-surface border-[1px] border-border rounded-[20px]"
            >
              {review.map((item) => (
                <QuizReviewRow key={item.number} review={item} />
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <View className="bg-surface border-t-[1px] border-t-progressTrack px-5 pt-3 pb-2 flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Done"
            onPress={closeResult}
            className="flex-1 min-h-[52px] rounded-[19px] border-[1px] border-border bg-surface items-center justify-center"
          >
            <Text className="text-text font-brand-medium text-[15px]">
              Done
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry quiz"
            onPress={() =>
              router.replace({
                pathname: "/quiz-question",
                params: { quizId: attempt.quizId },
              })
            }
            className="flex-1 min-h-[52px] rounded-[19px] bg-primary items-center justify-center"
          >
            <Text className="text-surface font-brand-medium text-[15px]">
              Retry quiz
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
