import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { CourseChapterProblem } from "@/domain/courses";
import type { ProblemFilter } from "@/domain/problems";
import { Brands } from "@/lib/themes";

type ProblemListProps = {
  problems: readonly CourseChapterProblem[];
  difficultyFilter: ProblemFilter;
};

export function ProblemList({
  problems,
  difficultyFilter,
}: ProblemListProps): ReactElement {
  const filteredProblems = problems.filter(
    (problem) =>
      difficultyFilter === "All" ||
      problem.difficulty.trim().toLowerCase() === difficultyFilter.toLowerCase(),
  );

  if (!filteredProblems.length) {
    return (
      <View className="items-center rounded-[22px] bg-resultRowBackground px-5 py-8">
        <Text className="text-center text-textSecondary font-brand-regular text-[13px]">
          {problems.length
            ? `No ${difficultyFilter.toLowerCase()} problems in this chapter.`
            : "No problems in this chapter yet."}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {filteredProblems.map((problem) => (
        <Pressable
          key={problem.id}
          accessibilityRole="button"
          accessibilityLabel={`${problem.title}, ${problem.problemType}, ${problem.difficulty}`}
          accessibilityHint="Open problem"
          onPress={() =>
            router.push({
              pathname: "/problem-detail",
              params: { idOrSlug: problem.id },
            })
          }
          className="min-h-[76px] flex-row items-center gap-3 rounded-[22px] border border-border bg-surface p-4"
        >
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-courseMint">
            <SymbolView
              name={{
                ios: "chevron.left.forwardslash.chevron.right",
                android: "code",
                web: "code",
              }}
              size={20}
              tintColor={Brands.colors.primary}
            />
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text
              numberOfLines={2}
              className="text-text font-brand-medium text-[15px] leading-[20px]"
            >
              {problem.title}
            </Text>
            <Text
              numberOfLines={1}
              className="text-textSecondary font-brand-monoMedium text-[9px] uppercase"
            >
              {problem.problemType} · {problem.difficulty}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
