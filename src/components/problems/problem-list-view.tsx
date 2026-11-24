import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LearningPagination, LearningStatus } from "@/components/ui";
import type { ProblemFilter } from "@/domain/problems";
import { usePublishedProblems } from "@/hooks/problems";
import { useAuthSession } from "@/stores/auth-session";
import { Brands } from "@/lib/themes";

import { ProblemRow } from "./problem-row";

const FILTERS: readonly ProblemFilter[] = ["All", "Easy", "Medium", "Hard"];

export function ProblemListView(): ReactElement {
  const [selection, setSelection] = useState({ page: 1, filter: "All" as ProblemFilter });
  const { status: sessionStatus } = useAuthSession();
  const request = usePublishedProblems(selection.page, selection.filter);

  if (sessionStatus === "signedOut") return <Redirect href="/sign-in" />;

  const { state, retry } = request;
  const count = state.status === "success" ? state.data.total : undefined;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-surface border-b-[1px] border-b-progressTrack pb-3">
        <View className="min-h-14 px-2 flex-row items-center gap-[2px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="w-11 h-11 items-center justify-center"
          >
            <SymbolView
              name={{ ios: "arrow.left", android: "arrow_back", web: "arrow_back" }}
              size={21}
              tintColor={Brands.colors.text}
            />
          </Pressable>
          <View className="flex-1 min-w-0 gap-[2px]">
            <Text className="text-text font-brand-regular text-[17px]">Problems</Text>
            <Text className="text-textSecondary font-brand-mono text-[10px]">
              {count === undefined
                ? "Published problems"
                : `${count} ${count === 1 ? "problem" : "problems"}`}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search problems, coming soon"
            accessibilityState={{ disabled: true }}
            disabled
            className="w-11 h-11 items-center justify-center"
          >
            <SymbolView
              name={{ ios: "magnifyingglass", android: "search", web: "search" }}
              size={19}
              tintColor={Brands.colors.text}
            />
          </Pressable>
        </View>
        <View className="flex-row px-5 gap-2">
          {FILTERS.map((filter) => {
            const selected = selection.filter === filter;
            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSelection({ page: 1, filter })}
                className={`min-h-11 px-[13px] rounded-[22px] items-center justify-center ${selected ? "bg-primary" : "bg-resultRowBackground"}`}
              >
                <Text
                  className={`font-brand-regular text-[12px] ${selected ? "text-surface" : "text-textSecondary"}`}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow px-5 pt-4 pb-7 gap-[10px]"
      >
        {state.status === "success" ? (
          <>
            {state.data.items.length ? (
              state.data.items.map((problem) => (
                <ProblemRow key={problem.id} problem={problem} />
              ))
            ) : (
              <LearningStatus
                state={state}
                retry={retry}
                empty={
                  selection.filter === "All"
                    ? "No published problems yet."
                    : `No ${selection.filter.toLowerCase()} problems found.`
                }
                centered
              />
            )}
            <LearningPagination
              {...state.data}
              onPageChange={(page) => setSelection((current) => ({ ...current, page }))}
            />
          </>
        ) : (
          <LearningStatus
            state={state}
            retry={retry}
            empty="Problems are unavailable."
            centered
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
