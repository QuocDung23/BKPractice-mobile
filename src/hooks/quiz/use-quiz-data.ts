import { AuthFailure } from "@/domain/auth";
import type { LearningRequestResult } from "@/domain/learning";
import type {
  QuizAnswerFeedback,
  QuizAttempt,
  QuizAttemptData,
  QuizData,
  QuizProgress,
  QuizProgressCollection,
} from "@/domain/quiz";
import { useHomeData } from "@/hooks/auth/use-home-data";
import { useLearningRequest } from "@/hooks/learning";
import { DEMO_QUIZ_DATA, quizRepository } from "@/lib/quiz";
import { useAuthSession } from "@/stores/auth-session";

async function loadQuizProgress(
  token: string,
  quizIds: readonly string[],
): Promise<QuizProgressCollection> {
  const results = await Promise.allSettled(
    quizIds.map((quizId) => quizRepository.getProgress(token, quizId)),
  );
  const progressByQuizId = new Map<string, QuizProgress>();
  const unavailableQuizIds = new Set<string>();
  const retryableQuizIds = new Set<string>();

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      progressByQuizId.set(result.value.quizId, result.value);
    } else {
      if (result.reason instanceof AuthFailure && result.reason.status === 401) {
        throw result.reason;
      }
      const quizId = quizIds[index];
      if (quizId) {
        unavailableQuizIds.add(quizId);
        if (
          !(result.reason instanceof AuthFailure) ||
          ![401, 403, 404].includes(result.reason.status)
        ) {
          retryableQuizIds.add(quizId);
        }
      }
    }
  });

  return { progressByQuizId, unavailableQuizIds, retryableQuizIds };
}

export function useQuizData(): QuizData | null {
  return useHomeData() ? DEMO_QUIZ_DATA : null;
}

export function useQuizAttempt(
  quizId: string | undefined,
): LearningRequestResult<QuizAttemptData> & {
  answer: (
    attemptId: string,
    questionId: string,
    selectedOptionId: string,
  ) => Promise<QuizAnswerFeedback>;
  finish: (attemptId: string) => Promise<void>;
} {
  const { session } = useAuthSession();
  const request = useLearningRequest(
    quizId ? `quiz-attempt:${quizId}` : undefined,
    (token) => {
      if (!quizId) throw new Error("Quiz ID is missing");
      return quizRepository.start(token, quizId);
    },
  );

  const answer = (
    attemptId: string,
    questionId: string,
    selectedOptionId: string,
  ): Promise<QuizAnswerFeedback> => {
    if (!session) {
      throw new AuthFailure("invalid_token", "Your session has expired. Sign in again.", 401);
    }
    return quizRepository.answer(
      session.tokens.accessToken,
      attemptId,
      questionId,
      selectedOptionId,
    );
  };

  const finish = (attemptId: string): Promise<void> => {
    if (!session) {
      throw new AuthFailure("invalid_token", "Your session has expired. Sign in again.", 401);
    }
    return quizRepository.finish(session.tokens.accessToken, attemptId).then(() => undefined);
  };

  return { ...request, answer, finish };
}

export function useQuizResult(
  attemptId: string | undefined,
): LearningRequestResult<QuizAttempt> {
  return useLearningRequest(
    attemptId ? `quiz-result:${attemptId}` : undefined,
    (token) => {
      if (!attemptId) throw new Error("Attempt ID is missing");
      return quizRepository.getResult(token, attemptId);
    },
  );
}

export function useQuizProgress(
  quizIds: readonly string[],
  enabled = true,
): LearningRequestResult<QuizProgressCollection> {
  const uniqueQuizIds = [...new Set(quizIds)];
  const key = enabled && uniqueQuizIds.length
    ? `quiz-progress:${uniqueQuizIds.join(",")}`
    : undefined;
  return useLearningRequest(key, (token) =>
    loadQuizProgress(token, uniqueQuizIds),
  );
}
