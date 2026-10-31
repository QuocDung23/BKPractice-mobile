import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { AssignmentSummary } from "@/domain/assignments";
import { Brands } from "@/lib/themes";

type AssignmentCardProps = { assignment: AssignmentSummary };

export function AssignmentCard({
  assignment,
}: AssignmentCardProps): ReactElement {
  const overdue = assignment.status === "Overdue";
  const completed = assignment.status === "Completed";
  const inProgress = assignment.status === "In Progress";
  const iconColor = overdue
    ? Brands.colors.hardText
    : completed
      ? Brands.colors.success
      : inProgress
        ? Brands.colors.primary
        : Brands.colors.textSecondary;
  const badgeColor = overdue
    ? Brands.colors.hardLabel
    : completed || inProgress
      ? Brands.colors.successLabel
      : Brands.colors.textSupporting;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${assignment.title}, ${assignment.status}, ${assignment.acceptedProblems} of ${assignment.totalProblems} problems${assignment.available ? "" : ", preview only"}`}
      accessibilityState={{ disabled: !assignment.available }}
      disabled={!assignment.available}
      onPress={() => router.push("/assignment-detail")}
      className={`rounded-[21px] border-[1px] bg-surface p-4 gap-3 active:opacity-[0.82] ${overdue ? "border-errorBorder" : "border-border"}`}
    >
      <View className="flex-row items-start gap-3">
        <View
          className={`w-[42px] h-[42px] rounded-[21px] items-center justify-center ${overdue ? "bg-hardBackground" : completed ? "bg-successBackground" : inProgress ? "bg-courseMint" : "bg-resultRowBackground"}`}
        >
          <SymbolView
            name={{
              ios: overdue
                ? "exclamationmark.circle"
                : completed
                  ? "checkmark.circle"
                  : "doc.text",
              android: overdue
                ? "error"
                : completed
                  ? "task_alt"
                  : "assignment",
              web: overdue ? "error" : completed ? "task_alt" : "assignment",
            }}
            size={22}
            tintColor={iconColor}
          />
        </View>
        <View className="flex-1 min-w-0 gap-[3px]">
          <Text className="text-textSupporting font-brand-mono text-[10px]">
            {assignment.code} · {assignment.label}
          </Text>
          <Text className="text-text font-brand-regular text-[15px] leading-[20px]">
            {assignment.title}
          </Text>
          <Text className="text-textSupporting font-brand-light text-[12px] leading-[17px]">
            {assignment.timing}
          </Text>
        </View>
        <View
          className={`rounded-[14px] px-2 py-[5px] ${overdue ? "bg-hardBackground" : completed ? "bg-successBackground" : inProgress ? "bg-courseMint" : "bg-resultRowBackground"}`}
        >
          <Text
            className="font-brand-medium text-[10px]"
            style={{ color: badgeColor }}
          >
            {assignment.status}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-[9px]">
        <View className="flex-1 h-[6px] rounded-[3px] bg-progressTrack overflow-hidden">
          <View
            className={`h-[6px] rounded-[3px] ${overdue ? "bg-error" : "bg-primary"}`}
            style={{
              width: `${(assignment.acceptedProblems / assignment.totalProblems) * 100}%`,
            }}
          />
        </View>
        <Text className="text-textSupporting font-brand-monoMedium text-[11px]">
          {assignment.acceptedProblems}/{assignment.totalProblems}
        </Text>
      </View>
    </Pressable>
  );
}
