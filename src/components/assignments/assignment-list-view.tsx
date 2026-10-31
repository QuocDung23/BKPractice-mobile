import { Redirect } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AssignmentGroup } from "@/domain/assignments";
import { useAssignmentData } from "@/hooks/assignments";
import { Brands } from "@/lib/themes";

import { AssignmentCard } from "./assignment-card";

const GROUPS: readonly AssignmentGroup[] = ["DUE SOON", "OVERDUE", "COMPLETED"];

export function AssignmentListView(): ReactElement {
  const data = useAssignmentData();
  if (!data) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-5 pt-1 pb-5 bg-surface border-b-[1px] border-b-progressTrack gap-[6px]">
        <View className="min-h-[51px] flex-row items-center justify-between">
          <Text className="text-text font-brand-regular text-[22px] tracking-[-0.5px]">
            Assignments
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filter assignments, coming soon"
            accessibilityState={{ disabled: true }}
            disabled
            className="w-11 h-11 items-center justify-center mr-[-10px]"
          >
            <SymbolView
              name={{
                ios: "line.3.horizontal.decrease",
                android: "filter_list",
                web: "filter_list",
              }}
              size={22}
              tintColor={Brands.colors.text}
            />
          </Pressable>
        </View>
        <View className="flex-row gap-[9px]">
          <View className="flex-1 min-w-0 rounded-[17px] px-[11px] py-2 bg-warningBackground">
            <Text className="font-brand-mono text-[18px] text-warningLabel">
              {data.dueSoonCount}
            </Text>
            <Text className="text-warningLabel font-brand-light text-[11px]">
              due soon
            </Text>
          </View>
          <View className="flex-1 min-w-0 rounded-[17px] px-[11px] py-2 bg-hardBackground">
            <Text className="font-brand-mono text-[18px] text-hardLabel">
              {data.overdueCount}
            </Text>
            <Text className="text-hardLabel font-brand-light text-[11px]">
              overdue
            </Text>
          </View>
          <View className="flex-1 min-w-0 rounded-[17px] px-[11px] py-2 bg-successBackground">
            <Text className="font-brand-mono text-[18px] text-successLabel">
              {data.completedCount}
            </Text>
            <Text className="text-successLabel font-brand-light text-[11px]">
              completed
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-5 pt-4 pb-[30px] gap-5"
      >
        {GROUPS.map((group) => (
          <View key={group} className="gap-[10px]">
            <Text className="text-textSupporting font-brand-regular text-[12px] tracking-[0.9px]">
              {group}
            </Text>
            {data.assignments
              .filter((assignment) => assignment.group === group)
              .map((assignment) => (
                <AssignmentCard
                  key={`${assignment.code}-${assignment.label}`}
                  assignment={assignment}
                />
              ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
