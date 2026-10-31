import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { CourseSummary } from "@/domain/courses";
import { Brands } from "@/lib/themes";

type CourseCardProps = { course: CourseSummary };

const ICONS = {
  CO1003: {
    ios: "curlybraces",
    android: "code",
    background: Brands.colors.courseMint,
    color: Brands.colors.primary,
  },
  CO2003: {
    ios: "point.3.connected.trianglepath.dotted",
    android: "account_tree",
    background: Brands.colors.practice,
    color: Brands.colors.homeBlueText,
  },
  CO2005: {
    ios: "square.grid.2x2",
    android: "widgets",
    background: Brands.colors.grow,
    color: Brands.colors.growText,
  },
  CO1007: {
    ios: "function",
    android: "function",
    background: Brands.colors.homePink,
    color: Brands.colors.homePinkText,
  },
  CO2018: {
    ios: "desktopcomputer",
    android: "computer",
    background: Brands.colors.courseMint,
    color: Brands.colors.primary,
  },
} as const;

export function CourseCard({ course }: CourseCardProps): ReactElement {
  const icon = ICONS[course.code as keyof typeof ICONS] ?? ICONS.CO1003;
  const available = course.code === "CO1003";
  const complete = course.status === "Completed";
  const subtitle = course.starts
    ? `Starts ${course.starts} · ${course.subject}`
    : `${course.completedLessons} of ${course.totalLessons} lessons · ${course.subject}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.title}, ${course.status}, ${course.progressPercent}%${available ? ", open course" : ", preview only"}`}
      accessibilityState={{ disabled: !available }}
      disabled={!available}
      onPress={() => router.push("/course-detail")}
      className="bg-surface border-border border-[1px] rounded-[24px] p-4 gap-[14px]"
    >
      <View className="flex-row items-start gap-3">
        <View
          className="w-[46px] h-[46px] rounded-[17px] items-center justify-center"
          style={{ backgroundColor: icon.background }}
        >
          <SymbolView
            name={{ ios: icon.ios, android: icon.android, web: icon.android }}
            size={22}
            tintColor={icon.color}
          />
        </View>
        <View className="flex-1 gap-[3px]">
          <View className="flex-row items-center gap-2">
            <Text className="text-textSecondary font-brand-mono text-[11px]">
              {course.code}
            </Text>
            <View
              className={`rounded-[8px] px-[7px] py-[3px] ${complete ? "bg-successBackground" : course.status === "Not Started" ? "bg-resultRowBackground" : "bg-courseMint"}`}
            >
              <Text
                className={`font-brand-medium text-[10px] ${complete ? "text-success" : course.status === "Not Started" ? "text-textSecondary" : "text-successLabel"}`}
              >
                {course.status}
              </Text>
            </View>
          </View>
          <Text
            className="text-text font-brand-regular text-[16px] tracking-[-0.25px] leading-[21px]"
            numberOfLines={2}
          >
            {course.title}
          </Text>
          <Text className="text-textSecondary font-brand-light text-[12px]">
            {subtitle}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-[10px]">
        <View className="flex-1 h-[6px] bg-progressTrack rounded-[3px] overflow-hidden">
          <View
            className={`h-[6px] rounded-[3px] ${complete ? "bg-success" : "bg-primary"}`}
            style={{ width: `${course.progressPercent}%` }}
          />
        </View>
        <Text className="text-textSecondary font-brand-monoMedium text-[11px]">
          {course.progressPercent}%
        </Text>
      </View>
    </Pressable>
  );
}
