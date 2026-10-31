import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BrandColors, BrandFonts } from "@/lib/themes/theme";

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
    <View style={styles.bar} accessibilityRole="tablist">
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
            style={styles.tab}
          >
            <View style={[styles.icon, selected && styles.iconActive]}>
              <SymbolView
                name={{ ios: tab.ios, android: tab.android, web: tab.android }}
                size={22}
                tintColor={
                  selected ? BrandColors.primary : BrandColors.textMuted
                }
              />
            </View>
            <Text style={[styles.label, selected && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 66,
    borderTopWidth: 1,
    borderTopColor: BrandColors.progressTrack,
    backgroundColor: BrandColors.surface,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: "center", gap: 3, minHeight: 48 },
  icon: {
    width: 58,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconActive: { backgroundColor: BrandColors.courseMint },
  label: {
    color: BrandColors.textMuted,
    fontFamily: BrandFonts.light,
    fontSize: 10,
  },
  labelActive: { color: BrandColors.primary, fontFamily: BrandFonts.medium },
});
