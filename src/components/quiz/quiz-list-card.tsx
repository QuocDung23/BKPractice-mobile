import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { QuizSummary } from "@/domain/quiz";
import { Brands } from "@/lib/themes";

type QuizListCardProps = { quiz: QuizSummary };

export function QuizListCard({ quiz }: QuizListCardProps): ReactElement {
  const isMint = quiz.tone === "mint";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${quiz.title}, ${quiz.questions} questions, ${quiz.minutes} minutes${quiz.available ? "" : ", preview only"}`}
      accessibilityState={{ disabled: !quiz.available }}
      disabled={!quiz.available}
      onPress={() => router.push("/quiz-question")}
      className="min-h-[106px] rounded-[20px] border-[1px] border-border bg-surface p-[15px] flex-row items-start gap-3 active:opacity-[0.84]"
    >
      <View
        className={`w-11 h-11 rounded-[22px] items-center justify-center ${isMint ? "bg-courseMint" : "bg-practice"}`}
      >
        <SymbolView
          name={{
            ios: isMint ? "memorychip" : "repeat",
            android: isMint ? "memory" : "repeat",
            web: isMint ? "memory" : "repeat",
          }}
          size={22}
          tintColor={
            isMint ? Brands.colors.primary : Brands.colors.homeBlueText
          }
        />
      </View>
      <View className="flex-1 gap-[5px]">
        <Text className="text-text font-brand-regular text-[16px] tracking-[-0.2px]">
          {quiz.title}
        </Text>
        <Text className="text-textSecondary font-brand-light text-[12px]">
          {quiz.courseTitle}
        </Text>
        <View className="flex-row items-center gap-1 flex-wrap mt-[3px]">
          <SymbolView
            name={{
              ios: "questionmark.circle",
              android: "help_outline",
              web: "help_outline",
            }}
            size={13}
            tintColor={Brands.colors.textMuted}
          />
          <Text className="text-textSecondary font-brand-mono text-[11px] mr-2">
            {quiz.questions} Q
          </Text>
          <SymbolView
            name={{ ios: "timer", android: "timer", web: "timer" }}
            size={13}
            tintColor={Brands.colors.textMuted}
          />
          <Text className="text-textSecondary font-brand-mono text-[11px] mr-2">
            {quiz.minutes} min
          </Text>
          <View className="bg-courseMint rounded-[12px] px-2 py-1">
            <Text className="text-successLabel font-brand-medium text-[10px]">
              Assigned
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
