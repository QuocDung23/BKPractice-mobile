import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAssignmentData } from "@/hooks/assignments";
import { Brands } from "@/lib/themes";

import { AssignmentProblemRow } from "./assignment-problem-row";

export function AssignmentDetailView(): ReactElement {
  const data = useAssignmentData();
  if (!data) return <Redirect href="/sign-in" />;

  const { detail } = data;
  const { summary } = detail;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="min-h-14 px-2 flex-row items-center border-b-[1px] border-b-progressTrack">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/assignments")
          }
          className="w-11 h-11 items-center justify-center"
        >
          <SymbolView
            name={{
              ios: "arrow.left",
              android: "arrow_back",
              web: "arrow_back",
            }}
            size={22}
            tintColor={Brands.colors.text}
          />
        </Pressable>
        <Text className="flex-1 text-text font-brand-regular text-[16px]">
          Assignment
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share assignment, coming soon"
          accessibilityState={{ disabled: true }}
          disabled
          className="w-11 h-11 items-center justify-center"
        >
          <SymbolView
            name={{
              ios: "square.and.arrow.up",
              android: "share",
              web: "share",
            }}
            size={21}
            tintColor={Brands.colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-[18px] pb-8 gap-[9px]"
      >
        <View className="flex-row items-center gap-[9px] mb-[1px]">
          <View className="min-h-7 rounded-[16px] bg-warningBackground px-[10px] flex-row items-center gap-[5px]">
            <SymbolView
              name={{ ios: "clock", android: "schedule", web: "schedule" }}
              size={15}
              tintColor={Brands.colors.warningText}
            />
            <Text className="text-warningLabel font-brand-medium text-[11px]">
              Due in {detail.dueInDays} days
            </Text>
          </View>
          <View className="min-h-7 rounded-[16px] bg-courseMint px-[10px] justify-center">
            <Text className="text-successLabel font-brand-medium text-[11px]">
              {summary.status}
            </Text>
          </View>
        </View>

        <Text className="text-text font-brand-regular text-[21px] leading-[26px] tracking-[-0.4px]">
          {summary.title}
        </Text>
        <Text className="text-textSupporting font-brand-light text-[12px] leading-[18px] mb-[5px]">
          {summary.code} · {detail.courseTitle}
          {"\n"}Opens {detail.opens} · Closes {detail.closes}
        </Text>

        <View className="border-[1px] border-border bg-surface rounded-[21px] p-[17px] gap-[10px] mb-1">
          <View className="flex-row justify-between items-center gap-[10px]">
            <Text className="text-text font-brand-regular text-[14px]">
              Your progress
            </Text>
            <Text className="text-successLabel font-brand-mono text-[12px]">
              {summary.acceptedProblems}/{summary.totalProblems} accepted
            </Text>
          </View>
          <View className="h-2 rounded-[4px] bg-progressTrack overflow-hidden">
            <View
              className="h-2 rounded-[4px] bg-primary"
              style={{
                width: `${(summary.acceptedProblems / summary.totalProblems) * 100}%`,
              }}
            />
          </View>
          <Text className="text-textSupporting font-brand-light text-[11px]">
            Grade is released after the deadline.
          </Text>
        </View>

        <View className="gap-[9px]">
          <Text className="text-text font-brand-regular text-[17px]">
            Instructions
          </Text>
          <Text className="text-textSupporting font-brand-light text-[14px] leading-[20px]">
            {detail.instructions.before}
            <Text className="text-successLabel bg-learn font-brand-mono text-[12px]">
              {detail.instructions.compilerFlag}
            </Text>
            {detail.instructions.after}
          </Text>
        </View>

        <View className="gap-[9px]">
          <Text className="text-text font-brand-regular text-[17px]">
            Problems
          </Text>
          <View className="gap-[9px]">
            {detail.problems.map((problem) => (
              <AssignmentProblemRow key={problem.title} problem={problem} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
