import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { AssignmentProblem } from "@/domain/assignments";
import { Brands } from "@/lib/themes";

type AssignmentProblemRowProps = { problem: AssignmentProblem };

export function AssignmentProblemRow({
  problem,
}: AssignmentProblemRowProps): ReactElement {
  const easy = problem.difficulty === "Easy";
  const hard = problem.difficulty === "Hard";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${problem.title}, ${problem.difficulty}, ${problem.accepted ? "accepted" : "not accepted"}, preview only`}
      accessibilityState={{ disabled: true }}
      disabled
      className="min-h-[49px] bg-surface border-[1px] border-border rounded-[22px] px-[14px] flex-row items-center gap-[10px]"
    >
      <SymbolView
        name={{
          ios: problem.accepted ? "checkmark.circle" : "circle",
          android: problem.accepted ? "check_circle" : "radio_button_unchecked",
          web: problem.accepted ? "check_circle" : "radio_button_unchecked",
        }}
        size={21}
        tintColor={
          problem.accepted ? Brands.colors.success : Brands.colors.lockedText
        }
      />
      <Text
        className="flex-1 text-text font-brand-regular text-[14px]"
        numberOfLines={2}
      >
        {problem.title}
      </Text>
      <View
        className={`rounded-[13px] px-2 py-1 ${easy ? "bg-successBackground" : hard ? "bg-hardBackground" : "bg-warningBackground"}`}
      >
        <Text
          className={`font-brand-medium text-[10px] ${easy ? "text-successLabel" : hard ? "text-hardLabel" : "text-warningLabel"}`}
        >
          {problem.difficulty}
        </Text>
      </View>
      <SymbolView
        name={{
          ios: "chevron.right",
          android: "chevron_right",
          web: "chevron_right",
        }}
        size={19}
        tintColor={Brands.colors.lockedText}
      />
    </Pressable>
  );
}
