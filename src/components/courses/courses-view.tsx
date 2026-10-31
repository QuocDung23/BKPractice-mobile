import { Redirect } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import type { CourseFilter } from "@/domain/courses";
import { useFilteredCourses } from "@/hooks/courses/use-course-data";
import { Brands } from "@/lib/themes";

import { CourseCard } from "./course-card";

const FILTERS: readonly CourseFilter[] = ["All", "In Progress", "Completed"];

export function CoursesView(): ReactElement {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CourseFilter>("All");
  const result = useFilteredCourses(query, filter);
  if (!result) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-5 pt-2 pb-[18px] gap-[13px] bg-surface border-b-[1px] border-b-progressTrack">
        <View className="flex-row items-center justify-between min-h-10">
          <Text className="text-text font-brand-regular text-[23px] tracking-[-0.5px]">
            Courses
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change course filter"
            onPress={() =>
              setFilter(FILTERS[(FILTERS.indexOf(filter) + 1) % FILTERS.length])
            }
            className="w-11 h-11 items-center justify-center"
          >
            <SymbolView
              name={{
                ios: "slider.horizontal.3",
                android: "tune",
                web: "tune",
              }}
              size={21}
              tintColor={Brands.colors.text}
            />
          </Pressable>
        </View>
        <View className="h-12 rounded-[25px] bg-resultRowBackground border-[1px] border-border flex-row items-center gap-[9px] px-[15px]">
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={19}
            tintColor={Brands.colors.textMuted}
          />
          <TextInput
            accessibilityLabel="Search courses"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setQuery}
            placeholder="Search courses or problems"
            placeholderTextColor={Brands.colors.textMuted}
            returnKeyType="search"
            className="flex-1 text-text font-brand-light text-[14px] py-0"
            value={query}
          />
        </View>
        <View className="flex-row items-center gap-2">
          {FILTERS.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === item }}
              onPress={() => setFilter(item)}
              className={`min-h-11 px-[14px] rounded-[22px] border-[1px] items-center justify-center ${filter === item ? "bg-primary border-primary" : "bg-resultRowBackground border-border"}`}
            >
              <Text
                className={`font-brand-regular text-[12px] ${filter === item ? "text-surface" : "text-textSecondary"}`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-[18px] pb-7 gap-3"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text className="text-textSecondary font-brand-light text-[12px] mb-[1px]">
          {result.total} courses enrolled
        </Text>
        {result.courses.length ? (
          result.courses.map((course) => (
            <CourseCard key={course.code} course={course} />
          ))
        ) : (
          <View className="items-center py-10 rounded-[24px] border-[1px] border-border bg-surface gap-[5px]">
            <Text className="text-text font-brand-medium text-[15px]">
              No matching courses
            </Text>
            <Text className="text-textSecondary font-brand-light text-[13px]">
              Try another search or filter.
            </Text>
          </View>
        )}
      </ScrollView>
      <BottomNavigation active="Courses" />
    </SafeAreaView>
  );
}
