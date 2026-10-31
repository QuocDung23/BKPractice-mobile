import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { LessonSummary } from "@/domain/courses";
import { Brands } from "@/lib/themes";

type LessonRowProps = { lesson: LessonSummary };

export function LessonRow({ lesson }: LessonRowProps): ReactElement {
  const active = lesson.status === "In Progress";
  const locked = lesson.status === "Locked";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Lesson ${lesson.number}, ${lesson.title}, ${lesson.status}${active ? ", resume" : ""}`}
      accessibilityState={{ disabled: !active }}
      disabled={!active}
      onPress={() => router.push("/lesson")}
      className={`min-h-[73px] border-[1px] rounded-[21px] flex-row items-center gap-3 px-[14px] py-[10px] ${locked ? "bg-lockedBackground" : "bg-surface"} ${active ? "border-primary" : "border-border"}`}
    >
      <View
        className={`w-[34px] h-[34px] rounded-[17px] items-center justify-center ${locked ? "bg-resultRowBackground" : active ? "bg-primary" : "bg-successBackground"}`}
      >
        <SymbolView
          name={
            locked
              ? { ios: "lock", android: "lock", web: "lock" }
              : active
                ? { ios: "play.fill", android: "play_arrow", web: "play_arrow" }
                : { ios: "checkmark", android: "check", web: "check" }
          }
          size={15}
          tintColor={
            active
              ? Brands.colors.surface
              : locked
                ? Brands.colors.lockedText
                : Brands.colors.primary
          }
        />
      </View>
      <View className="flex-1 min-w-0">
        <Text
          className={`font-brand-mono text-[10px] ${locked ? "text-lockedText" : "text-textMuted"}`}
        >
          LESSON {lesson.number}
        </Text>
        <Text
          className={`font-brand-regular text-[15px] leading-[19px] ${locked ? "text-lockedText" : "text-text"}`}
        >
          {lesson.title}
        </Text>
        <Text
          className={`font-brand-light text-[11px] ${locked ? "text-lockedText" : "text-textSecondary"}`}
        >
          {lesson.detail}
        </Text>
      </View>
      {active && (
        <Text className="text-primary font-brand-regular text-[12px]">
          Resume
        </Text>
      )}
    </Pressable>
  );
}
