import { Image, type ImageSource } from "expo-image";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { PublishedCourse } from "@/domain/courses";
import { Brands } from "@/lib/themes";

type HomeCourseCardProps = {
  course: PublishedCourse;
  illustration: ImageSource;
  prominentIllustration: boolean;
};

const CourseIllustration = cssInterop(Image, { className: "style" });

export function HomeCourseCard({
  course,
  illustration,
  prominentIllustration,
}: HomeCourseCardProps): ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.title}, ${course.chapterCount} chapters, open course`}
      onPress={() => router.push({ pathname: "/course-detail", params: { id: course.id } })}
      className="w-[48%] h-[182px] px-3 pt-[9px] pb-3 rounded-[20px] bg-surface justify-end active:opacity-[0.84]"
      style={{
        shadowColor: Brands.colors.text,
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="w-[100%] h-[98px] mb-2 overflow-hidden">
        <CourseIllustration
          source={illustration}
          contentFit="contain"
          className={
            prominentIllustration
              ? "w-[122%] h-[133%] absolute left-[-11%] top-[-5%]"
              : "w-[100%] h-[100%]"
          }
          accessible={false}
        />
      </View>
      <Text
        className="text-text font-brand-medium text-[14px] leading-[17px] min-h-[17px]"
        numberOfLines={2}
      >
        {course.title}
      </Text>
      <Text className="text-textSecondary font-brand-regular text-[12px] mt-[2px]">
        {course.chapterCount} Chapters
      </Text>
    </Pressable>
  );
}
