export type HomeData = {
  student: {
    id: string;
    name: string;
    initials: string;
    greetingName: string;
  };
  home: {
    streakDays: number;
    completedWeekdays: readonly number[];
    weeklyProgress: {
      percent: number;
      problems: number;
      quizzes: number;
      focusHours: number;
    };
    course: {
      code: string;
      title: string;
      currentLesson: number;
      totalLessons: number;
      nextLesson: string;
    };
    assignment: {
      title: string;
      acceptedProblems: number;
      totalProblems: number;
      dueInDays: number;
    };
    quiz: {
      title: string;
      questions: number;
      minutes: number;
      basedOnLesson: number;
    };
    achievement: {
      title: string;
      problemsSolved: number;
    };
    unreadNotifications: number;
  };
};
