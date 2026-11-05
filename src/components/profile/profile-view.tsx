import { router, useFocusEffect, type Href } from "expo-router";
import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useCallback, useRef, type ReactElement } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/navigation";
import { FeedbackBanner } from "@/components/ui";
import { useProfile, useSignOut } from "@/hooks/auth";
import { initialsOf } from "@/lib/profile";
import { Brands } from "@/lib/themes";
import { useAuthSession } from "@/stores/auth-session";

const BADGES = [
  {
    ios: "checkmark.seal",
    android: "verified",
    label: "First accepted",
    color: "bg-grow",
    tint: Brands.colors.growText,
  },
  {
    ios: "flame",
    android: "local_fire_department",
    label: "7-day streak",
    color: "bg-homePink",
    tint: Brands.colors.homePinkText,
  },
  {
    ios: "sun.max",
    android: "wb_sunny",
    label: "Early bird",
    color: "bg-practice",
    tint: Brands.colors.homeBlueText,
  },
  {
    ios: "medal",
    android: "military_tech",
    label: "Century club",
    color: "bg-courseMint",
    tint: Brands.colors.primary,
  },
] as const;

const MENU = [
  {
    ios: "person",
    android: "person_outline",
    label: "Personal information",
    value: "",
    href: "/profile-edit",
  },
  {
    ios: "lock",
    android: "lock",
    label: "Change password",
    value: "",
    href: "/change-password",
  },
  {
    ios: "graduationcap",
    android: "school",
    label: "Class and faculty",
    value: "Class 24 · HCMUT",
    href: null,
  },
  {
    ios: "chevron.left.forwardslash.chevron.right",
    android: "code",
    label: "Default language",
    value: "C++17",
    href: null,
  },
] as const;

export function ProfileView(): ReactElement {
  const { profile, isLoading, error, reload } = useProfile();
  const { session } = useAuthSession();
  const { isSigningOut, submitSignOut } = useSignOut();
  const hasFocused = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (hasFocused.current) reload();
      else hasFocused.current = true;
    }, [reload]),
  );

  const displayName = profile?.displayName ?? "Student";
  const studentId = session?.user.studentId;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-6"
      >
        <View className="bg-learn rounded-bl-[28px] rounded-br-[28px] px-3 pt-2 pb-5 gap-2">
          <View className="h-9 flex-row items-center justify-between">
            <Text className="text-text font-brand-regular text-[20px] tracking-[-0.5px]">
              Profile
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Settings"
              className="w-10 h-10 items-center justify-center"
            >
              <SymbolView
                name={{
                  ios: "gearshape",
                  android: "settings",
                  web: "settings",
                }}
                size={21}
                tintColor={Brands.colors.text}
              />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="w-[66px] h-[66px] rounded-full bg-homePink border-2 border-white items-center justify-center overflow-hidden">
              {profile?.avatar ? (
                <Image
                  accessibilityLabel="Your avatar"
                  source={profile.avatar}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              ) : isLoading && !profile ? (
                <ActivityIndicator
                  size="small"
                  color={Brands.colors.homePinkText}
                />
              ) : (
                <Text className="text-avatarText font-brand-regular text-xl">
                  {initialsOf(profile?.displayName ?? "")}
                </Text>
              )}
            </View>
            <View className="flex-1 gap-1">
              <Text
                accessibilityLabel={`Signed in as ${displayName}`}
                className="text-text font-brand-regular text-[17px]"
                numberOfLines={1}
              >
                {isLoading && !profile ? "Loading profile…" : displayName}
              </Text>
              <Text className="text-textSecondary font-brand-mono text-[10px]">
                {studentId ? `Student · ${studentId}` : "Student"}
              </Text>
              {profile?.bio ? (
                <Text
                  className="text-textSecondary font-brand-light text-[11px] leading-[16px]"
                  numberOfLines={2}
                >
                  {profile.bio}
                </Text>
              ) : (
                <View className="self-start rounded-full bg-surface px-2.5 py-1 flex-row items-center gap-1">
                  <SymbolView
                    name={{
                      ios: "star.fill",
                      android: "star",
                      web: "star",
                    }}
                    size={12}
                    tintColor={Brands.colors.homeOrange}
                  />
                  <Text className="text-text font-brand-medium text-[10px]">
                    Level 8 · Problem solver
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View className="px-3 pt-3 gap-2">
          {error ? (
            <View className="gap-2">
              <FeedbackBanner message={error} tone="error" />
              <Pressable
                accessibilityRole="button"
                onPress={reload}
                className="h-[44px] rounded-[22px] border border-fieldBorder bg-surface items-center justify-center"
              >
                <Text className="text-primary font-brand-medium text-[13px]">
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : null}

          <View className="flex-row gap-2">
            {[
              ["104", "Solved"],
              ["#7", "Class rank"],
              ["86%", "Quiz avg"],
            ].map(([value, label]) => (
              <View
                key={label}
                className="flex-1 rounded-[18px] border border-border bg-surface p-3 gap-1"
              >
                <Text className="text-primary font-brand-mono text-lg">
                  {value}
                </Text>
                <Text className="text-textSecondary font-brand-light text-[10px]">
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <View className="bg-surface border border-border rounded-[20px] p-3 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-text font-brand-regular text-xs">
                Badges
              </Text>
              <Pressable
                accessibilityRole="link"
                className="min-h-11 justify-center"
              >
                <Text className="text-primary font-brand-medium text-[11px]">
                  See all 12
                </Text>
              </Pressable>
            </View>
            <View className="flex-row gap-2">
              {BADGES.map((badge) => (
                <View
                  key={badge.label}
                  className={`flex-1 h-12 rounded-2xl items-center justify-center ${badge.color}`}
                >
                  <SymbolView
                    name={{
                      ios: badge.ios,
                      android: badge.android,
                      web: badge.android,
                    }}
                    size={21}
                    tintColor={badge.tint}
                  />
                </View>
              ))}
            </View>
          </View>

          <View className="bg-surface border border-border rounded-[20px] overflow-hidden">
            {MENU.map((item, index) => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                onPress={() =>
                  item.href ? router.push(item.href as Href) : undefined
                }
                className={`min-h-[54px] px-3 flex-row items-center gap-3 ${index < MENU.length - 1 ? "border-b border-[#F3F8F6]" : ""}`}
              >
                <View className="w-9 h-9 rounded-xl bg-componentBackground items-center justify-center">
                  <SymbolView
                    name={{
                      ios: item.ios,
                      android: item.android,
                      web: item.android,
                    }}
                    size={19}
                    tintColor={Brands.colors.primary}
                  />
                </View>
                <Text className="flex-1 text-text font-brand-regular text-xs">
                  {item.label}
                </Text>
                {item.value ? (
                  <Text className="text-textSecondary font-brand-mono text-[10px]">
                    {item.value}
                  </Text>
                ) : null}
                <SymbolView
                  name={{
                    ios: "chevron.right",
                    android: "chevron_right",
                    web: "chevron_right",
                  }}
                  size={18}
                  tintColor={Brands.colors.lockedText}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: isSigningOut,
              busy: isSigningOut,
            }}
            disabled={isSigningOut}
            onPress={() => submitSignOut()}
            className={`h-12 rounded-2xl border border-errorBorder bg-errorBackground flex-row items-center justify-center gap-2 ${
              isSigningOut ? "opacity-[0.7]" : ""
            }`}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" color={Brands.colors.error} />
            ) : (
              <SymbolView
                name={{
                  ios: "rectangle.portrait.and.arrow.right",
                  android: "logout",
                  web: "logout",
                }}
                size={19}
                tintColor={Brands.colors.error}
              />
            )}
            <Text className="text-error font-brand-medium text-xs">
              {isSigningOut ? "Signing out…" : "Sign out"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <BottomNavigation active="Profile" />
    </SafeAreaView>
  );
}
