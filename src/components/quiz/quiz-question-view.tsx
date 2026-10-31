import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { QuizAnswer } from "@/domain/quiz";
import { useQuizData } from "@/hooks/quiz";
import { Brands } from "@/lib/themes";

export function QuizQuestionView(): ReactElement {
  const [selectedAnswer, setSelectedAnswer] = useState<
    QuizAnswer["key"] | null
  >(null);
  const data = useQuizData();
  if (!data) return <Redirect href="/sign-in" />;

  const { question } = data;
  const closeQuiz = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace("/quizzes");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-surface border-b-[1px] border-b-progressTrack px-5 pt-[5px] pb-[15px]">
        <View className="min-h-[52px] flex-row items-center gap-[9px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close quiz"
            onPress={closeQuiz}
            className="w-[42px] h-[42px] items-center justify-center"
          >
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              size={22}
              tintColor={Brands.colors.text}
            />
          </Pressable>
          <Text
            className="flex-1 text-text font-brand-regular text-[15px]"
            numberOfLines={1}
          >
            {question.title}
          </Text>
          <View
            className="flex-row items-center gap-1 bg-warningBackground rounded-[16px] px-[9px] py-[7px]"
            accessibilityLabel={`${question.timer} remaining`}
          >
            <SymbolView
              name={{ ios: "timer", android: "timer", web: "timer" }}
              size={16}
              tintColor={Brands.colors.warningText}
            />
            <Text className="text-warningText font-brand-mono text-[12px]">
              {question.timer}
            </Text>
          </View>
        </View>
        <View
          className="flex-row gap-1 mt-[7px]"
          accessibilityLabel={`Question ${question.number} of ${question.total}`}
        >
          {Array.from({ length: question.total }, (_, index) => (
            <View
              key={index}
              className={`flex-1 h-[5px] rounded-[3px] ${index < question.number - 1 ? "bg-primary" : index === question.number - 1 ? "bg-signInAccent" : "bg-progressTrack"}`}
            />
          ))}
        </View>
        <Text className="text-textSecondary font-brand-mono text-[11px] mt-[9px]">
          Question {question.number} of {question.total}
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-[22px] pb-7"
      >
        <Text className="text-text font-brand-regular text-[17px] leading-[23px] mb-4">
          {question.prompt}
        </Text>
        <View className="bg-darkGreen rounded-[23px] p-[17px] mb-4">
          <Text className="text-codeText font-brand-mono text-[13px] leading-[26px]">
            {question.code}
          </Text>
        </View>
        <View className="gap-3" accessibilityRole="radiogroup">
          {question.answers.map((answer) => {
            const selected = selectedAnswer === answer.key;
            return (
              <Pressable
                key={answer.key}
                accessibilityRole="radio"
                accessibilityLabel={`${answer.key}, ${answer.text}`}
                accessibilityState={{ checked: selected }}
                onPress={() => setSelectedAnswer(answer.key)}
                className={`min-h-[59px] border-[1px] border-border rounded-[30px] px-[14px] flex-row items-center gap-3 ${selected ? "bg-courseMint" : "bg-surface"}`}
              >
                <View className="w-[29px] h-[29px] rounded-[15px] bg-resultRowBackground items-center justify-center">
                  <Text className="text-textSecondary font-brand-regular text-[12px]">
                    {answer.key}
                  </Text>
                </View>
                <Text className="text-text font-brand-mono text-[13px] flex-1">
                  {answer.text}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="bg-surface border-t-[1px] border-t-progressTrack px-5 py-3 flex-row items-center gap-3">
        <Text className="text-textSecondary font-brand-light text-[12px]">
          Pick one answer
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Submit answer"
          accessibilityState={{ disabled: selectedAnswer === null }}
          disabled={selectedAnswer === null}
          onPress={() => router.replace("/quiz-result")}
          className={`flex-1 min-h-12 rounded-[18px] items-center justify-center ${selectedAnswer === null ? "bg-border" : "bg-primary"}`}
        >
          <Text
            className={`font-brand-medium text-[15px] ${selectedAnswer === null ? "text-textMuted" : "text-surface"}`}
          >
            Submit answer
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
