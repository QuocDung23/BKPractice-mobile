import { useFocusEffect } from "expo-router";
import { useCallback, useState, type ReactElement } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { CourseChapter } from "@/domain/courses";
import type { ProblemFilter } from "@/domain/problems";
import { useQuizProgress } from "@/hooks/quiz";

import { ChapterActivityList } from "./chapter-activity-list";
import {
  ChapterDetailHeader,
  type ChapterActivityTab,
} from "./chapter-detail-header";

type ChapterDetailViewProps = {
  chapter: CourseChapter;
  courseTitle: string;
  onBack: () => void;
};

export function ChapterDetailView({
  chapter,
  courseTitle,
  onBack,
}: ChapterDetailViewProps): ReactElement {
  const [activeTab, setActiveTab] = useState<ChapterActivityTab>("problems");
  const [difficultyFilter, setDifficultyFilter] =
    useState<ProblemFilter>("All");
  const [isDifficultyFilterOpen, setIsDifficultyFilterOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const quizProgress = useQuizProgress(
    chapter.quizzes.map((quiz) => quiz.id),
    activeTab === "quizzes",
  );
  const retryQuizProgress = quizProgress.retry;
  useFocusEffect(
    useCallback(() => {
      retryQuizProgress();
    }, [retryQuizProgress]),
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <View className="flex-1 bg-background">
        <ChapterDetailHeader
          chapter={chapter}
          courseTitle={courseTitle}
          activeTab={activeTab}
          difficultyFilter={difficultyFilter}
          isDifficultyFilterOpen={isDifficultyFilterOpen}
          onTabChange={setActiveTab}
          onToggleDifficultyFilter={() =>
            setIsDifficultyFilterOpen((open) => !open)
          }
          onBack={onBack}
        />
        <ScrollView
          className="flex-1 bg-background"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow gap-3 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <ChapterActivityList
            chapter={chapter}
            activeTab={activeTab}
            difficultyFilter={difficultyFilter}
            isDifficultyFilterOpen={isDifficultyFilterOpen}
            onDifficultyFilterChange={setDifficultyFilter}
            quizProgress={quizProgress}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
