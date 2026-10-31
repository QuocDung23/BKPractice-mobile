import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProblemData } from "@/hooks/problems/use-problem-data";
import { Brands } from "@/lib/themes";

export function ProblemDetailView(): ReactElement {
  const data = useProblemData();
  if (!data) return <Redirect href="/sign-in" />;

  const { detail } = data;
  const { problem } = detail;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="min-h-[57px] flex-row items-center px-2 border-b-[1px] border-b-progressTrack bg-surface">
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
        <Text
          className="flex-1 text-text font-brand-regular text-[15px]"
          numberOfLines={1}
        >
          {problem.title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Submission history"
          onPress={() => router.push("/submission-result")}
          className="w-11 h-11 items-center justify-center"
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
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-[15px] pb-6 gap-[13px]"
      >
        <View className="flex-row items-center gap-2">
          <View className="min-h-[25px] px-[10px] rounded-[13px] flex-row items-center gap-1 bg-warningBackground">
            <Text className="text-warningText font-brand-medium text-[11px]">
              {problem.difficulty}
            </Text>
          </View>
          <View className="min-h-[25px] px-[10px] rounded-[13px] flex-row items-center gap-1 bg-successBackground">
            <SymbolView
              name={{
                ios: "checkmark.circle",
                android: "check_circle",
                web: "check_circle",
              }}
              size={13}
              tintColor={Brands.colors.success}
            />
            <Text className="text-success font-brand-medium text-[11px]">
              {problem.state}
            </Text>
          </View>
          <View className="min-h-[25px] px-[10px] rounded-[13px] flex-row items-center gap-1 bg-resultRowBackground">
            <Text className="text-textSecondary font-brand-mono text-[10px]">
              {problem.topic}
            </Text>
          </View>
        </View>

        <Text className="text-text font-brand-regular text-[23px] tracking-[-0.5px] mt-[3px]">
          {problem.number}. {problem.title}
        </Text>
        <View className="flex-row items-center gap-[17px]">
          <Text className="text-textSecondary font-brand-mono text-[11px]">
            {detail.timeLimit} / {detail.memoryLimit}
          </Text>
          <Text className="text-textSecondary font-brand-mono text-[11px]">
            {problem.acceptancePercent}% acceptance
          </Text>
        </View>
        <Text className="text-textSupporting font-brand-light text-[15px] leading-[22px] mt-[1px]">
          {detail.statement}
        </Text>

        {detail.examples.map((example, index) => (
          <View key={index} className="gap-[7px]">
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

        <View className="gap-[6px]">
          <Text className="text-text font-brand-regular text-[15px]">
            Constraints
          </Text>
          {detail.constraints.map((constraint) => (
            <Text
              key={constraint}
              className="text-textSecondary font-brand-mono text-[11px]"
            >
              {constraint}
            </Text>
          ))}
        </View>

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
              You can read the problem and check results here. Open the web
              editor to write, run tests, and submit.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="bg-surface border-t-[1px] border-t-progressTrack flex-row gap-[10px] px-5 pt-3 pb-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View submission result"
          onPress={() => router.push("/submission-result")}
          className="h-12 min-w-28 border-[1px] border-fieldBorder rounded-[16px] flex-row items-center justify-center gap-[7px]"
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
