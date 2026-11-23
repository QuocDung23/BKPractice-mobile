import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import {
  getCourseActivityStatus,
  type CourseProgress,
  type PublishedCourse,
} from "@/domain/courses";
import { COURSE_VISUALS } from "./constant";

type CourseCardProps = {
  course: PublishedCourse;
  progress?: CourseProgress | null;
};

export function CourseCard({
  course,
  progress,
}: CourseCardProps): ReactElement {
  const visualIndex =
    Array.from(course.id).reduce(
      (hash, character) =>
        (hash * 31 + character.charCodeAt(0)) % 2_147_483_647,
      0,
    ) % COURSE_VISUALS.length;
  const visual = COURSE_VISUALS[visualIndex];
  const chapterLabel = course.chapterCount === 1 ? "chapter" : "chapters";
  const status = getCourseActivityStatus(progress ?? null);
  const progressPercent =
    progress && progress.total > 0
      ? Math.floor((progress.completed / progress.total) * 100)
      : null;
  const statusBackground =
    status === "Completed"
      ? "bg-successBackground"
      : status === "In Progress"
        ? "bg-courseMint"
        : "bg-resultRowBackground";
  const statusText =
    status === "Completed"
      ? "text-success"
      : status === "In Progress"
        ? "text-successLabel"
        : "text-textSecondary";
  const progressLabel =
    progressPercent !== null
      ? `${progressPercent}% complete`
      : progress === undefined
        ? "Loading progress"
        : progress === null
          ? "Progress unavailable"
          : "No tracked activity";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${course.title}, ${course.chapterCount} ${chapterLabel}, ${progressLabel}`}
      onPress={() =>
        router.push({ pathname: "/course-detail", params: { id: course.id } })
      }
      className="gap-[13px] rounded-[40px] border border-border bg-surface px-4 py-6 active:opacity-[0.82]"
    >
      <View className="flex-row items-start gap-3">
        <View
          className="h-12 w-12 shrink-0 items-center justify-center rounded-[17px]"
          style={{ backgroundColor: visual.background }}
        >
          <SymbolView name={visual.symbol} size={23} tintColor={visual.tint} />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <View className="min-h-[22px] flex-row items-center">
            {progress === undefined ? (
              <View className="h-5 w-[76px] rounded-[8px] bg-progressTrack" />
            ) : (
              <View
                className={`rounded-[8px] px-[8px] py-[4px] ${statusBackground}`}
              >
                <Text className={`font-brand-medium text-[10px] ${statusText}`}>
                  {status ?? "Unavailable"}
                </Text>
              </View>
            )}
          </View>
          <Text
            numberOfLines={2}
            className="text-text font-brand-medium text-[16px] leading-[21px]"
          >
            {course.title}
          </Text>
          <Text className="text-textSecondary font-brand-light text-[13px]">
            {course.chapterCount} {chapterLabel}
          </Text>
        </View>
      </View>
      {progressPercent !== null ? (
        <View className="flex-row items-center gap-[10px]">
          <View className="h-[5px] flex-1 overflow-hidden rounded-full bg-progressTrack">
            <View
              className={`h-full rounded-full ${status === "Completed" ? "bg-success" : "bg-primary"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="text-textSecondary font-brand-monoMedium text-[11px]">
            {progressPercent}%
          </Text>
        </View>
      ) : (
        <Text className="text-textMuted font-brand-light text-[11px]">
          {progressLabel}
        </Text>
      )}
    </Pressable>
  );
}
