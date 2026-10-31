import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MascotPlaceholder } from "@/components/ui";
import { useCourseData } from "@/hooks/courses/use-course-data";
import { Brands } from "@/lib/themes";

export function LessonView(): ReactElement {
  const data = useCourseData();
  const [bookmarked, setBookmarked] = useState(false);
  const [checked, setChecked] = useState(false);
  if (!data) return <Redirect href="/sign-in" />;

  const { lesson } = data;
  const { course } = data.detail;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-surface border-b-progressTrack border-b-[1px]">
        <View className="min-h-[61px] flex-row items-center px-[9px] gap-[2px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to course"
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
          <View className="flex-1 min-w-0 gap-[2px]">
            <Text className="text-text font-brand-regular text-[16px]">
              {lesson.title}
            </Text>
            <Text className="text-textSecondary font-brand-mono text-[10px]">
              Lesson {lesson.number} of {course.totalLessons} · {course.code}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              bookmarked ? "Remove bookmark" : "Bookmark lesson"
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
        </View>
        <View className="h-[3px] bg-progressTrack">
          <View className="h-[3px] w-[34%] bg-primary" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-[22px] pb-7 gap-[15px]"
      >
        <View className="self-start h-[26px] rounded-[14px] px-[10px] bg-courseMint flex-row items-center gap-[5px]">
          <SymbolView
            name={{ ios: "clock", android: "schedule", web: "schedule" }}
            size={13}
            tintColor={Brands.colors.primary}
          />
          <Text className="text-successLabel font-brand-medium text-[11px]">
            {lesson.readMinutes} min read
          </Text>
        </View>
        <Text className="text-text font-brand-medium text-[22px] tracking-[-0.5px] mt-[5px]">
          {lesson.heading}
        </Text>
        <Text className="text-textSupporting font-brand-light text-[15px] leading-[22px]">
          {lesson.introduction}
        </Text>

        <View className="bg-darkGreen rounded-[20px] px-4 pt-[15px] pb-[18px] gap-[13px]">
          <View className="flex-row gap-[5px]">
            <View className="w-2 h-2 rounded-[4px] bg-error" />
            <View className="w-2 h-2 rounded-[4px] bg-homeOrange" />
            <View className="w-2 h-2 rounded-[4px] bg-lessonAccent" />
          </View>
          <Text className="text-codeText font-brand-mono text-[12px] leading-[22px]">
            {lesson.code}
          </Text>
        </View>

        <Text className="text-text font-brand-medium text-[18px] tracking-[-0.3px] mt-[2px]">
          {lesson.sectionHeading}
        </Text>
        <Text className="text-textSupporting font-brand-light text-[15px] leading-[22px]">
          {lesson.sectionBody}
        </Text>

        <View className="bg-grow border-tipBorder border-[1px] rounded-[19px] p-[14px] flex-row items-start gap-3">
          <MascotPlaceholder
            title="BYTEY"
            description="tip"
            width={47}
            height={50}
            compact
          />
          <View className="flex-1 gap-[5px]">
            <Text className="text-tipTitle font-brand-regular text-[13px]">
              Bytey&apos;s tip
            </Text>
            <Text className="text-tipText font-brand-light text-[13px] leading-[19px]">
              {lesson.tip}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="bg-surface border-t-progressTrack border-t-[1px] px-5 pt-3 pb-2 flex-row gap-[10px]">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel="Mark lesson read"
          accessibilityState={{ checked }}
          onPress={() => setChecked(!checked)}
          className={`w-12 h-12 rounded-[15px] border-[1px] items-center justify-center ${checked ? "border-primary bg-primary" : "border-fieldBorder"}`}
        >
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={20}
            tintColor={checked ? Brands.colors.surface : Brands.colors.primary}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Practice problems"
          onPress={() => router.push("/problems")}
          className="flex-1 min-h-12 rounded-[15px] bg-primary flex-row items-center justify-center gap-2"
        >
          <Text className="text-surface font-brand-regular text-[15px]">
            Practice problems
          </Text>
          <SymbolView
            name={{
              ios: "arrow.right",
              android: "arrow_forward",
              web: "arrow_forward",
            }}
            size={18}
            tintColor={Brands.colors.surface}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
