import type { CourseData, CourseFilter, CourseSummary } from '@/domain/courses';
import { filterCourses } from '@/domain/courses';
import { useHomeData } from '@/hooks/auth/use-home-data';
import { DEMO_COURSES, DEMO_COURSE_DETAIL, DEMO_LESSON } from '@/lib/courses/demo-courses';

export function useCourseData(): CourseData | null {
  const session = useHomeData();
  if (!session) return null;
  return { courses: DEMO_COURSES, detail: DEMO_COURSE_DETAIL, lesson: DEMO_LESSON };
}

export function useFilteredCourses(query: string, filter: CourseFilter): { courses: CourseSummary[]; total: number } | null {
  const data = useCourseData();
  return data ? { courses: filterCourses(data.courses, query, filter), total: data.courses.length } : null;
}
