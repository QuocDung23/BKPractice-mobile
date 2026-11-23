import { router, type Href } from "expo-router";
import type { ReactElement, ReactNode } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CourseDetailLayoutProps = {
  title: string;
  backTo: Href;
  children: ReactNode;
};

export function CourseDetailLayout({
  title,
  backTo,
  children,
}: CourseDetailLayoutProps): ReactElement {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace(backTo)
        }
        className="min-h-11 justify-center self-start px-5"
      >
        <Text className="text-primary font-brand-medium">‹ Back</Text>
      </Pressable>
      <ScrollView
        className="flex-1 bg-background"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow px-5 pt-5 pb-8 gap-4"
      >
        <Text
          accessibilityRole="header"
          className="text-text font-brand-regular text-[24px]"
        >
          {title}
        </Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
