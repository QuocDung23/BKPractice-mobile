import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { CourseChapter } from "@/domain/courses";
import type { ProblemFilter } from "@/domain/problems";
import { Brands } from "@/lib/themes";
import { ACTIVITY_TABS } from "./constant";

export type ChapterActivityTab = "problems" | "quizzes";

type ChapterDetailHeaderProps = {
  chapter: CourseChapter;
  courseTitle: string;
  activeTab: ChapterActivityTab;
  difficultyFilter: ProblemFilter;
  isDifficultyFilterOpen: boolean;
  onTabChange: (tab: ChapterActivityTab) => void;
  onToggleDifficultyFilter: () => void;
  onBack: () => void;
};

export function ChapterDetailHeader({
  chapter,
  courseTitle,
  activeTab,
  difficultyFilter,
  isDifficultyFilterOpen,
  onTabChange,
  onToggleDifficultyFilter,
  onBack,
}: ChapterDetailHeaderProps): ReactElement {
  return (
    <View className="gap-3 bg-background px-5 pt-1 pb-4">
      <View className="min-h-11 flex-row items-center gap-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back to course chapters"
          onPress={onBack}
          className="min-h-11 min-w-6 justify-center"
        >
          <SymbolView
            name={{
              ios: "chevron.left",
              android: "arrow_back",
              web: "arrow_back",
            }}
            size={19}
            tintColor={Brands.colors.primary}
          />
        </Pressable>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          className="min-w-0 flex-1 text-text font-brand-regular text-[23px]"
        >
          {chapter.title}
        </Text>
      </View>

      <View className="gap-1">
        {chapter.description ? (
          <Text
            numberOfLines={2}
            className="text-textSecondary font-brand-medium text-[12px] leading-[17px]"
          >
            {chapter.description}
          </Text>
        ) : null}
      </View>

      <View className="gap-3 rounded-[22px] border border-border bg-background p-4">
        <Text className="text-text font-brand-medium text-[14px]">
          Chapter contents
        </Text>
        <View className="flex-row gap-2">
          <View className="flex-1 flex-row items-center gap-2">
            <SymbolView
              name={{
                ios: "chevron.left.forwardslash.chevron.right",
                android: "code",
                web: "code",
              }}
              size={15}
              tintColor={Brands.colors.primary}
            />
            <Text className="text-textSecondary font-brand-monoMedium text-[10px]">
              {chapter.problems.length}{" "}
              {chapter.problems.length === 1 ? "problem" : "problems"}
            </Text>
          </View>
          <View className="flex-1 flex-row items-center gap-2">
            <SymbolView
              name={{ ios: "checkmark.circle", android: "quiz", web: "quiz" }}
              size={15}
              tintColor={Brands.colors.primary}
            />
            <Text className="text-textSecondary font-brand-monoMedium text-[10px]">
              {chapter.quizzes.length}{" "}
              {chapter.quizzes.length === 1 ? "quiz" : "quizzes"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-row items-center gap-2">
          {ACTIVITY_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => onTabChange(tab.id)}
                className={`min-h-10 items-center justify-center rounded-2xl border px-[14px] ${
                  selected
                    ? "border-primary bg-primary"
                    : "border-border bg-resultRowBackground"
                }`}
              >
                <Text
                  className={`font-brand-medium text-[11px] ${
                    selected ? "text-surface" : "text-textSecondary"
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {activeTab === "problems" ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filter problems by difficulty"
            accessibilityHint={`Current difficulty: ${difficultyFilter}`}
            accessibilityState={{
              selected: isDifficultyFilterOpen || difficultyFilter !== "All",
              expanded: isDifficultyFilterOpen,
            }}
            onPress={onToggleDifficultyFilter}
            className={`h-10 w-10 items-center justify-center rounded-2xl border ${
              isDifficultyFilterOpen || difficultyFilter !== "All"
                ? "border-primary bg-primary"
                : "border-border bg-resultRowBackground"
            }`}
          >
            <SymbolView
              name={{
                ios: "slider.horizontal.3",
                android: "tune",
                web: "tune",
              }}
              size={18}
              tintColor={
                isDifficultyFilterOpen || difficultyFilter !== "All"
                  ? Brands.colors.surface
                  : Brands.colors.primary
              }
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
