import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { ProblemList } from "@/components/problems";
import { QuizList } from "@/components/quiz";
import type { CourseChapter } from "@/domain/courses";
import type { ProblemFilter } from "@/domain/problems";

import type { ChapterActivityTab } from "./chapter-detail-header";
import { DIFFICULTY_FILTERS } from "./constant";

type ChapterActivityListProps = {
  chapter: CourseChapter;
  activeTab: ChapterActivityTab;
  difficultyFilter: ProblemFilter;
  isDifficultyFilterOpen: boolean;
  onDifficultyFilterChange: (filter: ProblemFilter) => void;
  completedQuizIds: ReadonlySet<string>;
};

export function ChapterActivityList({
  chapter,
  activeTab,
  difficultyFilter,
  isDifficultyFilterOpen,
  onDifficultyFilterChange,
  completedQuizIds,
}: ChapterActivityListProps): ReactElement {
  return (
    <View className="gap-3">
      {activeTab === "problems" && isDifficultyFilterOpen ? (
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-textSecondary font-brand-medium text-[10px]">
            Difficulty
          </Text>
          <View className="flex-row gap-1.5">
            {DIFFICULTY_FILTERS.map((filter) => {
              const selected = difficultyFilter === filter;
              return (
                <Pressable
                  key={filter}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onDifficultyFilterChange(filter)}
                  className={`min-h-9 items-center justify-center rounded-xl border px-2.5 ${
                    selected
                      ? "border-primary bg-primary"
                      : "border-border bg-surface"
                  }`}
                >
                  <Text
                    className={`font-brand-medium text-[9px] ${
                      selected ? "text-surface" : "text-textSecondary"
                    }`}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
      {activeTab === "problems" ? (
        <ProblemList
          problems={chapter.problems}
          difficultyFilter={difficultyFilter}
        />
      ) : (
        <QuizList
          quizzes={chapter.quizzes}
          completedQuizIds={completedQuizIds}
        />
      )}
    </View>
  );
}
