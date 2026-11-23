import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import {
  FeedbackBanner,
  LearningPagination,
  LearningStatus,
} from "@/components/ui";
import { getCourseActivityStatus } from "@/domain/courses";
import { useCourseActivity, usePublishedCourses } from "@/hooks/courses";
import { Brands } from "@/lib/themes";

import { COURSE_FILTERS } from "./constant";
import { CourseCard } from "./course-card";

type CourseFilter = (typeof COURSE_FILTERS)[number];

export function CoursesView(): ReactElement {
  const [search, setSearch] = useState({ page: 1, query: "" });
  const [activeFilter, setActiveFilter] = useState<CourseFilter>("All");
  const { state, retry } = usePublishedCourses(
    search.page,
    search.query.trim(),
  );
  const courseItems = state.status === "success" ? state.data.items : [];
  const activityRequest = useCourseActivity(
    courseItems,
    courseItems.length > 0,
  );
  const activity =
    activityRequest.state.status === "success"
      ? activityRequest.state.data
      : null;
  const visibleCourses =
    activeFilter === "All"
      ? courseItems
      : courseItems.filter((course) => {
          return (
            getCourseActivityStatus(
              activity?.progressByCourseId.get(course.id) ?? null,
            ) === activeFilter
          );
        });

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="border-b border-progressTrack bg-surface px-5 pb-4 gap-3">
        <Text
          accessibilityRole="header"
          className="text-darkGreen font-brand-regular text-[23px]"
        >
          Courses
        </Text>
        <View className="h-[50px] flex-row items-center gap-2 rounded-full border border-border bg-resultRowBackground px-4">
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={19}
            tintColor={Brands.colors.textMuted}
          />
          <TextInput
            accessibilityLabel="Search courses"
            maxLength={200}
            autoCapitalize="none"
            onChangeText={(query) => setSearch({ page: 1, query })}
            placeholder="Search courses"
            placeholderTextColor={Brands.colors.textMuted}
            returnKeyType="search"
            value={search.query}
            className="h-full min-w-0 flex-1 text-text font-brand-regular"
          />
        </View>
        <View className="flex-row items-center gap-2">
          {COURSE_FILTERS.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  setActiveFilter(filter);
                  setSearch((current) => ({ ...current, page: 1 }));
                }}
                className={`min-h-10 items-center justify-center rounded-2xl border px-[14px] ${selected ? "border-primary bg-primary" : "border-border bg-resultRowBackground"}`}
              >
                <Text
                  numberOfLines={1}
                  className={`font-brand-medium text-[11px] ${selected ? "text-surface" : "text-textSecondary"}`}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow px-5 py-4 gap-3"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        {state.status === "success" ? (
          <>

            {activeFilter !== "All" &&
            courseItems.length > 0 &&
            activityRequest.state.status !== "success" ? (
              <LearningStatus
                state={activityRequest.state}
                retry={activityRequest.retry}
                empty="Loading course activity."
                centered
              />
            ) : (
              <>
                {activity?.hasUnavailableProgress ||
                activityRequest.state.status === "error" ? (
                  <View className="gap-1">
                    <FeedbackBanner
                      tone="notice"
                      message="Some course activity could not be loaded, so progress and filtered results may be incomplete."
                    />
                    <Pressable
                      accessibilityRole="button"
                      onPress={activityRequest.retry}
                      hitSlop={8}
                      className="self-start min-h-11 justify-center px-3"
                    >
                      <Text className="text-primary font-brand-medium text-[13px]">
                        Retry course activity
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
                {visibleCourses.length ? (
                  visibleCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      progress={
                        activityRequest.state.status === "loading"
                          ? undefined
                          : (activity?.progressByCourseId.get(course.id) ??
                            null)
                      }
                    />
                  ))
                ) : (
                  <LearningStatus
                    state={state}
                    retry={retry}
                    empty={
                      activeFilter === "All"
                        ? "No matching courses."
                        : "No courses match this filter on this page."
                    }
                    centered
                  />
                )}
              </>
            )}
            <LearningPagination
              {...state.data}
              onPageChange={(page) =>
                setSearch((current) => ({ ...current, page }))
              }
            />
          </>
        ) : (
          <LearningStatus
            state={state}
            retry={retry}
            empty="Courses are unavailable."
            centered
          />
        )}
      </ScrollView>
      <BottomNavigation active="Courses" />
    </SafeAreaView>
  );
}
