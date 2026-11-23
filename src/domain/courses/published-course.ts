import type { LearningPage } from "@/domain/learning";

export type PublishedCourse = {
  id: string;
  slug: string;
  title: string;
  chapterCount: number;
};

export type PublishedCourseDetail = Omit<PublishedCourse, "chapterCount"> & {
  description: string | null;
};

export type CourseProgress = {
  courseId: string;
  completed: number;
  total: number;
  completedItems: {
    type: "PROBLEM" | "QUIZ";
    itemId: string;
    completedAt: string;
  }[];
};

export type CourseActivityStatus = "In Progress" | "Completed" | "Not Started";

export type CourseWithProgress = {
  course: PublishedCourse;
  progress: CourseProgress | null;
};

export type CourseRepository = {
  list(token: string, page: number, query: string): Promise<LearningPage<PublishedCourse>>;
  get(token: string, id: string): Promise<PublishedCourseDetail>;
  getProgress(token: string, id: string): Promise<CourseProgress>;
};

export function getCourseActivityStatus(
  progress: CourseProgress | null,
): CourseActivityStatus | null {
  if (!progress) return null;
  if (progress.completed > 0 && progress.completed < progress.total) return "In Progress";
  if (progress.completed > 0) return "Completed";
  return "Not Started";
}

function getLatestActivity(progress: CourseProgress): number {
  return progress.completedItems.reduce(
    (latest, item) => Math.max(latest, Date.parse(item.completedAt)),
    0,
  );
}

function getCoursePriority(item: CourseWithProgress): number {
  const status = getCourseActivityStatus(item.progress);
  if (status === "In Progress") return 0;
  if (status === "Completed") return 1;
  if (status === "Not Started") return 2;
  return 3;
}

export function prioritizeCourses(
  courses: readonly PublishedCourse[],
  progressByCourseId: ReadonlyMap<string, CourseProgress>,
): CourseWithProgress[] {
  return courses
    .map((course, originalOrder) => ({
      course,
      progress: progressByCourseId.get(course.id) ?? null,
      originalOrder,
    }))
    .sort((first, second) => {
      const priorityDifference = getCoursePriority(first) - getCoursePriority(second);
      if (priorityDifference !== 0) return priorityDifference;

      if (getCoursePriority(first) === 1 && first.progress && second.progress) {
        const firstActivity = getLatestActivity(first.progress);
        const secondActivity = getLatestActivity(second.progress);
        if (firstActivity !== secondActivity) return secondActivity - firstActivity;
      }

      return first.originalOrder - second.originalOrder;
    })
    .map(({ course, progress }) => ({ course, progress }));
}
