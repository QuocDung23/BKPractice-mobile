import type {
  CourseChapter,
  CourseChapterProblem,
  CourseChapterQuiz,
  CourseProgress,
  CourseRepository,
  PublishedCourse,
  PublishedCourseDetail,
} from "@/domain/courses";
import {
  fetchLearning,
  readCount,
  readList,
  readObject,
  readOptionalText,
  readPage,
  readText,
} from "@/lib/learning";

function readCourseSummary(value: unknown): PublishedCourse {
  const item = readObject(value);
  return {
    id: readText(item.id),
    slug: readText(item.slug),
    title: readText(item.title),
    chapterCount: readCount(item.chapterCount),
  };
}

function readOptionalList<T>(
  value: unknown,
  decode: (item: unknown) => T,
): T[] {
  return value === undefined ? [] : readList(value, decode);
}

function readCourseChapterProblem(value: unknown): CourseChapterProblem {
  const item = readObject(value);
  return {
    id: readText(item.id),
    slug: readText(item.slug),
    title: readText(item.title),
    problemType: readText(item.problemType),
    difficulty: readText(item.difficulty),
  };
}

function readCourseChapterQuiz(value: unknown): CourseChapterQuiz {
  const item = readObject(value);
  return { id: readText(item.id), title: readText(item.title) };
}

function readCourseChapter(value: unknown): CourseChapter {
  const item = readObject(value);
  return {
    id: readText(item.id),
    title: readText(item.title),
    description: readOptionalText(item.description),
    problems: readOptionalList(item.problems, readCourseChapterProblem),
    quizzes: readOptionalList(item.quizzes, readCourseChapterQuiz),
  };
}

function readCourseDetail(value: unknown): PublishedCourseDetail {
  const item = readObject(value);
  return {
    id: readText(item.id),
    slug: readText(item.slug),
    title: readText(item.title),
    description: readOptionalText(item.description),
    chapters: readList(item.chapters, readCourseChapter),
  };
}

function readCourseProgress(value: unknown): CourseProgress {
  const progress = readObject(value);
  const completed = readCount(progress.completed);
  const total = readCount(progress.total);
  if (completed > total) throw new Error("Invalid course progress");
  const completedItems = readList(progress.completedItems, (value) => {
    const item = readObject(value);
    const type = readCompletedItemType(item.type);
    const completedAt = readText(item.completedAt);
    if (!Number.isFinite(Date.parse(completedAt)))
      throw new Error("Invalid activity date");
    return { type, itemId: readText(item.itemId), completedAt };
  });
  if (completedItems.length !== completed)
    throw new Error("Invalid completed item count");
  return {
    courseId: readText(progress.courseId),
    completed,
    total,
    completedItems,
  };
}

function readCompletedItemType(value: unknown): "PROBLEM" | "QUIZ" {
  if (value === "PROBLEM" || value === "QUIZ") return value;
  throw new Error("Invalid completed item type");
}

export const courseRepository: CourseRepository = {
  list(token, page, query) {
    return fetchLearning(
      token,
      {
        path: `/api/courses?page=${page}&pageSize=20&q=${encodeURIComponent(query)}`,
      },
      (data) => readPage(data, readCourseSummary, "pageSize"),
    );
  },
  get(token, id) {
    return fetchLearning(
      token,
      { path: `/api/courses/${encodeURIComponent(id)}` },
      readCourseDetail,
    );
  },
  getProgress(token, id) {
    return fetchLearning(
      token,
      { path: `/api/progress/me/courses/${encodeURIComponent(id)}` },
      (data) => {
        const progress = readCourseProgress(data);
        if (progress.courseId !== id)
          throw new Error("Progress belongs to a different course");
        return progress;
      },
    );
  },
};
