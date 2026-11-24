import { AuthFailure } from "@/domain/auth";
import type {
  InProgressQuiz,
  PublishedQuiz,
  QuizAnswerFeedback,
  QuizAttempt,
  QuizAttemptData,
  QuizAttemptQuestion,
  QuizAttemptSummary,
  QuizOption,
  QuizProgress,
  QuizProgressAttempt,
  QuizRepository,
} from "@/domain/quiz";
import {
  fetchLearning,
  readBoolean,
  readCount,
  readList,
  readObject,
  readOptionalText,
  readPage,
  readText,
} from "@/lib/learning";

function readUuid(value: unknown): string {
  const id = readText(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Expected a quiz UUID");
  }
  return id.toLowerCase();
}

function readDate(value: unknown): string {
  const date = readText(value);
  if (!Number.isFinite(Date.parse(date))) throw new Error("Expected a quiz date");
  return date;
}

function readOption(value: unknown): QuizOption {
  const option = readObject(value);
  return { id: readUuid(option.id), content: readText(option.content) };
}

function readFeedback(value: unknown): QuizAnswerFeedback {
  const feedback = readObject(value);
  readDate(feedback.answeredAt);
  return {
    questionId: readUuid(feedback.questionId),
    selectedOptionId: readUuid(feedback.selectedOptionId),
    isCorrect: readBoolean(feedback.isCorrect),
    correctOptionId: readUuid(feedback.correctOptionId),
    explanation: readText(feedback.explanation),
  };
}

function readQuestion(value: unknown): QuizAttemptQuestion {
  const question = readObject(value);
  const id = readUuid(question.id);
  const options = readList(question.options, readOption);
  const feedback = question.feedback === null ? null : readFeedback(question.feedback);
  const optionIds = new Set(options.map((option) => option.id));
  if (
    options.length < 2 ||
    optionIds.size !== options.length ||
    (feedback &&
      (feedback.questionId !== id ||
        !optionIds.has(feedback.selectedOptionId) ||
        !optionIds.has(feedback.correctOptionId) ||
        feedback.isCorrect !== (feedback.selectedOptionId === feedback.correctOptionId)))
  ) {
    throw new Error("Invalid quiz options or answer feedback");
  }
  return {
    id,
    content: readText(question.content),
    options,
    feedback,
  };
}

function readSummary(value: unknown): QuizAttemptSummary {
  const summary = readObject(value);
  const correctCount = readCount(summary.correctCount);
  const wrongCount = readCount(summary.wrongCount);
  const totalQuestions = readCount(summary.totalQuestions);
  const percentage = summary.percentage;
  if (
    !totalQuestions ||
    correctCount + wrongCount !== totalQuestions ||
    typeof percentage !== "number" ||
    !Number.isFinite(percentage) ||
    percentage < 0 ||
    percentage > 100
  ) {
    throw new Error("Invalid quiz result summary");
  }
  return {
    correctCount,
    wrongCount,
    totalQuestions,
    percentage,
    passed: readBoolean(summary.passed),
    startedAt: readDate(summary.startedAt),
    finishedAt: readDate(summary.finishedAt),
  };
}

function readAttempt(value: unknown): QuizAttempt {
  const attempt = readObject(value);
  const questions = readList(attempt.questions, readQuestion);
  const totalQuestions = readCount(attempt.totalQuestions);
  const answeredCount = readCount(attempt.answeredCount);
  const status = attempt.status;
  if (
    (status !== "IN_PROGRESS" && status !== "FINISHED") ||
    !totalQuestions ||
    totalQuestions !== questions.length ||
    answeredCount !== questions.filter((question) => question.feedback !== null).length
  ) {
    throw new Error("Invalid quiz attempt");
  }
  const summary = attempt.summary === null ? null : readSummary(attempt.summary);
  const correctCount = questions.filter((question) => question.feedback?.isCorrect).length;
  if (
    (status === "FINISHED") !== (summary !== null) ||
    (status === "FINISHED" && answeredCount !== totalQuestions) ||
    (summary &&
      (summary.totalQuestions !== totalQuestions ||
        summary.correctCount !== correctCount ||
        summary.wrongCount !== totalQuestions - correctCount))
  ) {
    throw new Error("Quiz attempt result did not match its status");
  }
  return {
    id: readUuid(attempt.id),
    quizId: readUuid(attempt.quizId),
    status,
    totalQuestions,
    answeredCount,
    questions,
    summary,
  };
}

function readQuizCompletion(value: unknown): Pick<QuizProgress, "completed" | "bestPercentage"> {
  const completion = readObject(value);
  const completed = readBoolean(completion.completed);
  const bestPercentage = completion.bestPercentage;
  const passedRevisionId = completion.passedRevisionId;
  if (
    typeof bestPercentage !== "number" ||
    !Number.isFinite(bestPercentage) ||
    bestPercentage < 0 ||
    bestPercentage > 100 ||
    (passedRevisionId !== null && typeof passedRevisionId !== "string") ||
    completed !== (passedRevisionId !== null)
  ) {
    throw new Error("Invalid quiz completion");
  }
  if (passedRevisionId !== null) readUuid(passedRevisionId);
  return { completed, bestPercentage };
}

function readProgressAttempt(value: unknown, quizId: string): QuizProgressAttempt {
  const attempt = readObject(value);
  const id = readUuid(attempt.id);
  if (readUuid(attempt.quizId) !== quizId.toLowerCase()) {
    throw new Error("Quiz attempt belongs to a different quiz");
  }
  const status = attempt.status;
  const answeredCount = readCount(attempt.answeredCount);
  const totalQuestions = readCount(attempt.totalQuestions);
  if (
    (status !== "IN_PROGRESS" && status !== "FINISHED") ||
    !totalQuestions ||
    answeredCount > totalQuestions ||
    (status === "FINISHED" && answeredCount !== totalQuestions)
  ) {
    throw new Error("Invalid quiz attempt progress");
  }
  return { id, status, answeredCount, totalQuestions };
}

function readLatestAttemptPage(
  value: unknown,
  quizId: string,
): { attemptCount: number; latestAttempt: QuizProgressAttempt | null } {
  const page = readObject(value);
  const pageNumber = readCount(page.page);
  const limit = readCount(page.limit);
  const attemptCount = readCount(page.total);
  const items = readList(page.items, (item) => readProgressAttempt(item, quizId));
  if (
    pageNumber !== 1 ||
    limit !== 1 ||
    items.length !== Math.min(attemptCount, 1)
  ) {
    throw new Error("Invalid quiz attempt history");
  }
  return { attemptCount, latestAttempt: items[0] ?? null };
}

function fetchQuiz(token: string, quizId: string): Promise<PublishedQuiz> {
  return fetchLearning(
    token,
    { path: `/api/quizzes/${encodeURIComponent(quizId)}` },
    (value) => {
      const item = readObject(value);
      const questionCount = readCount(item.questionCount);
      if (!questionCount) throw new Error("Expected quiz questions");
      const id = readUuid(item.id);
      if (id !== quizId.toLowerCase()) throw new Error("Unexpected quiz ID");
      return {
        id,
        title: readText(item.title),
        description: readOptionalText(item.description),
        questionCount,
      };
    },
  );
}

export const quizRepository: QuizRepository = {
  async listInProgress(token): Promise<readonly InProgressQuiz[]> {
    const limit = 100;
    const activeAttempts = new Map<string, QuizProgressAttempt & { quizId: string }>();
    let page = 1;
    let total: number;
    do {
      const result = await fetchLearning(
        token,
        { path: `/api/quiz-attempts/me?page=${page}&limit=${limit}` },
        (value) => {
          const result = readPage(value, (item) => {
            const quizId = readUuid(readObject(item).quizId);
            return { ...readProgressAttempt(item, quizId), quizId };
          }, "limit");
          if (result.page !== page || result.pageSize !== limit || result.items.length > limit) {
            throw new Error("Invalid quiz attempt page");
          }
          return result;
        },
      );
      for (const attempt of result.items) {
        if (attempt.status === "IN_PROGRESS") activeAttempts.set(attempt.id, attempt);
      }
      total = result.total;
      page += 1;
      if (result.items.length === 0) break;
    } while ((page - 1) * limit < total);

    const quizzes = await Promise.all(
      [...activeAttempts.values()].map(async (attempt): Promise<InProgressQuiz | null> => {
        try {
          const { title } = await fetchQuiz(token, attempt.quizId);
          const { id, quizId, answeredCount, totalQuestions } = attempt;
          return { id, quizId, title, answeredCount, totalQuestions };
        } catch (error) {
          if (error instanceof AuthFailure && error.status === 404) return null;
          throw error;
        }
      }),
    );
    return quizzes.filter((quiz) => quiz !== null);
  },

  async resume(token, quizId, attemptId): Promise<QuizAttemptData> {
    const [quiz, attempt] = await Promise.all([
      fetchQuiz(token, quizId),
      fetchLearning(
        token,
        { path: `/api/quiz-attempts/${encodeURIComponent(attemptId)}` },
        readAttempt,
      ),
    ]);
    if (attempt.id !== attemptId.toLowerCase() || attempt.quizId !== quiz.id) {
      throw new Error("Quiz attempt did not match the requested quiz");
    }
    return { quiz, attempt };
  },

  async getProgress(token, quizId): Promise<QuizProgress> {
    const [completion, history] = await Promise.all([
      fetchLearning(
        token,
        { path: `/api/quizzes/${encodeURIComponent(quizId)}/completion/me` },
        readQuizCompletion,
      ),
      fetchLearning(
        token,
        {
          path: `/api/quiz-attempts/me?page=1&limit=1&quizId=${encodeURIComponent(quizId)}`,
        },
        (value) => readLatestAttemptPage(value, quizId),
      ),
    ]);
    if (
      (history.attemptCount === 0 && completion.bestPercentage !== 0) ||
      (completion.completed && history.attemptCount === 0)
    ) {
      throw new Error("Quiz completion did not match attempt history");
    }
    return {
      quizId: quizId.toLowerCase(),
      ...completion,
      ...history,
    };
  },

  async start(token, quizId): Promise<QuizAttemptData> {
    const quiz = await fetchQuiz(token, quizId);
    const attempt = await fetchLearning(
      token,
      {
        path: `/api/quizzes/${encodeURIComponent(quizId)}/attempts`,
        method: "POST",
        body: {},
      },
      readAttempt,
    );
    if (quiz.id !== quizId.toLowerCase() || attempt.quizId !== quiz.id || quiz.questionCount !== attempt.totalQuestions) {
      throw new Error("Quiz attempt did not match the requested quiz");
    }
    return { quiz, attempt };
  },

  answer(token, attemptId, questionId, selectedOptionId) {
    return fetchLearning(
      token,
      {
        path: `/api/quiz-attempts/${encodeURIComponent(attemptId)}/answers/${encodeURIComponent(questionId)}`,
        method: "PUT",
        body: { selectedOptionId },
      },
      (value) => {
        const feedback = readFeedback(value);
        if (feedback.questionId !== questionId || feedback.selectedOptionId !== selectedOptionId) {
          throw new Error("Quiz feedback did not match the submitted answer");
        }
        return feedback;
      },
    );
  },

  finish(token, attemptId) {
    return fetchLearning(
      token,
      {
        path: `/api/quiz-attempts/${encodeURIComponent(attemptId)}/finish`,
        method: "POST",
        body: {},
      },
      readSummary,
    );
  },

  getResult(token, attemptId) {
    return fetchLearning(
      token,
      { path: `/api/quiz-attempts/${encodeURIComponent(attemptId)}/result` },
      (value) => {
        const attempt = readAttempt(value);
        if (attempt.id !== attemptId.toLowerCase() || attempt.status !== "FINISHED") {
          throw new Error("Quiz result did not match the requested attempt");
        }
        return attempt;
      },
    );
  },
};
