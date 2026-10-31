import { Redirect } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import type { QuizTab } from "@/domain/quiz";
import { useQuizData } from "@/hooks/quiz";
import { Brands } from "@/lib/themes";

import { QuizListCard } from "./quiz-list-card";

const TABS: readonly QuizTab[] = ["Assigned", "Practice", "Completed"];

export function QuizListView(): ReactElement {
  const [activeTab, setActiveTab] = useState<QuizTab>("Assigned");
  const data = useQuizData();
  if (!data) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="bg-surface border-b-[1px] border-b-progressTrack px-5 pt-2">
        <View className="min-h-[50px] flex-row items-center justify-between">
          <Text className="text-text font-brand-regular text-[23px] tracking-[-0.5px]">
            Quizzes
          </Text>
          <View
            className="bg-grow border-[1px] border-tipBorder rounded-[20px] px-3 py-[7px] flex-row items-center gap-[5px]"
            accessibilityLabel={`${data.xpTotal.toLocaleString("en-US")} XP`}
          >
            <SymbolView
              name={{ ios: "star", android: "star", web: "star" }}
              size={16}
              tintColor={Brands.colors.homeOrange}
            />
            <Text className="text-growText font-brand-mono text-[12px]">
              {data.xpTotal.toLocaleString("en-US")} XP
            </Text>
          </View>
        </View>
        <View className="flex-row gap-6 mt-1" accessibilityRole="tablist">
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
              onPress={() => setActiveTab(tab)}
              className={`min-h-[43px] justify-center border-b-[2px] ${activeTab === tab ? "border-b-primary" : "border-b-transparent"}`}
            >
              <Text
                className={`font-brand-regular text-[14px] ${activeTab === tab ? "text-text" : "text-textMuted"}`}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-4 pb-[26px] gap-3"
      >
        {activeTab === "Assigned" ? (
          data.assigned.map((quiz) => (
            <QuizListCard key={quiz.title} quiz={quiz} />
          ))
        ) : (
          <View className="rounded-[20px] border-[1px] border-border bg-surface p-5 gap-[6px]">
            <Text className="text-text font-brand-medium text-[15px]">
              No {activeTab.toLowerCase()} quizzes yet
            </Text>
            <Text className="text-textSecondary font-brand-light text-[13px]">
              Your quizzes will appear here when available.
            </Text>
          </View>
        )}
      </ScrollView>
      <BottomNavigation active="Quiz" />
    </SafeAreaView>
  );
}
