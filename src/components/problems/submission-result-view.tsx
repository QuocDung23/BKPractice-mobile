import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProblemData } from "@/hooks/problems/use-problem-data";
import { Brands } from "@/lib/themes";

export function SubmissionResultView(): ReactElement {
  const data = useProblemData();
  if (!data) return <Redirect href="/sign-in" />;

  const { result, detail } = data;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="min-h-[59px] flex-row items-center px-2 border-b-[1px] border-b-progressTrack">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to problem"
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
        <View className="flex-1 gap-[2px]">
          <Text className="text-text font-brand-regular text-[16px]">
            Submission result
          </Text>
          <Text className="text-textSecondary font-brand-mono text-[10px]">
            #{result.id} · {result.submittedAt}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-[18px] pb-6 gap-[15px]"
      >
        <View className="bg-successBackground rounded-[23px] p-[18px] gap-[15px]">
          <View className="flex-row items-center gap-3">
            <View className="w-[47px] h-[47px] rounded-[24px] bg-success items-center justify-center">
              <SymbolView
                name={{ ios: "checkmark", android: "check", web: "check" }}
                size={25}
                tintColor={Brands.colors.surface}
              />
            </View>
            <View className="flex-1 gap-[3px]">
              <Text className="text-resultTitle font-brand-regular text-[21px]">
                {result.status}
              </Text>
              <Text className="text-resultText font-brand-light text-[12px]">
                {detail.problem.title} · {result.language}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1 bg-surface rounded-[17px] px-[10px] py-2 gap-[2px]">
              <Text className="text-success font-brand-mono text-[14px]">
                {result.runtime}
              </Text>
              <Text className="text-textSecondary font-brand-light text-[10px]">
                runtime
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-[17px] px-[10px] py-2 gap-[2px]">
              <Text className="text-success font-brand-mono text-[14px]">
                {result.memory}
              </Text>
              <Text className="text-textSecondary font-brand-light text-[10px]">
                memory
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-[17px] px-[10px] py-2 gap-[2px]">
              <Text className="text-success font-brand-mono text-[14px]">
                {result.passedTests}/{result.totalTests}
              </Text>
              <Text className="text-textSecondary font-brand-light text-[10px]">
                tests
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-text font-brand-regular text-[16px]">
          Test cases
        </Text>
        <View className="bg-surface border-[1px] border-border rounded-[21px] overflow-hidden">
          {result.cases.map((testCase, index) => (
            <View
              key={testCase.label}
              className={`min-h-14 flex-row items-center gap-2 px-[13px] ${index < result.cases.length - 1 ? "border-b-[1px] border-b-resultRowBackground" : ""}`}
            >
              <SymbolView
                name={{
                  ios: "checkmark.circle",
                  android: "check_circle",
                  web: "check_circle",
                }}
                size={18}
                tintColor={Brands.colors.success}
              />
              <Text
                className="flex-1 min-w-0 text-text font-brand-mono text-[11px]"
                numberOfLines={1}
              >
                {testCase.label}
              </Text>
              <Text className="text-textSecondary font-brand-mono text-[10px]">
                {testCase.runtime}
              </Text>
              <Text className="text-success font-brand-medium text-[10px]">
                {testCase.status}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center justify-between mt-[2px]">
          <Text className="text-text font-brand-regular text-[16px]">
            Your code
          </Text>
          <Text className="text-textSecondary font-brand-mono text-[10px]">
            {result.filename}
          </Text>
        </View>
        <View className="bg-darkGreen rounded-[20px] p-4 min-h-[105px] overflow-hidden">
          <Text className="text-codeText font-brand-mono text-[11px] leading-[19px]">
            {result.codePreview}
          </Text>
        </View>
      </ScrollView>

      <View className="bg-surface border-t-[1px] border-t-progressTrack flex-row gap-[10px] px-5 pt-3 pb-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to problem"
          onPress={() => router.back()}
          className="flex-1 min-h-12 border-[1px] border-fieldBorder rounded-[16px] items-center justify-center"
        >
          <Text className="text-text font-brand-medium text-[14px]">
            Problem
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open on Web, unavailable"
          accessibilityHint="A web editor link has not been provided for this demo"
          accessibilityState={{ disabled: true }}
          disabled
          className="flex-1 min-h-12 bg-primary opacity-[0.65] rounded-[16px] flex-row items-center justify-center gap-[7px]"
        >
          <Text className="text-surface font-brand-regular text-[14px]">
            Open on Web
          </Text>
          <SymbolView
            name={{
              ios: "arrow.up.right.square",
              android: "open_in_new",
              web: "open_in_new",
            }}
            size={17}
            tintColor={Brands.colors.surface}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
