import type { ReactElement } from "react";
import { Text, View } from "react-native";

import type { CourseChapter } from "@/domain/courses";

type ChapterCardProps = {
  chapter: CourseChapter;
};

export function ChapterCard({ chapter }: ChapterCardProps): ReactElement {
  return (
    <View className="gap-1 rounded-[22px] border border-border bg-surface p-4">
      <Text className="text-text font-brand-medium text-[16px] leading-[21px]">
        {chapter.title}
      </Text>
      {chapter.description ? (
        <Text className="text-textSecondary font-brand-regular text-[12px] leading-[17px]">
          {chapter.description}
        </Text>
      ) : null}
    </View>
  );
}
