import { prioritizeCourses, type CourseWithProgress, type PublishedCourse } from "@/domain/courses";
import type { LearningPage, LearningRequestResult } from "@/domain/learning";

import { useCourseActivity } from "./use-course-activity";
import { usePublishedCourses } from "./use-published-courses";

export type PrioritizedCoursePage = Omit<LearningPage<PublishedCourse>, "items"> & {
  items: CourseWithProgress[];
  hasUnavailableProgress: boolean;
  isLoadingProgress: boolean;
};

export function usePrioritizedCourses(): LearningRequestResult<PrioritizedCoursePage> {
  const courseRequest = usePublishedCourses(1, "");
  const courses = courseRequest.state.status === "success" ? courseRequest.state.data : null;
  const courseItems = courses?.items ?? [];
  const activityRequest = useCourseActivity(courseItems, courseItems.length > 0);

  if (courseRequest.state.status !== "success") {
    return { state: courseRequest.state, retry: courseRequest.retry };
  }
  const coursePage = courseRequest.state.data;
  if (!coursePage.items.length) {
    return {
      state: {
        status: "success",
        data: { ...coursePage, items: [], hasUnavailableProgress: false, isLoadingProgress: false },
      },
      retry: courseRequest.retry,
    };
  }

  const activity = activityRequest.state.status === "success" ? activityRequest.state.data : null;
  return {
    state: {
      status: "success",
      data: {
        ...coursePage,
        items: prioritizeCourses(coursePage.items, activity?.progressByCourseId ?? new Map()),
        hasUnavailableProgress: activity?.hasUnavailableProgress ?? (activityRequest.state.status === "error"),
        isLoadingProgress: activityRequest.state.status === "loading",
      },
    },
    retry: activityRequest.retry,
  };
}
