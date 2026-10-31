import { Image, type ImageSource } from "expo-image";
import { router } from "expo-router";
import type { ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { CourseSummary } from "@/domain/courses";
import { BrandColors, BrandFonts } from "@/lib/themes/theme";

type HomeCourseCardProps = {
  course: CourseSummary;
  illustration: ImageSource;
};

export function HomeCourseCard({
  course,
  illustration,
}: HomeCourseCardProps): ReactElement {
  const available = course.code === "CO1003";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${course.title}, ${course.totalLessons} lessons${available ? ", open course" : ", preview only"}`}
      accessibilityState={{ disabled: !available }}
      disabled={!available}
      onPress={() => router.push("/course-detail")}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.illustrationFrame}>
        <Image
          source={illustration}
          contentFit="contain"
          style={[
            styles.illustration,
            course.code === "CO1003" && styles.programmingIllustration,
          ]}
          accessible={false}
        />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {course.title}
      </Text>
      <Text style={styles.lessons}>{course.totalLessons} Lessons</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    height: 182,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 12,
    borderRadius: 20,
    backgroundColor: BrandColors.surface,
    justifyContent: "flex-end",
    shadowColor: BrandColors.text,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  pressed: { opacity: 0.84 },
  illustrationFrame: {
    width: "100%",
    height: 98,
    marginBottom: 8,
    overflow: "hidden",
  },
  illustration: { width: "100%", height: "100%" },
  programmingIllustration: {
    position: "absolute",
    width: "122%",
    height: "133%",
    left: "-11%",
    top: "-5%",
  },
  title: {
    color: BrandColors.text,
    fontFamily: BrandFonts.medium,
    fontSize: 14,
    lineHeight: 17,
    minHeight: 17,
  },
  lessons: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.regular,
    fontSize: 12,
    marginTop: 2,
  },
});
