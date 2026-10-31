import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHomeData } from "@/hooks/auth/use-home-data";
import { useQuizData } from "@/hooks/quiz";
import { Brands } from "@/lib/themes";

import { QuizReviewRow } from "./quiz-review-row";

export function QuizResultView(): ReactElement {
  const session = useHomeData();
  const data = useQuizData();
  if (!session || !data) return <Redirect href="/sign-in" />;

  const { result } = data;
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-[30px]"
      >
        <View className="bg-splash rounded-bl-[46px] rounded-br-[46px] px-5 pb-[25px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close result"
            onPress={() => router.replace("/quizzes")}
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
              accessibilityLabel={`${result.percent}% score, ${result.correct} of ${result.correct + result.incorrect} correct`}
            >
              <View className="w-[85px] h-[85px] rounded-[43px] bg-surface items-center justify-center">
                <Text className="text-text font-brand-regular text-[28px] tracking-[-1px]">
                  {result.percent}
                  <Text className="text-[15px]">%</Text>
                </Text>
                <Text className="text-textSecondary font-brand-medium text-[10px]">
                  {result.correct} of {result.correct + result.incorrect}
                </Text>
              </View>
            </View>
            <View className="flex-1 items-start gap-[7px]">
              <Text className="text-darkGreen font-brand-regular text-[21px] tracking-[-0.4px]">
                Nice work, {session.student.greetingName}!
              </Text>
              <Text className="text-splashText font-brand-light text-[12px] leading-[17px]">
                {result.comparison}
              </Text>
              <View className="bg-surface rounded-[17px] px-[10px] py-[6px] flex-row items-center gap-[5px]">
                <SymbolView
                  name={{ ios: "star", android: "star", web: "star" }}
                  size={17}
                  tintColor={Brands.colors.homeOrange}
                />
                <Text className="text-growText font-brand-mono text-[11px]">
                  +{result.gainedXp} XP
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-5 pt-[18px] gap-[14px]">
          <View className="flex-row gap-2">
            <View
              className="flex-1 min-w-0 bg-surface border-[1px] border-border rounded-[16px] p-[10px] gap-[5px]"
              accessibilityLabel={`${result.correct} correct`}
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
                  {result.correct}
                </Text>
              </View>
              <Text className="text-textSecondary font-brand-light text-[11px]">
                Correct
              </Text>
            </View>
            <View
              className="flex-1 min-w-0 bg-surface border-[1px] border-border rounded-[16px] p-[10px] gap-[5px]"
              accessibilityLabel={`${result.incorrect} incorrect`}
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
                  {result.incorrect}
                </Text>
              </View>
              <Text className="text-textSecondary font-brand-light text-[11px]">
                Incorrect
              </Text>
            </View>
            <View
              className="flex-1 min-w-0 bg-surface border-[1px] border-border rounded-[16px] p-[10px] gap-[5px]"
              accessibilityLabel={`${result.time} time`}
            >
              <View className="flex-row items-center gap-[3px]">
                <SymbolView
                  name={{ ios: "timer", android: "timer", web: "timer" }}
                  size={17}
                  tintColor={Brands.colors.primary}
                />
                <Text className="font-brand-mono text-[16px] text-primary">
                  {result.time}
                </Text>
              </View>
              <Text className="text-textSecondary font-brand-light text-[11px]">
                Time
              </Text>
            </View>
          </View>

          <Text className="text-text font-brand-regular text-[17px]">
            Review
          </Text>
          <View className="bg-surface border-[1px] border-border rounded-[20px] overflow-hidden">
            {result.review.map((review) => (
              <QuizReviewRow key={review.number} review={review} />
            ))}
          </View>

          <View className="flex-row gap-3 mt-[2px]">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              onPress={() => router.replace("/quizzes")}
              className="flex-1 min-h-[50px] rounded-[19px] border-[1px] border-border bg-surface items-center justify-center"
            >
              <Text className="text-text font-brand-medium text-[15px]">
                Done
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retry quiz"
              onPress={() => router.replace("/quiz-question")}
              className="flex-1 min-h-[50px] rounded-[19px] bg-primary items-center justify-center"
            >
              <Text className="text-surface font-brand-medium text-[15px]">
                Retry quiz
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
