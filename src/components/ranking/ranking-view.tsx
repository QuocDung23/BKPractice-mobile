import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import { Brands } from "@/lib/themes";

const FILTERS = ["My class", "Faculty", "All time"] as const;
const LEADERS = [
  { place: 2, name: "Thanh L.", initials: "TL", score: "2,480", color: "bg-practice", text: "text-homeBlueText" },
  { place: 1, name: "Minh A.", initials: "MA", score: "2,905", color: "bg-grow", text: "text-growText" },
  { place: 3, name: "Phuong D.", initials: "PD", score: "2,310", color: "bg-homePink", text: "text-homePinkText" },
] as const;
const ROWS = [
  { place: 4, initials: "TB", name: "Tran Bao Ngoc", detail: "5 quizzes · 31 problems", score: "2,140" },
  { place: 5, initials: "LN", name: "Le Nhat Nam", detail: "4 quizzes · 28 problems", score: "2,020" },
  { place: 6, initials: "HT", name: "Hoang Thao", detail: "6 quizzes · 25 problems", score: "1,980" },
  { place: 8, initials: "VK", name: "Vu Khanh", detail: "3 quizzes · 22 problems", score: "1,790" },
] as const;

export function RankingView(): ReactElement {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("My class");
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-5">
        <View className="bg-splash rounded-bl-[28px] rounded-br-[28px] px-3 pt-2 pb-4 overflow-hidden">
          <View pointerEvents="none" className="absolute w-20 h-20 rounded-full bg-homeHeaderAccent opacity-70 left-[-17px] top-[-28px]" />
          <View className="flex-row items-center justify-between h-8">
            <Text className="text-darkGreen font-brand-regular text-[20px] tracking-[-0.5px]">Ranking</Text>
            <Pressable accessibilityRole="button" className="h-9 rounded-full bg-surfaceTranslucent px-3 flex-row items-center gap-1.5">
              <SymbolView name={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }} size={16} tintColor={Brands.colors.darkGreen} />
              <Text className="text-darkGreen font-brand-medium text-[12px]">This week</Text>
            </Pressable>
          </View>
          <View className="flex-row gap-1.5 mt-2" accessibilityRole="tablist">
            {FILTERS.map((item) => (
              <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: filter === item }} onPress={() => setFilter(item)} className={`h-9 px-3 rounded-full items-center justify-center ${filter === item ? "bg-primary" : "bg-surfaceFaint"}`}>
                <Text className={`font-brand-regular text-[12px] ${filter === item ? "text-surface" : "text-splashText"}`}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <View className="flex-row items-end justify-center gap-2 mt-3">
            {LEADERS.map((leader) => (
              <View key={leader.place} className="flex-1 items-center gap-1">
                {leader.place === 1 && <SymbolView name={{ ios: "rosette", android: "workspace_premium", web: "workspace_premium" }} size={20} tintColor={Brands.colors.homeOrange} />}
                {leader.place !== 1 && <View className="h-5" />}
                <View className={`w-12 h-12 rounded-full border-2 border-white items-center justify-center ${leader.color}`}><Text className={`${leader.text} font-brand-medium text-[13px]`}>{leader.initials}</Text></View>
                <Text numberOfLines={1} className="text-darkGreen font-brand-medium text-[10px]">{leader.name}</Text>
                <View className={`w-full rounded-t-[14px] items-center justify-center gap-0.5 ${leader.place === 1 ? "h-14 bg-surface" : leader.place === 2 ? "h-10 bg-surfaceTranslucent" : "h-8 bg-surfaceFaint"}`}>
                  <Text className="text-primary font-brand-mono text-[16px]">{leader.place}</Text>
                  <Text className="text-textSecondary font-brand-mono text-[9px]">{leader.score}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="px-3 pt-3 pb-2">
          <View className="bg-primary rounded-[18px] px-3 py-2.5 flex-row items-center gap-2.5">
            <Text className="text-surface font-brand-mono text-sm">7</Text>
            <View className="w-9 h-9 rounded-full bg-surface items-center justify-center"><Text className="text-primary font-brand-regular text-xs">HN</Text></View>
            <View className="flex-1 gap-1"><Text className="text-surface font-brand-regular text-xs">You · Nguyen Van A</Text><View className="flex-row items-center gap-1"><SymbolView name={{ ios: "arrow.up.right", android: "trending_up", web: "trending_up" }} size={14} tintColor="#C8E7DE" /><Text className="text-[#C8E7DE] font-brand-light text-[10px]">Up 3 places this week</Text></View></View>
            <Text className="text-surface font-brand-mono text-xs">1,845</Text>
          </View>
        </View>
        <View className="px-3 gap-1 pb-6">
          {ROWS.map((row) => (
            <View key={row.place} className="h-[58px] bg-surface border border-progressTrack rounded-2xl px-2.5 flex-row items-center gap-2">
              <Text className="w-6 text-center text-textSecondary font-brand-monoMedium text-xs">{row.place}</Text>
              <View className="w-9 h-9 rounded-full bg-courseMint items-center justify-center"><Text className="text-primary font-brand-regular text-[11px]">{row.initials}</Text></View>
              <View className="flex-1"><Text className="text-text font-brand-medium text-xs">{row.name}</Text><Text className="text-textSecondary font-brand-light text-[10px]">{row.detail}</Text></View>
              <Text className="text-text font-brand-monoMedium text-xs">{row.score}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation active="Ranking" />
    </SafeAreaView>
  );
}
