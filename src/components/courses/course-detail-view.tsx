import type { ReactElement } from "react";
import { Text } from "react-native";

import { LearningStatus } from "@/components/ui";
import { usePublishedCourse } from "@/hooks/courses";

import { CourseDetailLayout } from "./course-detail-layout";

type CourseDetailViewProps = { id: string };

export function CourseDetailView({ id }: CourseDetailViewProps): ReactElement {
  const courseRequest = usePublishedCourse(id);
  const course = courseRequest.state.status === "success" ? courseRequest.state.data : null;

  return (
    <CourseDetailLayout title={course?.title ?? "Course"} backTo="/courses">
      {course ? (
        course.description ? (
          <Text className="text-textSecondary font-brand-regular">{course.description}</Text>
        ) : null
      ) : <LearningStatus {...courseRequest} empty="Course is unavailable." centered />}
    </CourseDetailLayout>
  );
}
