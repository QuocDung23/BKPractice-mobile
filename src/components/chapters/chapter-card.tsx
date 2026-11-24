import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { CourseChapter } from "@/domain/courses";
import { Brands } from "@/lib/themes";

type ChapterCardProps = {
  chapter: CourseChapter;
  onPress: () => void;
};

export function ChapterCard({
  chapter,
  onPress,
}: ChapterCardProps): ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open chapter ${chapter.title}`}
      onPress={onPress}
      className="min-h-[76px] flex-row items-center justify-between gap-3 rounded-[22px] border border-border bg-surface p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.82 : 1 })}
    >
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-text font-brand-medium text-[16px] leading-[21px]">
          {chapter.title}
        </Text>
        {chapter.description ? (
          <Text
            numberOfLines={2}
            className="text-textSecondary font-brand-medium text-[12px] leading-[17px]"
          >
            {chapter.description}
          </Text>
        ) : null}
      </View>
      <SymbolView
        name={{
          ios: "chevron.right",
          android: "chevron_right",
          web: "chevron_right",
        }}
        size={16}
        tintColor={Brands.colors.textMuted}
      />
    </Pressable>
  );
}
