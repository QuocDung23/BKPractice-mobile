import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brands } from "@/lib/themes";

export const PRIMARY_TABS = [
  { label: "Home", ios: "house", android: "home", href: "/home" },
  { label: "Courses", ios: "book.closed", android: "menu_book", href: "/courses" },
  { label: "Ranking", ios: "chart.bar", android: "leaderboard", href: "/ranking" },
  { label: "Profile", ios: "person", android: "person", href: "/profile" },
] as const;

export type PrimaryTab = (typeof PRIMARY_TABS)[number]["label"];

type BottomNavigationProps = {
  active?: PrimaryTab;
};

const DOCK_GAP = 8;

export function useBottomNavigationPadding(): number {
  const { bottom } = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  return bottom + 84 + Math.ceil(14 * Math.max(0, fontScale - 1));
}

export function BottomNavigation({
  active,
}: BottomNavigationProps): ReactElement {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tablist"
      className="flex-row gap-1 self-center rounded-full border border-border bg-surface p-1.5"
      style={[styles.dock, { bottom: bottom + DOCK_GAP }]}
    >
      {PRIMARY_TABS.map((tab) => {
        const selected = tab.label === active;
        return (
          <Pressable
            key={tab.label}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected }}
            onPress={() => {
              if (!selected) router.navigate(tab.href);
            }}
            className={`min-h-12 flex-1 items-center justify-center gap-0.5 rounded-full px-1 py-1 active:opacity-70 ${selected ? "bg-courseMint" : ""}`}
          >
            <SymbolView
              name={{ ios: tab.ios, android: tab.android, web: tab.android }}
              size={22}
              tintColor={selected ? Brands.colors.primary : Brands.colors.text}
            />
            <Text className="text-center font-brand-medium text-[11px] text-text">
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: "absolute",
    width: "92%",
    maxWidth: 440,
    boxShadow: "0 4px 14px rgba(31, 59, 51, 0.12)",
  },
});
