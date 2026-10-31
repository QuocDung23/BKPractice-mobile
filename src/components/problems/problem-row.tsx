import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { ProblemSummary } from "@/domain/problems";
import { Brands } from "@/lib/themes";

type ProblemRowProps = { problem: ProblemSummary };

export function ProblemRow({ problem }: ProblemRowProps): ReactElement {
  const available = problem.number === 7;
  const accepted = problem.state === "Accepted";
  const inProgress = problem.state === "In Progress";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${problem.number}. ${problem.title}, ${problem.difficulty}, ${problem.state}${available ? ", open problem" : ", preview only"}`}
      accessibilityState={{ disabled: !available }}
      disabled={!available}
      onPress={() => router.push("/problem-detail")}
      className="min-h-[77px] border-[1px] border-border rounded-[21px] bg-surface flex-row items-center gap-3 px-[14px] py-[10px]"
    >
      <View
        className={`w-[34px] h-[34px] rounded-[17px] items-center justify-center ${accepted ? "bg-successBackground" : inProgress ? "bg-warningBackground" : "bg-resultRowBackground"}`}
      >
        <SymbolView
          name={
            accepted
              ? {
                  ios: "checkmark.circle",
                  android: "check_circle",
                  web: "check_circle",
                }
              : inProgress
                ? {
                    ios: "clock.arrow.circlepath",
                    android: "pending",
                    web: "pending",
                  }
                : {
                    ios: "circle",
                    android: "radio_button_unchecked",
                    web: "radio_button_unchecked",
                  }
          }
          size={19}
          tintColor={
            accepted
              ? Brands.colors.success
              : inProgress
                ? Brands.colors.warningText
                : Brands.colors.lockedText
          }
        />
      </View>
      <View className="flex-1 min-w-0 gap-[7px]">
        <Text
          className="text-text font-brand-medium text-[15px]"
          numberOfLines={1}
        >
          {problem.number}. {problem.title}
        </Text>
        <View className="flex-row items-center gap-[7px]">
          <View
            className={`px-[7px] py-[3px] rounded-[8px] ${problem.difficulty === "Easy" ? "bg-successBackground" : problem.difficulty === "Medium" ? "bg-warningBackground" : "bg-hardBackground"}`}
          >
            <Text
              className={`font-brand-medium text-[10px] ${problem.difficulty === "Easy" ? "text-success" : problem.difficulty === "Medium" ? "text-warningText" : "text-hardText"}`}
            >
              {problem.difficulty}
            </Text>
          </View>
          <Text className="text-textMuted font-brand-mono text-[10px]">
            {problem.acceptancePercent}% acc.
          </Text>
          <Text
            className="text-textMuted font-brand-light text-[11px] shrink"
            numberOfLines={1}
          >
            {problem.topic}
          </Text>
        </View>
      </View>
      <SymbolView
        name={{
          ios: "chevron.right",
          android: "chevron_right",
          web: "chevron_right",
        }}
        size={18}
        tintColor={Brands.colors.textMuted}
      />
    </Pressable>
  );
}
