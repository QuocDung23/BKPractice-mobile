import type { ReactElement } from "react";
import { Text, View } from "react-native";

import type { CourseChapter } from "@/domain/courses";

import { ChapterCard } from "./chapter-card";

type CourseChaptersViewProps = {
  chapters: readonly CourseChapter[];
};

export function CourseChaptersView({ chapters }: CourseChaptersViewProps): ReactElement {
  return (
    <View className="gap-3">
      {chapters.length ? (
        <View className="gap-3">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
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
