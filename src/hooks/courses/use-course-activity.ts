import type { CourseProgress, PublishedCourse } from "@/domain/courses";
import type { LearningRequestResult } from "@/domain/learning";
import { useLearningRequest } from "@/hooks/learning";
import { courseRepository } from "@/lib/courses";

export type CourseActivity = {
  progressByCourseId: ReadonlyMap<string, CourseProgress>;
  hasUnavailableProgress: boolean;
};

async function loadCourseActivity(
  token: string,
  courses: readonly PublishedCourse[],
): Promise<CourseActivity> {
  const results = await Promise.allSettled(
    courses.map((course) => courseRepository.getProgress(token, course.id)),
  );
  const progressByCourseId = new Map<string, CourseProgress>();
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      progressByCourseId.set(result.value.courseId, result.value);
    }
  });
  return {
    progressByCourseId,
    hasUnavailableProgress: results.some((result) => result.status === "rejected"),
  };
}

export function useCourseActivity(
  courses: readonly PublishedCourse[],
  enabled = true,
): LearningRequestResult<CourseActivity> {
  const courseIds = courses.map(({ id }) => id).join(",");
  const key = enabled && courseIds ? `course-activity:${courseIds}` : undefined;
  return useLearningRequest(key, (token) => loadCourseActivity(token, courses));
}
