import { Redirect, router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FeedbackBanner } from "@/components/ui";
import { useProfile, useProfileEditor } from "@/hooks/auth";
import type { Profile } from "@/domain/auth";
import { initialsOf } from "@/lib/profile";
import { Brands } from "@/lib/themes";

function ProfileEditForm({ profile }: { profile: Profile }): ReactElement {
  const editor = useProfileEditor(profile);

  async function save(): Promise<void> {
    const saved = await editor.save();
    if (!saved) return;
    if (router.canGoBack()) router.back();
    else router.replace("/profile");
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-5 pb-8"
      keyboardShouldPersistTaps="handled"
    >
      <View className="items-center gap-3 py-6">
        <View className="w-[96px] h-[96px] rounded-full bg-homePink border-2 border-surface items-center justify-center overflow-hidden">
          {editor.avatarUri ? (
            <Image
              accessibilityLabel="Your avatar"
              source={{ uri: editor.avatarUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-avatarText font-brand-regular text-[28px]">
              {initialsOf(editor.displayName || profile.displayName)}
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-5">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: editor.isUploadingAvatar,
              busy: editor.isUploadingAvatar,
            }}
            disabled={editor.isUploadingAvatar}
            onPress={() => editor.pickAvatar()}
            className="min-h-11 justify-center"
          >
            <Text className="text-primary font-brand-medium text-[14px]">
              {editor.isUploadingAvatar ? "Uploading…" : "Change photo"}
            </Text>
          </Pressable>
          {editor.avatarUri ? (
            <Pressable
              accessibilityRole="button"
              disabled={editor.isUploadingAvatar}
              onPress={editor.removeAvatar}
              className="min-h-11 justify-center"
            >
              <Text className="text-error font-brand-medium text-[14px]">
                Remove
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View className="gap-4">
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-text font-brand-medium text-[13px]">
              Display name
            </Text>
            <Text className="text-textMuted font-brand-mono text-[10px]">
              {editor.displayName.length}/100
            </Text>
          </View>
          <View className="h-[52px] border-fieldBorder border-[1px] rounded-[28px] flex-row items-center gap-[11px] pl-[17px] pr-[10px] bg-surface">
            <SymbolView
              name={{ ios: "person", android: "person", web: "person" }}
              size={19}
              tintColor={Brands.colors.textMuted}
            />
            <TextInput
              accessibilityLabel="Display name"
              autoCapitalize="words"
              editable={!editor.isSaving}
              maxLength={100}
              onChangeText={editor.setDisplayName}
              placeholder="Your name"
              placeholderTextColor={Brands.colors.textMuted}
              className="flex-1 min-w-0 text-text font-brand-regular text-[15px] py-0"
              value={editor.displayName}
            />
          </View>
        </View>

        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-text font-brand-medium text-[13px]">
              Bio
            </Text>
            <Text className="text-textMuted font-brand-mono text-[10px]">
              {editor.bio.length}/1000
            </Text>
          </View>
          <View className="rounded-[20px] border-[1px] border-fieldBorder bg-surface p-3">
            <TextInput
              accessibilityLabel="Bio"
              editable={!editor.isSaving}
              maxLength={1000}
              multiline
              onChangeText={editor.setBio}
              placeholder="A short line about what you're learning."
              placeholderTextColor={Brands.colors.textMuted}
              style={{ minHeight: 92, textAlignVertical: "top" }}
              className="text-text font-brand-regular text-[15px] leading-[22px] p-0"
              value={editor.bio}
            />
          </View>
        </View>

        {editor.error ? (
          <FeedbackBanner message={editor.error} tone="error" />
        ) : null}
        {editor.notice ? (
          <FeedbackBanner message={editor.notice} tone="notice" />
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            disabled: editor.isSaving || editor.isUploadingAvatar,
            busy: editor.isSaving,
          }}
          disabled={editor.isSaving || editor.isUploadingAvatar}
          onPress={() => save()}
          className={`h-[52px] rounded-[28px] bg-primary items-center justify-center active:opacity-[0.84] active:scale-[0.98] ${
            editor.isSaving || editor.isUploadingAvatar
              ? "opacity-[0.72]"
              : ""
          }`}
        >
          {editor.isSaving ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator size="small" color={Brands.colors.surface} />
              <Text className="text-surface font-brand-regular text-[16px]">
                Saving…
              </Text>
            </View>
          ) : (
            <Text className="text-surface font-brand-regular text-[16px]">
              Save changes
            </Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/profile")
          }
          className="min-h-11 items-center justify-center"
        >
          <Text className="text-textSecondary font-brand-medium text-[14px]">
            Cancel
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export function ProfileEditView(): ReactElement {
  const { profile, isLoading, error, reload } = useProfile();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="px-5 pt-2 pb-2 h-[56px] flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/profile")
            }
            className="w-11 h-11 -ml-2 items-center justify-center active:opacity-[0.7]"
          >
            <SymbolView
              name={{
                ios: "chevron.left",
                android: "arrow_back",
                web: "arrow_back",
              }}
              size={21}
              tintColor={Brands.colors.text}
            />
          </Pressable>
          <Text className="text-text font-brand-regular text-[18px] tracking-[-0.4px]">
            Edit profile
          </Text>
          <View className="w-11" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center gap-3">
            <ActivityIndicator size="small" color={Brands.colors.primary} />
            <Text className="text-textSecondary font-brand-light text-[13px]">
              Loading your profile…
            </Text>
          </View>
        ) : error && !profile ? (
          <View className="flex-1 px-5 gap-4 pt-6">
            <FeedbackBanner message={error} tone="error" />
            <Pressable
              accessibilityRole="button"
              onPress={reload}
              className="h-[48px] rounded-[24px] border-fieldBorder border-[1px] bg-surface items-center justify-center"
            >
              <Text className="text-primary font-brand-medium text-[14px]">
                Try again
              </Text>
            </Pressable>
          </View>
        ) : profile ? (
          <ProfileEditForm profile={profile} />
        ) : (
          <Redirect href="/sign-in" />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
