import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCourseData } from "@/hooks/courses/use-course-data";
import { Brands } from "@/lib/themes";

import { LessonRow } from "./lesson-row";

export function CourseDetailView(): ReactElement {
  const data = useCourseData();
  const [bookmarked, setBookmarked] = useState(false);
  if (!data) return <Redirect href="/sign-in" />;

  const {
    course,
    term,
    instructor,
    schedule,
    solvedProblems,
    totalProblems,
    lessons,
  } = data.detail;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerClassName="pb-7">
        <View className="bg-learn rounded-bl-[30px] rounded-br-[30px] px-5 pt-1 pb-[22px] gap-[18px]">
          <View className="flex-row items-center justify-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="w-11 h-11 items-center justify-center"
            >
              <SymbolView
                name={{
                  ios: "arrow.left",
                  android: "arrow_back",
                  web: "arrow_back",
                }}
                size={21}
                tintColor={Brands.colors.text}
              />
            </Pressable>
            <View className="flex-row items-center gap-1">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  bookmarked ? "Remove bookmark" : "Bookmark course"
                }
                onPress={() => setBookmarked(!bookmarked)}
                className="w-11 h-11 items-center justify-center"
              >
                <SymbolView
                  name={
                    bookmarked
                      ? {
                          ios: "bookmark.fill",
                          android: "bookmark",
                          web: "bookmark",
                        }
                      : {
                          ios: "bookmark",
                          android: "bookmark_border",
                          web: "bookmark_border",
                        }
                  }
                  size={21}
                  tintColor={Brands.colors.text}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="More options, coming soon"
                accessibilityState={{ disabled: true }}
                disabled
                className="w-11 h-11 items-center justify-center"
              >
                <SymbolView
                  name={{
                    ios: "ellipsis",
                    android: "more_horiz",
                    web: "more_horiz",
                  }}
                  size={22}
                  tintColor={Brands.colors.text}
                />
              </Pressable>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <View className="w-[52px] h-[52px] rounded-[19px] bg-primary items-center justify-center">
              <SymbolView
                name={{ ios: "curlybraces", android: "code", web: "code" }}
                size={26}
                tintColor={Brands.colors.surface}
              />
            </View>
            <View className="flex-1 min-w-0 gap-[2px]">
              <Text className="text-textSecondary font-brand-mono text-[11px]">
                {course.code} · {term}
              </Text>
              <Text className="text-text font-brand-regular text-[21px] tracking-[-0.5px] leading-[25px]">
                {course.title}
              </Text>
              <Text className="text-textSecondary font-brand-light text-[11px]">
                {instructor} · {schedule}
              </Text>
            </View>
          </View>

          <View className="bg-surface rounded-[21px] p-4 gap-[11px]">
            <View className="flex-row justify-between items-center">
              <Text className="text-text font-brand-regular text-[14px]">
                Course progress
              </Text>
              <Text className="text-primary font-brand-monoMedium text-[13px]">
                {course.progressPercent}%
              </Text>
            </View>
            <View className="h-[7px] rounded-[4px] bg-progressTrack overflow-hidden">
              <View
                className="h-[7px] rounded-[4px] bg-primary"
                style={{ width: `${course.progressPercent}%` }}
              />
            </View>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <SymbolView
                  name={{
                    ios: "book.closed",
                    android: "menu_book",
                    web: "menu_book",
                  }}
                  size={14}
                  tintColor={Brands.colors.primary}
                />
                <Text className="text-textSecondary font-brand-mono text-[10px]">
                  {course.completedLessons}/{course.totalLessons} lessons
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <SymbolView
                  name={{ ios: "curlybraces", android: "code", web: "code" }}
                  size={14}
                  tintColor={Brands.colors.primary}
                />
                <Text className="text-textSecondary font-brand-mono text-[10px]">
                  {solvedProblems}/{totalProblems} problems
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          className="h-[51px] flex-row items-stretch border-b-[1px] border-b-progressTrack px-5 gap-5"
          accessibilityRole="tablist"
        >
          <View
            className="justify-center px-[2px] border-b-[2px] border-b-primary"
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
          >
            <Text className="text-text font-brand-regular text-[13px]">
              Lessons
            </Text>
          </View>
          <Pressable
            className="justify-center px-[2px]"
            accessibilityRole="tab"
            accessibilityLabel="Open course problems"
            onPress={() => router.push("/problems")}
          >
            <Text className="text-textMuted font-brand-regular text-[13px]">
              Problems
            </Text>
          </Pressable>
          <Pressable
            className="justify-center px-[2px]"
            accessibilityRole="tab"
            accessibilityLabel="Open course assignments"
            onPress={() => router.push("/assignments")}
          >
            <Text className="text-textMuted font-brand-regular text-[13px]">
              Assignments
            </Text>
          </Pressable>
        </View>

        <View className="bg-background px-5 pt-[14px] pb-4 gap-[10px]">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.number} lesson={lesson} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
