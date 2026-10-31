import type { DemoSession } from '@/domain/auth/demo-session';
import { DEMO_ASSIGNMENT_DATA } from '@/lib/assignments';
import { DEMO_COURSES, DEMO_LESSON } from '@/lib/courses/demo-courses';

export function createDemoSession(): DemoSession {
  const course = DEMO_COURSES[0];
  return {
    student: {
      id: '123220145',
      name: 'Anh Nguyen',
      initials: 'AN',
      greetingName: 'A',
    },
    home: {
      streakDays: 7,
      completedWeekdays: [0, 1, 2, 3, 4],
      weeklyProgress: { percent: 68, problems: 12, quizzes: 3, focusHours: 4 },
      course: {
        code: course.code,
        title: course.title,
        currentLesson: course.completedLessons,
        totalLessons: course.totalLessons,
        nextLesson: DEMO_LESSON.title,
      },
      assignment: {
        title: DEMO_ASSIGNMENT_DATA.detail.summary.title,
        acceptedProblems: DEMO_ASSIGNMENT_DATA.detail.summary.acceptedProblems,
        totalProblems: DEMO_ASSIGNMENT_DATA.detail.summary.totalProblems,
        dueInDays: DEMO_ASSIGNMENT_DATA.detail.dueInDays,
      },
      quiz: { title: 'Pointers & Memory', questions: 10, minutes: 15, basedOnLesson: 12 },
      achievement: { title: 'Century Club', problemsSolved: 100 },
      unreadNotifications: 1,
    },
  };
}
