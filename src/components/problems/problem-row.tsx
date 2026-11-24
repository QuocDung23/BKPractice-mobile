import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { PublishedProblem } from "@/domain/problems";
import { Brands } from "@/lib/themes";

type ProblemRowProps = { problem: PublishedProblem };

export function ProblemRow({ problem }: ProblemRowProps): ReactElement {
  const accepted = problem.solved;
  const difficultyColor =
    problem.difficulty === "Easy"
      ? "text-success"
      : problem.difficulty === "Medium"
        ? "text-warningText"
        : "text-hardText";
  const difficultyBackground =
    problem.difficulty === "Easy"
      ? "bg-successBackground"
      : problem.difficulty === "Medium"
        ? "bg-warningBackground"
        : "bg-hardBackground";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${problem.title}, ${problem.difficulty}, ${accepted ? "Accepted" : "Not solved"}`}
      onPress={() =>
        router.push({
          pathname: "/problem-detail",
          params: { idOrSlug: problem.id },
        })
      }
      className="min-h-[77px] border-[1px] border-border rounded-[21px] bg-surface flex-row items-center gap-3 px-[14px] py-[10px]"
    >
      <View
        className={`w-[34px] h-[34px] rounded-[17px] items-center justify-center ${accepted ? "bg-successBackground" : "bg-resultRowBackground"}`}
      >
        <SymbolView
          name={
            accepted
              ? {
                  ios: "checkmark.circle",
                  android: "check_circle",
                  web: "check_circle",
                }
              : {
                  ios: "circle",
                  android: "radio_button_unchecked",
                  web: "radio_button_unchecked",
                }
          }
          size={19}
          tintColor={accepted ? Brands.colors.success : Brands.colors.lockedText}
        />
      </View>
      <View className="flex-1 min-w-0 gap-[7px]">
        <Text
          className="text-text font-brand-medium text-[15px]"
          numberOfLines={1}
        >
          {problem.title}
        </Text>
        <View className="flex-row items-center gap-[7px]">
          <View className={`px-[7px] py-[3px] rounded-[8px] ${difficultyBackground}`}>
            <Text className={`font-brand-medium text-[10px] ${difficultyColor}`}>
              {problem.difficulty}
            </Text>
          </View>
          {!accepted ? (
            <Text className="text-textMuted font-brand-mono text-[10px]">
              Not solved
            </Text>
          ) : null}
          {problem.topics.length ? (
            <Text
              className="text-textMuted font-brand-light text-[11px] shrink"
              numberOfLines={1}
            >
              {problem.topics.join(", ")}
            </Text>
          ) : null}
        </View>
      </View>
      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
        size={18}
        tintColor={Brands.colors.textMuted}
      />
    </Pressable>
  );
}
