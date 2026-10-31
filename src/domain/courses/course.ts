export type CourseStatus = 'In Progress' | 'Completed' | 'Not Started';
export type CourseFilter = 'All' | 'In Progress' | 'Completed';

export type CourseSummary = {
  code: string;
  title: string;
  completedLessons: number;
  totalLessons: number;
  subject: string;
  status: CourseStatus;
  progressPercent: number;
  starts?: string;
};

export type LessonSummary = {
  number: number;
  title: string;
  status: 'Completed' | 'In Progress' | 'Locked';
  detail: string;
};

export type CourseDetail = {
  course: CourseSummary;
  term: string;
  instructor: string;
  schedule: string;
  solvedProblems: number;
  totalProblems: number;
  lessons: readonly LessonSummary[];
};

export type LessonContent = {
  number: number;
  title: string;
  readMinutes: number;
  heading: string;
  introduction: string;
  code: string;
  sectionHeading: string;
  sectionBody: string;
  tip: string;
};

export type CourseData = {
  courses: readonly CourseSummary[];
  detail: CourseDetail;
  lesson: LessonContent;
};

export function filterCourses(
  courses: readonly CourseSummary[],
  query: string,
  filter: CourseFilter,
): CourseSummary[] {
  const search = query.trim().toLocaleLowerCase();
  return courses.filter((course) =>
    (filter === 'All' || course.status === filter) &&
    (course.code.toLocaleLowerCase().includes(search) || course.title.toLocaleLowerCase().includes(search)),
  );
}
