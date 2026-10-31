import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { Brands } from "@/lib/themes";

type BottomNavigationProps = { active: "Home" | "Courses" | "Quiz" };

const TABS = [
  { label: "Home", ios: "house", android: "home", href: "/home" },
  {
    label: "Courses",
    ios: "book.closed",
    android: "menu_book",
    href: "/courses",
  },
  {
    label: "Quiz",
    ios: "checkmark.circle",
    android: "task_alt",
    href: "/quizzes",
  },
  { label: "Ranking", ios: "chart.bar", android: "leaderboard", href: null },
  { label: "Profile", ios: "person", android: "person", href: null },
] as const;

export function BottomNavigation({
  active,
}: BottomNavigationProps): ReactElement {
  return (
    <View
      className="h-[66px] border-t-[1px] border-t-progressTrack bg-surface flex-row items-start pt-2"
      accessibilityRole="tablist"
    >
      {TABS.map((tab) => {
        const selected = tab.label === active;
        return (
          <Pressable
            key={tab.label}
            accessibilityRole="tab"
            accessibilityLabel={
              tab.href ? tab.label : `${tab.label}, coming soon`
            }
            accessibilityState={{ selected, disabled: !tab.href }}
            disabled={!tab.href}
            onPress={() => tab.href && router.navigate(tab.href)}
            className="flex-1 items-center gap-[3px] min-h-12"
          >
            <View
              className={`w-[58px] h-[30px] rounded-[15px] items-center justify-center ${selected ? "bg-courseMint" : ""}`}
            >
              <SymbolView
                name={{ ios: tab.ios, android: tab.android, web: tab.android }}
                size={22}
                tintColor={
                  selected ? Brands.colors.primary : Brands.colors.textMuted
                }
              />
            </View>
            <Text
              className={`text-[10px] ${selected ? "text-primary font-brand-medium" : "text-textMuted font-brand-light"}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
