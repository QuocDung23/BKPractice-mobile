import type { CourseDetail, CourseSummary, LessonContent } from '@/domain/courses';

export const DEMO_COURSES: readonly CourseSummary[] = [
  { code: 'CO1003', title: 'Programming Fundamentals', completedLessons: 13, totalLessons: 18, subject: 'C++', status: 'In Progress', progressPercent: 72 },
  { code: 'CO2003', title: 'Data Structures & Algorithms', completedLessons: 6, totalLessons: 22, subject: 'C++', status: 'In Progress', progressPercent: 27 },
  { code: 'CO2005', title: 'Object-Oriented Programming', completedLessons: 20, totalLessons: 20, subject: 'Java', status: 'Completed', progressPercent: 100 },
  { code: 'CO1007', title: 'Discrete Structures', completedLessons: 9, totalLessons: 16, subject: 'Theory', status: 'In Progress', progressPercent: 56 },
  { code: 'CO2018', title: 'Operating Systems', completedLessons: 0, totalLessons: 20, subject: 'C', status: 'Not Started', progressPercent: 0, starts: '21 Oct' },
];

export const DEMO_COURSE_DETAIL: CourseDetail = {
  course: DEMO_COURSES[0],
  term: 'Fall 2026',
  instructor: 'Dr. Le Thi Kim Oanh',
  schedule: 'Tue & Thu',
  solvedProblems: 24,
  totalProblems: 40,
  lessons: [
    { number: 11, title: 'Arrays and Loops', status: 'Completed', detail: 'Completed · 6 min' },
    { number: 12, title: 'Functions and Scope', status: 'Completed', detail: 'Completed · 9 min' },
    { number: 13, title: 'Pointers & Memory', status: 'In Progress', detail: 'In progress · 8 min left' },
    { number: 14, title: 'Dynamic Allocation', status: 'Locked', detail: 'Unlocks after Lesson 13' },
    { number: 15, title: 'Structs', status: 'Locked', detail: 'Unlocks after Lesson 14' },
  ],
};

export const DEMO_LESSON: LessonContent = {
  number: 13,
  title: 'Pointers & Memory',
  readMinutes: 8,
  heading: 'What a pointer holds',
  introduction: 'A pointer stores a memory address rather than a value. Declaring one with int *p tells the compiler that p points at an integer somewhere in memory.',
  code: 'int x = 42;\nint *p = &x;\n\nprintf("%d\\n", *p); // 42\nprintf("%p\\n", p);  // 0x7ffd...',
  sectionHeading: 'Dereferencing',
  sectionBody: "The * operator reads the value at the stored address. Writing through a pointer changes the original variable, which is how functions modify their caller's data.",
  tip: 'Always initialise a pointer before you dereference it. An uninitialised pointer is the most common cause of a segfault in Lab 04.',
};
