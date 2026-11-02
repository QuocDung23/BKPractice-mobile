import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import { Brands } from "@/lib/themes";

const BADGES = [
  { ios: "checkmark.seal", android: "verified", label: "First accepted", color: "bg-grow", tint: Brands.colors.growText },
  { ios: "flame", android: "local_fire_department", label: "7-day streak", color: "bg-homePink", tint: Brands.colors.homePinkText },
  { ios: "sun.max", android: "wb_sunny", label: "Early bird", color: "bg-practice", tint: Brands.colors.homeBlueText },
  { ios: "medal", android: "military_tech", label: "Century club", color: "bg-courseMint", tint: Brands.colors.primary },
] as const;

const MENU = [
  { ios: "person", android: "person_outline", label: "Personal information", value: "" },
  { ios: "graduationcap", android: "school", label: "Class and faculty", value: "Class 24 · HCMUT" },
  { ios: "chevron.left.forwardslash.chevron.right", android: "code", label: "Default language", value: "C++17" },
] as const;

export function ProfileView(): ReactElement {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-6">
        <View className="bg-learn rounded-bl-[28px] rounded-br-[28px] px-3 pt-2 pb-5 gap-2">
          <View className="h-9 flex-row items-center justify-between">
            <Text className="text-text font-brand-regular text-[20px] tracking-[-0.5px]">Profile</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Settings" className="w-10 h-10 items-center justify-center"><SymbolView name={{ ios: "gearshape", android: "settings", web: "settings" }} size={21} tintColor={Brands.colors.text} /></Pressable>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="w-[66px] h-[66px] rounded-full bg-homePink border-2 border-white items-center justify-center"><Text className="text-avatarText font-brand-regular text-xl">HN</Text></View>
            <View className="flex-1 gap-1"><Text className="text-text font-brand-regular text-[17px]">Nguyen Van A</Text><Text className="text-textSecondary font-brand-mono text-[10px]">Student · Class 24</Text><View className="self-start rounded-full bg-surface px-2.5 py-1 flex-row items-center gap-1"><SymbolView name={{ ios: "star.fill", android: "star", web: "star" }} size={12} tintColor={Brands.colors.homeOrange} /><Text className="text-text font-brand-medium text-[10px]">Level 8 · Problem solver</Text></View></View>
          </View>
        </View>
        <View className="px-3 pt-3 gap-2">
          <View className="flex-row gap-2">
            {[["104", "Solved"], ["#7", "Class rank"], ["86%", "Quiz avg"]].map(([value, label]) => (
              <View key={label} className="flex-1 rounded-[18px] border border-border bg-surface p-3 gap-1"><Text className="text-primary font-brand-mono text-lg">{value}</Text><Text className="text-textSecondary font-brand-light text-[10px]">{label}</Text></View>
            ))}
          </View>
          <View className="bg-surface border border-border rounded-[20px] p-3 gap-2">
            <View className="flex-row items-center justify-between"><Text className="text-text font-brand-regular text-xs">Badges</Text><Pressable accessibilityRole="link" className="min-h-11 justify-center"><Text className="text-primary font-brand-medium text-[11px]">See all 12</Text></Pressable></View>
            <View className="flex-row gap-2">
              {BADGES.map((badge) => <View key={badge.label} className={`flex-1 h-12 rounded-2xl items-center justify-center ${badge.color}`}><SymbolView name={{ ios: badge.ios, android: badge.android, web: badge.android }} size={21} tintColor={badge.tint} /></View>)}
            </View>
          </View>
          <View className="bg-surface border border-border rounded-[20px] overflow-hidden">
            {MENU.map((item, index) => (
              <Pressable key={item.label} accessibilityRole="button" className={`min-h-[54px] px-3 flex-row items-center gap-3 ${index < MENU.length - 1 ? "border-b border-[#F3F8F6]" : ""}`}>
                <View className="w-9 h-9 rounded-xl bg-componentBackground items-center justify-center"><SymbolView name={{ ios: item.ios, android: item.android, web: item.android }} size={19} tintColor={Brands.colors.primary} /></View>
                <Text className="flex-1 text-text font-brand-regular text-xs">{item.label}</Text>
                {item.value ? <Text className="text-textSecondary font-brand-mono text-[10px]">{item.value}</Text> : null}
                <SymbolView name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }} size={18} tintColor={Brands.colors.lockedText} />
              </Pressable>
            ))}
          </View>
          <Pressable accessibilityRole="button" className="h-12 rounded-2xl border border-errorBorder bg-errorBackground flex-row items-center justify-center gap-2"><SymbolView name={{ ios: "rectangle.portrait.and.arrow.right", android: "logout", web: "logout" }} size={19} tintColor={Brands.colors.error} /><Text className="text-error font-brand-medium text-xs">Sign out</Text></Pressable>
        </View>
      </ScrollView>
      <BottomNavigation active="Profile" />
    </SafeAreaView>
  );
}
