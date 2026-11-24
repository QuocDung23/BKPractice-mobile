import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { LearningStatus } from "@/components/ui";
import { usePublishedProblem } from "@/hooks/problems";
import { Brands } from "@/lib/themes";
import { useAuthSession } from "@/stores/auth-session";

type ProblemDetailViewProps = { idOrSlug: string };

function formatTimeLimit(timeLimitMs: number): string {
  return timeLimitMs % 1000 === 0
    ? `${timeLimitMs / 1000}s`
    : `${timeLimitMs}ms`;
}

export function ProblemDetailView({
  idOrSlug,
}: ProblemDetailViewProps): ReactElement {
  const { status: sessionStatus } = useAuthSession();
  const insets = useSafeAreaInsets();
  const request = usePublishedProblem(idOrSlug);
  if (sessionStatus === "signedOut") return <Redirect href="/sign-in" />;

  const { state, retry } = request;
  if (state.status !== "success") {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="min-h-[57px] flex-row items-center px-2 border-b-[1px] border-b-progressTrack bg-background">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to problems"
            onPress={() => router.back()}
            className="w-11 h-11 items-center justify-center"
          >
            <SymbolView
              name={{
                ios: "arrow.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              size={21}
              tintColor={Brands.colors.text}
            />
          </Pressable>
          <Text className="flex-1 text-text font-brand-regular text-[15px]">
            Problem
          </Text>
        </View>
        <View className="flex-1 bg-background px-5">
          <LearningStatus
            state={state}
            retry={retry}
            empty="Problem details are unavailable."
            centered
          />
        </View>
      </SafeAreaView>
    );
  }

  const problem = state.data;
  const difficultyColors =
    problem.difficulty === "Easy"
      ? { background: "bg-successBackground", text: "text-success" }
      : problem.difficulty === "Medium"
        ? { background: "bg-warningBackground", text: "text-warningText" }
        : { background: "bg-hardBackground", text: "text-hardText" };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className="flex-1 bg-background"
    >
      <View className="min-h-[57px] flex-row items-center px-2  bg-background">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to problems"
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center"
        >
          <SymbolView
            name={{
              ios: "arrow.left",
              android: "arrow_back",
              web: "arrow_back",
            }}
            size={21}
            tintColor={Brands.colors.text}
          />
        </Pressable>
        <Text className="flex-1 text-text font-brand-regular text-[23px] tracking-[-0.5px] mt-[3px]">
          {problem.title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Submission history"
          accessibilityHint="Submission history is not available yet."
          accessibilityState={{ disabled: true }}
          disabled
          className="w-11 h-11 items-center justify-center opacity-[0.65]"
        >
          <SymbolView
            name={{
              ios: "clock.arrow.circlepath",
              android: "history",
              web: "history",
            }}
            size={20}
            tintColor={Brands.colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-background pt-3"
        contentContainerClassName="px-5 pt-[15px] pb-6 gap-[13px]"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="flex-row flex-wrap items-center gap-1">
          <View
            className={`min-h-[25px] px-[10px] rounded-[13px] flex-row items-center gap-1 ${difficultyColors.background}`}
          >
            <Text
              className={`${difficultyColors.text} font-brand-medium text-[11px]`}
            >
              {problem.difficulty}
            </Text>
          </View>
          <View
            className={`min-h-[25px] px-[10px] rounded-[13px] flex-row items-center gap-1 ${problem.solved ? "bg-successBackground" : "bg-resultRowBackground"}`}
          >
            {problem.solved ? (
              <SymbolView
                name={{
                  ios: "checkmark.circle",
                  android: "check_circle",
                  web: "check_circle",
                }}
                size={13}
                tintColor={Brands.colors.success}
              />
            ) : null}
            <Text
              className={`${problem.solved ? "text-success" : "text-textSecondary"} font-brand-medium text-[11px]`}
            >
              {problem.solved ? "Accepted" : "Not solved"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-[17px]">
          <Text className="text-textSecondary font-brand-mono text-[11px]">
            {formatTimeLimit(problem.timeLimitMs)} / {problem.memoryLimitMb}MB
          </Text>
        </View>
        <Text className="text-textSupporting font-brand-light text-[15px] leading-[22px] mt-[1px]">
          {problem.statement}
        </Text>

        {problem.examples.map((example, index) => (
          <View key={`${example.input}-${index}`} className="gap-[7px]">
            <Text className="text-text font-brand-regular text-[15px]">
              Example {index + 1}
            </Text>
            <View className="border-[1px] border-border rounded-[19px] bg-surface p-[15px] gap-[6px]">
              <Text className="text-text font-brand-mono text-[12px] leading-[17px]">
                Input: {example.input}
              </Text>
              <Text className="text-text font-brand-mono text-[12px] leading-[17px]">
                Output: {example.output}
              </Text>
            </View>
          </View>
        ))}

        {problem.constraints ? (
          <View className="gap-[6px]">
            <Text className="text-text font-brand-regular text-[15px]">
              Constraints
            </Text>
            <Text className="text-textSecondary font-brand-mono text-[11px] leading-[17px]">
              {problem.constraints}
            </Text>
          </View>
        ) : null}

        <View className="bg-practice rounded-[20px] p-4 flex-row items-start gap-3 mt-[1px]">
          <SymbolView
            name={{ ios: "iphone.gen3", android: "devices", web: "devices" }}
            size={20}
            tintColor={Brands.colors.homeBlueText}
          />
          <View className="flex-1 gap-[5px]">
            <Text className="text-infoTitle font-brand-regular text-[13px]">
              Read-only on mobile
            </Text>
            <Text className="text-infoText font-brand-light text-[12px] leading-[18px]">
              This screen supports reading only. Code execution and submission
              are unavailable on mobile.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="bg-surface border-t-[1px] border-t-progressTrack items-center pt-2"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Results unavailable"
          accessibilityHint="Submission results are not connected yet."
          accessibilityState={{ disabled: true }}
          disabled
          className="w-40 h-14 border-[1px] border-fieldBorder rounded-[21px] flex-row items-center justify-center gap-2"
        >
          <SymbolView
            name={{
              ios: "doc.text",
              android: "receipt_long",
              web: "receipt_long",
            }}
            size={18}
            tintColor={Brands.colors.primary}
          />
          <Text className="text-text font-brand-medium text-[14px]">
            Results
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
