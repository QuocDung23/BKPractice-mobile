import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ProblemFilter } from "@/domain/problems";
import {
  useFilteredProblems,
  useProblemData,
} from "@/hooks/problems/use-problem-data";
import { Brands } from "@/lib/themes";

import { ProblemRow } from "./problem-row";

const FILTERS: readonly ProblemFilter[] = ["All", "Easy", "Medium", "Hard"];

export function ProblemListView(): ReactElement {
  const [filter, setFilter] = useState<ProblemFilter>("All");
  const data = useProblemData();
  const problems = useFilteredProblems(filter);
  if (!data || !problems) return <Redirect href="/sign-in" />;

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
              name={{
                ios: "arrow.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              size={21}
              tintColor={Brands.colors.text}
            />
          </Pressable>
          <View className="flex-1 min-w-0 gap-[2px]">
            <Text className="text-text font-brand-regular text-[17px]">
              Problems
            </Text>
            <Text className="text-textSecondary font-brand-mono text-[10px]">
              {data.courseCode} · {data.acceptedProblems} of{" "}
              {data.totalProblems} accepted
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
              name={{
                ios: "magnifyingglass",
                android: "search",
                web: "search",
              }}
              size={19}
              tintColor={Brands.colors.text}
            />
          </Pressable>
        </View>
        <View className="flex-row px-5 gap-2">
          {FILTERS.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === item }}
              onPress={() => setFilter(item)}
              className={`min-h-11 px-[13px] rounded-[22px] items-center justify-center ${filter === item ? "bg-primary" : "bg-resultRowBackground"}`}
            >
              <Text
                className={`font-brand-regular text-[12px] ${filter === item ? "text-surface" : "text-textSecondary"}`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-4 pb-7 gap-[10px]"
      >
        {problems.map((problem) => (
          <ProblemRow key={problem.number} problem={problem} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
