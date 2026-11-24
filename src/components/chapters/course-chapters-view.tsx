import type { ReactElement } from "react";
import { Text, View } from "react-native";

import type { CourseChapter } from "@/domain/courses";

import { ChapterCard } from "./chapter-card";

type CourseChaptersViewProps = {
  chapters: readonly CourseChapter[];
  onSelectChapter: (chapterId: string) => void;
};

export function CourseChaptersView({
  chapters,
  onSelectChapter,
}: CourseChaptersViewProps): ReactElement {
  return (
    <View className="gap-3">
      {chapters.length ? (
        <View className="gap-3">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onPress={() => onSelectChapter(chapter.id)}
            />
          ))}
        </View>
      ) : (
        <Text className="py-6 text-center text-textSecondary font-brand-regular">
          No chapters are available for this course.
        </Text>
      )}
    </View>
  );
}
