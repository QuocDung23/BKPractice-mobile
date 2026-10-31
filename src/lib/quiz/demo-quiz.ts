import type { QuizData } from '@/domain/quiz';
import { DEMO_COURSES, DEMO_LESSON } from '@/lib/courses/demo-courses';

export const DEMO_QUIZ_DATA: QuizData = {
  xpTotal: 1240,
  assigned: [
    { title: DEMO_LESSON.title, courseTitle: DEMO_COURSES[0].title, questions: 10, minutes: 15, tone: 'mint', available: true },
    { title: 'Recursion Basics', courseTitle: DEMO_COURSES[0].title, questions: 8, minutes: 12, tone: 'blue', available: false },
  ],
  question: {
    title: DEMO_LESSON.title,
    number: 3,
    total: 10,
    timer: '08:24',
    prompt: 'What does this program print?',
    code: 'int x = 10;\nint *p = &x;\n*p = *p + 5;\nprintf("%d", x);',
    answers: [
      { key: 'A', text: '10' },
      { key: 'B', text: '5' },
      { key: 'C', text: '15' },
      { key: 'D', text: 'undefined behaviour' },
    ],
  },
  result: {
    percent: 80,
    correct: 8,
    incorrect: 2,
    time: '11m',
    gainedXp: 120,
    comparison: 'You beat your last attempt by 20 points.',
    review: [
      { number: 1, title: 'Which operator returns an address?', correct: true },
      { number: 2, title: 'Size of a pointer on a 64-bit system', correct: true },
      { number: 3, title: 'What does this program print?', correct: true },
      { number: 4, title: 'Result of dereferencing NULL', correct: false },
      { number: 5, title: 'Pointer arithmetic on int*', correct: false },
    ],
  },
};
