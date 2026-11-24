import { useState, type ReactElement } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChapterDetailView, CourseChaptersView } from "@/components/chapters";
import { LearningStatus } from "@/components/ui";
import { useCourseActivity, usePublishedCourse } from "@/hooks/courses";

import { CourseDetailHeader } from "./course-detail-header";

type CourseDetailViewProps = { id: string };

export function CourseDetailView({ id }: CourseDetailViewProps): ReactElement {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null,
  );
  const courseRequest = usePublishedCourse(id);
  const course =
    courseRequest.state.status === "success" ? courseRequest.state.data : null;
  const activityCourses = course
    ? [
        {
          id: course.id,
          slug: course.slug,
          title: course.title,
          chapterCount: course.chapters.length,
        },
      ]
    : [];
  const progressRequest = useCourseActivity(
    activityCourses,
    activityCourses.length > 0,
  );
  const selectedChapter = course?.chapters.find(
    (chapter) => chapter.id === selectedChapterId,
  );

  if (course && selectedChapter) {
    return (
      <ChapterDetailView
        chapter={selectedChapter}
        courseTitle={course.title}
        onBack={() => setSelectedChapterId(null)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 gap-3 bg-background">
        <CourseDetailHeader course={course} progressRequest={progressRequest} />

        {course ? (
          <ScrollView
            className="flex-1 bg-background"
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="grow px-5 pt-3 pb-8 gap-3"
          >
            <CourseChaptersView
              chapters={course.chapters}
              onSelectChapter={setSelectedChapterId}
            />
          </ScrollView>
        ) : (
          <View className="flex-1 px-5">
            <LearningStatus
              {...courseRequest}
              empty="Course is unavailable."
              centered
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
