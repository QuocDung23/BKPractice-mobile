import type { ProblemFilter } from "@/domain/problems";

import type { ChapterActivityTab } from "./chapter-detail-header";

export const DIFFICULTY_FILTERS: readonly ProblemFilter[] = [
  "All",
  "Easy",
  "Medium",
  "Hard",
];

export const ACTIVITY_TABS: readonly {
  id: ChapterActivityTab;
  label: string;
}[] = [
  { id: "problems", label: "Problems" },
  { id: "quizzes", label: "Quizzes" },
];
