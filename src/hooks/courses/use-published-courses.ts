import type { PublishedCourse, PublishedCourseDetail } from "@/domain/courses";
import type { LearningPage, LearningRequestResult } from "@/domain/learning";
import { useLearningRequest } from "@/hooks/learning";
import { courseRepository } from "@/lib/courses";

export function usePublishedCourses(page: number, query: string): LearningRequestResult<LearningPage<PublishedCourse>> {
  return useLearningRequest(`courses:${page}:${query}`, (token) => courseRepository.list(token, page, query));
}

export function usePublishedCourse(id: string): LearningRequestResult<PublishedCourseDetail> {
  return useLearningRequest(id, (token) => courseRepository.get(token, id));
}

