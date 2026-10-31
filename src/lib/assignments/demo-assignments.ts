import type { AssignmentData } from '@/domain/assignments';
import { DEMO_COURSES } from '@/lib/courses';

const lab04 = {
  code: 'CO1003',
  label: 'LAB 04',
  title: 'Lab 04 — Linked List Operations',
  timing: 'Closes 17 Oct, 23:59',
  status: 'In Progress',
  group: 'DUE SOON',
  acceptedProblems: 3,
  totalProblems: 5,
  available: true,
} as const;

export const DEMO_ASSIGNMENT_DATA: AssignmentData = {
  dueSoonCount: 2,
  overdueCount: 1,
  completedCount: 5,
  assignments: [
    lab04,
    { code: 'CO2003', label: 'ASSIGNMENT 2', title: 'Assignment 2 — Sorting Analysis', timing: 'Closes 24 Oct, 23:59', status: 'Not Started', group: 'DUE SOON', acceptedProblems: 0, totalProblems: 4, available: false },
    { code: 'CO1007', label: 'WORKSHEET 3', title: 'Worksheet 3 — Set Proofs', timing: 'Closed 12 Oct · late submission open', status: 'Overdue', group: 'OVERDUE', acceptedProblems: 1, totalProblems: 4, available: false },
    { code: 'CO1003', label: 'LAB 03', title: 'Lab 03 — Recursion Drills', timing: 'Submitted 3 Oct · graded 10/10', status: 'Completed', group: 'COMPLETED', acceptedProblems: 5, totalProblems: 5, available: false },
  ],
  detail: {
    summary: lab04,
    courseTitle: DEMO_COURSES[0].title,
    dueInDays: 2,
    opens: '10 Oct',
    closes: '17 Oct, 23:59',
    instructions: {
      before: 'Implement a singly linked list supporting insert, delete, and reverse. All five problems must compile with ',
      compilerFlag: '-std=c++17',
      after: '. Submissions are checked for plagiarism.',
    },
    problems: [
      { title: 'Insert at head', difficulty: 'Easy', accepted: true },
      { title: 'Insert at position', difficulty: 'Easy', accepted: true },
      { title: 'Delete by value', difficulty: 'Medium', accepted: true },
      { title: 'Reverse in place', difficulty: 'Medium', accepted: false },
      { title: 'Detect a cycle', difficulty: 'Hard', accepted: false },
    ],
  },
};
