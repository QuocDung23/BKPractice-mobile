import type { ProblemData, ProblemSummary } from '@/domain/problems';
import { DEMO_COURSE_DETAIL } from '@/lib/courses/demo-courses';

const problems: readonly ProblemSummary[] = [
  { number: 5, title: 'Two Sum', difficulty: 'Easy', acceptancePercent: 78, topic: 'hash map', state: 'Accepted' },
  { number: 6, title: 'Reverse an Array', difficulty: 'Easy', acceptancePercent: 84, topic: 'arrays', state: 'Accepted' },
  { number: 7, title: 'Balanced Brackets', difficulty: 'Medium', acceptancePercent: 64, topic: 'stack', state: 'Accepted' },
  { number: 8, title: 'Swap Without Temp', difficulty: 'Easy', acceptancePercent: 71, topic: 'pointers', state: 'Not Attempted' },
  { number: 9, title: 'Merge Intervals', difficulty: 'Medium', acceptancePercent: 52, topic: 'sorting', state: 'In Progress' },
  { number: 10, title: 'Matrix Spiral Order', difficulty: 'Hard', acceptancePercent: 31, topic: 'simulation', state: 'In Progress' },
  { number: 11, title: 'Longest Palindrome', difficulty: 'Hard', acceptancePercent: 28, topic: 'strings', state: 'Not Attempted' },
];

export const DEMO_PROBLEM_DATA: ProblemData = {
  courseCode: DEMO_COURSE_DETAIL.course.code,
  acceptedProblems: DEMO_COURSE_DETAIL.solvedProblems,
  totalProblems: DEMO_COURSE_DETAIL.totalProblems,
  problems,
  detail: {
    problem: problems[2],
    timeLimit: '1s',
    memoryLimit: '256MB',
    statement: 'Given a string containing only the characters ()[]{}, determine whether every bracket is closed by the same type in the correct order. Return true if the string is balanced.',
    examples: [
      { input: 's = "{[()]}"', output: 'true' },
      { input: 's = "([)]"', output: 'false' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of brackets only'],
  },
  result: {
    id: '1284',
    submittedAt: '15 Oct, 09:32',
    status: 'Accepted',
    language: 'C++17',
    runtime: '12ms',
    memory: '3.2MB',
    passedTests: 7,
    totalTests: 7,
    cases: [
      { label: 'case 1 "{[()]}"', runtime: '2ms', status: 'Passed' },
      { label: 'case 2 "([)]"', runtime: '1ms', status: 'Passed' },
      { label: 'case 3 ""', runtime: '1ms', status: 'Passed' },
      { label: 'case 4 10⁴ chars', runtime: '6ms', status: 'Passed' },
      { label: 'case 5 "((((((("', runtime: '2ms', status: 'Passed' },
    ],
    filename: 'solution.cpp',
    codePreview: "bool isBalanced(string s) {\n  stack<char> st;\n  for (char c : s) {\n    if (c=='('||c=='['||c=='{') st.push(c);",
  },
};
