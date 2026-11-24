import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { FeedbackBanner, LearningStatus } from "@/components/ui";
import type { PublishedCourseDetail } from "@/domain/courses";
import type { LearningRequestResult } from "@/domain/learning";
import type { CourseActivity } from "@/hooks/courses";
import { Brands } from "@/lib/themes";

type CourseDetailHeaderProps = {
  course: PublishedCourseDetail | null;
  progressRequest: LearningRequestResult<CourseActivity>;
};

export function CourseDetailHeader({
  course,
  progressRequest,
}: CourseDetailHeaderProps): ReactElement {
  const activity =
    progressRequest.state.status === "success"
      ? progressRequest.state.data
      : null;
  const progress = course
    ? activity?.progressByCourseId.get(course.id)
    : undefined;
  const progressPercent =
    progress && progress.total > 0
      ? Math.floor((progress.completed / progress.total) * 100)
      : null;
  return (
    <View className="gap-2 bg-background px-5 pt-1 pb-4 rounded-xl">
      <View className="min-h-11 flex-row items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/courses")
          }
          className="min-h-11 min-w-5 justify-center"
        >
          <Text className="text-primary text-[24px]">‹</Text>
        </Pressable>
        <Text
          accessibilityRole="header"
          className="min-w-0 flex-1 text-text font-brand-regular text-[24px]"
        >
          {course?.title ?? "Course"}
        </Text>
      </View>

      {course?.description ? (
        <Text
          numberOfLines={2}
          className="text-textSecondary font-brand-regular text-[12px] leading-[17px]"
        >
          {course.description}
        </Text>
      ) : null}

      {course ? (
        <>
          <View className="gap-3 rounded-[22px] border border-border bg-surface p-4">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="text-text font-brand-medium text-[14px]">
                Course progress
              </Text>
              {progressPercent !== null ? (
                <Text className="text-primary font-brand-mono text-[12px]">
                  {progressPercent}%
                </Text>
              ) : null}
            </View>

            {progressRequest.state.status === "error" ? (
              <LearningStatus
                state={progressRequest.state}
                retry={progressRequest.retry}
                empty="Course progress is unavailable."
              />
            ) : progressRequest.state.status === "loading" ? (
              <LearningStatus
                state={progressRequest.state}
                retry={progressRequest.retry}
                empty="Loading course progress."
              />
            ) : activity?.hasUnavailableProgress ? (
              <View className="gap-2">
                <FeedbackBanner
                  tone="notice"
                  message="Course progress is unavailable."
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={progressRequest.retry}
                  className="min-h-11 justify-center self-start px-2"
                >
                  <Text className="text-primary font-brand-medium text-[12px]">
                    Retry progress
                  </Text>
                </Pressable>
              </View>
            ) : progressPercent !== null && progress ? (
              <>
                <View className="h-[6px] overflow-hidden rounded-full bg-progressTrack">
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${progressPercent}%` }}
                  />
                </View>
                <Text className="text-textSecondary font-brand-mono text-[10px]">
                  {progress.completed}/{progress.total} activities completed
                </Text>
              </>
            ) : (
              <Text className="text-textSecondary font-brand-regular text-[12px]">
                No tracked activity.
              </Text>
            )}

            <View className="flex-row items-center gap-1.5 pt-1">
              <SymbolView
                name={{
                  ios: "books.vertical",
                  android: "menu_book",
                  web: "menu_book",
                }}
                size={14}
                tintColor={Brands.colors.primary}
              />
              <Text className="text-textSecondary font-brand-mono text-[9px]">
                {course.chapters.length}{" "}
                {course.chapters.length === 1 ? "chapter" : "chapters"}
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
}
