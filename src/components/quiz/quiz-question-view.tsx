import {
  Redirect,
  router,
  useLocalSearchParams,
  usePreventRemove,
} from "expo-router";
import { SymbolView } from "expo-symbols";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LearningStatus } from "@/components/ui";
import type { QuizAnswerFeedback } from "@/domain/quiz";
import { describeLearningFailure } from "@/hooks/learning";
import { useQuizAttempt } from "@/hooks/quiz";
import { Brands } from "@/lib/themes";
import { useAuthSession } from "@/stores/auth-session";

import { QuizExitConfirmation } from "./quiz-exit-confirmation";

export function QuizQuestionView(): ReactElement {
  const params = useLocalSearchParams<{ quizId?: string | string[] }>();
  const quizId = typeof params.quizId === "string" ? params.quizId : undefined;
  const { status: sessionStatus } = useAuthSession();
  const { state, retry, answer, finish } = useQuizAttempt(quizId);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackByQuestionId, setFeedbackByQuestionId] = useState<
    Record<string, QuizAnswerFeedback>
  >({});
  const [answerError, setAnswerError] = useState<{
    message: string;
    retryable: boolean;
  } | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isExitConfirmationVisible, setIsExitConfirmationVisible] = useState(false);
  const [pendingExitAction, setPendingExitAction] = useState<(() => void) | null>(null);
  const [allowRouteRemoval, setAllowRouteRemoval] = useState(false);
  const [finishedAttemptId, setFinishedAttemptId] = useState<string | null>(null);
  const isExitDialogOpen = useRef(false);
  const exitWasConfirmed = useRef(false);
  const exitWasCanceled = useRef(false);
  const [panelOffset] = useState(() => new Animated.Value(70));
  const [panelOpacity] = useState(() => new Animated.Value(0));
  const attemptData = state.status === "success" ? state.data : null;
  const hasInProgressAttempt =
    sessionStatus === "signedIn" && attemptData?.attempt.status === "IN_PROGRESS";
  const firstUnansweredIndex = attemptData
    ? attemptData.attempt.questions.findIndex((question) => question.feedback === null)
    : -1;
  const currentQuestionIndex = attemptData
    ? currentQuestionId
      ? Math.max(
          0,
          attemptData.attempt.questions.findIndex((question) => question.id === currentQuestionId),
        )
      : firstUnansweredIndex < 0
        ? attemptData.attempt.questions.length - 1
        : firstUnansweredIndex
    : -1;
  const question = attemptData?.attempt.questions[currentQuestionIndex];
  const feedback = question
    ? feedbackByQuestionId[question.id] ?? question.feedback
    : null;

  const hasFeedback = feedback !== null;

  const handlePreventRemove = useCallback(
    ({ repeat }: { repeat: () => void }): void => {
      isExitDialogOpen.current = true;
      setPendingExitAction(() => repeat);
      setIsExitConfirmationVisible(true);
    },
    [],
  );
  const disableRemovalPrevention = usePreventRemove(
    hasInProgressAttempt && !allowRouteRemoval,
    handlePreventRemove,
  );

  const showQuizResult = (attemptId: string): void => {
    setAllowRouteRemoval(true);
    disableRemovalPrevention();
    router.replace({ pathname: "/quiz-result", params: { attemptId } });
  };

  useEffect(() => {
    if (!hasFeedback) return;
    panelOffset.setValue(70);
    panelOpacity.setValue(0);
    const animation = Animated.parallel([
      Animated.timing(panelOffset, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(panelOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [hasFeedback, panelOffset, panelOpacity]);

  if (sessionStatus === "signedOut") return <Redirect href="/sign-in" />;
  if (!quizId) return <Redirect href="/courses" />;

  const closeQuiz = (): void => {
    if (router.canGoBack()) router.back();
    else router.replace("/courses");
  };

  const stayInQuiz = (): void => {
    isExitDialogOpen.current = false;
    exitWasCanceled.current = true;
    setIsExitConfirmationVisible(false);
    setPendingExitAction(null);
  };

  const exitQuiz = (): void => {
    const repeatExit = pendingExitAction;
    isExitDialogOpen.current = false;
    setIsExitConfirmationVisible(false);
    setPendingExitAction(null);
    if (!repeatExit) return;
    exitWasConfirmed.current = true;
    setAllowRouteRemoval(true);
    disableRemovalPrevention();
    repeatExit();
  };

  if (state.status !== "success") {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-5">
          <LearningStatus
            state={state}
            retry={retry}
            empty="Quiz questions are unavailable."
            centered
          />
        </View>
      </SafeAreaView>
    );
  }

  const { quiz, attempt } = state.data;

  if (!question) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 px-5">
          <LearningStatus
            state={{
              status: "error",
              message: "This quiz has no available questions.",
              retryable: false,
            }}
            retry={retry}
            empty="Quiz questions are unavailable."
            centered
          />
        </View>
      </SafeAreaView>
    );
  }

  const correctOption = feedback
    ? question.options.find((option) => option.id === feedback.correctOptionId)
    : undefined;
  const isLastQuestion = currentQuestionIndex === attempt.questions.length - 1;

  const submitAnswer = async (optionId: string): Promise<void> => {
    if (isChecking || feedback) return;
    setSelectedOptionId(optionId);
    setAnswerError(null);
    setIsChecking(true);
    try {
      const result = await answer(attempt.id, question.id, optionId);
      setFeedbackByQuestionId((current) => ({ ...current, [question.id]: result }));
      setSelectedOptionId(null);
    } catch (error: unknown) {
      setAnswerError(describeLearningFailure(error));
    } finally {
      setIsChecking(false);
    }
  };

  const continueQuiz = async (): Promise<void> => {
    if (!feedback || isFinishing) return;
    setFinishError(null);
    if (finishedAttemptId) {
      showQuizResult(finishedAttemptId);
      return;
    }
    exitWasCanceled.current = false;
    if (!isLastQuestion) {
      setSelectedOptionId(null);
      setAnswerError(null);
      setCurrentQuestionId(attempt.questions[currentQuestionIndex + 1]?.id ?? null);
      return;
    }

    setIsFinishing(true);
    try {
      await finish(attempt.id);
      setFinishedAttemptId(attempt.id);
      if (
        exitWasConfirmed.current ||
        isExitDialogOpen.current ||
        exitWasCanceled.current
      ) return;
      showQuizResult(attempt.id);
    } catch (error: unknown) {
      setFinishError(describeLearningFailure(error).message);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-surface border-b-[1px] border-b-progressTrack px-5 pt-[5px] pb-[15px]">
        <View className="min-h-[52px] flex-row items-center gap-[9px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close quiz"
            onPress={closeQuiz}
            className="w-[42px] h-[42px] items-center justify-center"
          >
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              size={22}
              tintColor={Brands.colors.text}
            />
          </Pressable>
          <Text
            className="flex-1 text-text font-brand-regular text-[15px]"
            numberOfLines={1}
          >
            {quiz.title}
          </Text>
        </View>
        <View
          className="flex-row gap-1 mt-[7px]"
          accessibilityLabel={`Question ${currentQuestionIndex + 1} of ${attempt.totalQuestions}`}
        >
          {attempt.questions.map((item, index) => {
            const result = feedbackByQuestionId[item.id] ?? item.feedback;
            const segmentColor = result
              ? result.isCorrect ? "bg-primary" : "bg-error"
              : index === currentQuestionIndex ? "bg-signInAccent" : "bg-progressTrack";

            return (
              <View
                key={item.id}
                className={`flex-1 h-[5px] rounded-[3px] ${segmentColor}`}
              />
            );
          })}
        </View>
        <Text className="text-textSecondary font-brand-mono text-[11px] mt-[9px]">
          Question {currentQuestionIndex + 1} of {attempt.totalQuestions}
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-[22px] pb-7"
        contentContainerStyle={{ paddingBottom: feedback ? 240 : 28 }}
      >
        <Text className="text-text font-brand-regular text-[17px] leading-[23px] mb-4">
          {question.content}
        </Text>
        <View className="gap-3" accessibilityRole="radiogroup">
          {question.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelectedAnswer = feedback?.selectedOptionId === option.id;
            const isCorrect = isSelectedAnswer && feedback.isCorrect;
            const isWrongSelection = isSelectedAnswer && !feedback.isCorrect;
            const isPendingSelection = selectedOptionId === option.id;
            const isDisabled =
              isChecking ||
              feedback !== null ||
              (Boolean(answerError) && !answerError?.retryable) ||
              (selectedOptionId !== null && !isPendingSelection);
            const colorClass = isCorrect
              ? "border-success bg-successBackground"
              : isWrongSelection
                ? "border-error bg-hardBackground"
                : "border-border bg-surface";

            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityLabel={`${letter}, ${option.content}${isCorrect ? ", correct answer" : isWrongSelection ? ", incorrect answer" : ""}`}
                accessibilityState={{
                  checked: feedback?.selectedOptionId === option.id || isPendingSelection,
                  disabled: isDisabled,
                }}
                disabled={isDisabled}
                onPress={() => void submitAnswer(option.id)}
                className={`min-h-[59px] border-[1px] rounded-[30px] px-[14px] flex-row items-center gap-3 ${colorClass}`}
              >
                <View
                  className={`w-[29px] h-[29px] rounded-[15px] items-center justify-center ${isCorrect ? "bg-success" : isWrongSelection ? "bg-error" : "bg-resultRowBackground"}`}
                >
                  {isCorrect || isWrongSelection ? (
                    <SymbolView
                      name={{
                        ios: isCorrect ? "checkmark" : "xmark",
                        android: isCorrect ? "check" : "close",
                        web: isCorrect ? "check" : "close",
                      }}
                      size={14}
                      tintColor={Brands.colors.surface}
                    />
                  ) : (
                    <Text className="text-textSecondary font-brand-regular text-[12px]">
                      {letter}
                    </Text>
                  )}
                </View>
                <Text className="text-text font-brand-mono text-[13px] flex-1">
                  {option.content}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {answerError ? (
          <Text
            accessibilityLiveRegion="polite"
            className="text-error font-brand-regular text-[12px] mt-3"
          >
            {answerError.message}
          </Text>
        ) : null}
      </ScrollView>

      {!feedback ? (
        <View className="bg-surface border-t-[1px] border-t-progressTrack px-5 py-3 flex-row items-center gap-3">
          <Text className="flex-1 text-textSecondary font-brand-light text-[12px]">
            {isChecking
              ? "Checking answer…"
              : answerError
                ? answerError.message
                : "Pick one answer"}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={answerError ? "Retry answer" : "Continue"}
            accessibilityState={{
              disabled: !selectedOptionId || isChecking || !answerError?.retryable,
            }}
            disabled={
              !selectedOptionId || isChecking || (Boolean(answerError) && !answerError?.retryable)
            }
            onPress={() => {
              if (selectedOptionId) void submitAnswer(selectedOptionId);
            }}
            className={`min-w-[118px] flex-1 min-h-12 rounded-[18px] items-center justify-center ${selectedOptionId && !isChecking ? "bg-primary" : "bg-border"}`}
          >
            <Text
              className={`font-brand-medium text-[15px] ${selectedOptionId && !isChecking ? "text-surface" : "text-textMuted"}`}
            >
              {answerError ? "Retry answer" : "Continue"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Animated.View
          accessibilityViewIsModal
          className={`absolute bottom-0 left-0 right-0 border-t-[1px] border-border ${feedback.isCorrect ? "bg-successBackground" : "bg-hardBackground"}`}
          style={{
            opacity: panelOpacity,
            transform: [{ translateY: panelOffset }],
          }}
        >
          <View className="px-5 pt-4 pb-3 gap-3">
            <View className="flex-row items-center gap-2">
              <SymbolView
                name={{
                  ios: feedback.isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill",
                  android: feedback.isCorrect ? "check_circle" : "cancel",
                  web: feedback.isCorrect ? "check_circle" : "cancel",
                }}
                size={23}
                tintColor={feedback.isCorrect ? Brands.colors.success : Brands.colors.error}
              />
              <Text
                accessibilityLiveRegion="polite"
                className={`font-brand-medium text-[18px] ${feedback.isCorrect ? "text-success" : "text-error"}`}
              >
                {feedback.isCorrect ? "Correct!" : "Not quite"}
              </Text>
            </View>
            {!feedback.isCorrect && correctOption ? (
              <Text className="text-text font-brand-medium text-[13px]">
                Correct answer: {correctOption.content}
              </Text>
            ) : null}
            <Text className="text-text font-brand-light text-[13px] leading-[19px]">
              {feedback.explanation}
            </Text>
            {finishError ? (
              <Text className="text-error font-brand-regular text-[12px]">
                {finishError}
              </Text>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isFinishing ? "Finishing quiz" : isLastQuestion ? "See results" : "Continue"}
              accessibilityState={{ disabled: isFinishing }}
              disabled={isFinishing}
              onPress={() => void continueQuiz()}
              className={`min-h-[48px] rounded-[18px] items-center justify-center ${isFinishing ? "bg-primary/70" : "bg-primary"}`}
            >
              <Text className="text-surface font-brand-medium text-[15px]">
                {isFinishing
                  ? "Finishing…"
                  : isLastQuestion || finishedAttemptId
                    ? "See results"
                    : "Continue"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
      <QuizExitConfirmation
        visible={isExitConfirmationVisible}
        onStay={stayInQuiz}
        onExit={exitQuiz}
      />
    </SafeAreaView>
  );
}
