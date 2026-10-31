import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState, type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MascotPlaceholder } from "@/components/ui";
import { Brands } from "@/lib/themes";

const slides = [
  {
    title: "Learn step by step.",
    description:
      "Follow the course path your lecturer assigns. Short lessons, worked examples, then practice — in that order.",
    artTitle: "BYTEY · LEARN",
    artDescription: "Bytey reading a book with lesson cards",
    background: Brands.colors.learn,
    decoration: "{ }",
    decorationColor: Brands.colors.primary,
    endDecoration: "✦",
  },
  {
    title: "Practice with confidence.",
    description:
      "Read problems and check your results on mobile. Tap Open on Web to write, run, and submit code in the full editor.",
    artTitle: "CODE CHALLENGE",
    artDescription: "Bytey at a terminal, tests passing",
    background: Brands.colors.practice,
    decoration: "</>",
    decorationColor: Brands.colors.homeBlueText,
    endDecoration: "$ run",
  },
  {
    title: "Watch your skills grow.",
    description:
      "Streaks, badges, and a weekly progress ring so you always know where you stand in the class.",
    artTitle: "BYTEY · GROW",
    artDescription: "Trophy, rising chart, badge shelf",
    background: Brands.colors.grow,
    decoration: "✦",
    decorationColor: Brands.colors.growText,
    endDecoration: "♥",
  },
] as const;

export function OnboardingView(): ReactElement {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLastStep = step === slides.length - 1;

  function goForward(): void {
    if (isLastStep) router.replace("/sign-in");
    else setStep(step + 1);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 px-5 pb-5">
        <View className="h-11 items-end justify-center">
          {!isLastStep && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              onPress={() => router.replace("/sign-in")}
              className="min-w-14 min-h-11 items-end justify-center active:opacity-[0.84] active:scale-[0.98]"
            >
              <Text className="text-textSecondary font-brand-medium text-[15px]">
                Skip
              </Text>
            </Pressable>
          )}
        </View>

        <View
          className="flex-1 min-h-[245px] max-h-[490px] items-center justify-center rounded-[42px] overflow-hidden"
          style={{ backgroundColor: slide.background }}
        >
          <Text
            className="absolute opacity-[0.32] font-brand-mono text-[18px] left-[25px] top-5"
            style={{ color: slide.decorationColor }}
          >
            {slide.decoration}
          </Text>
          <MascotPlaceholder
            title={slide.artTitle}
            description={slide.artDescription}
            width={200}
            height={200}
          />
          <Text
            className="absolute opacity-[0.32] font-brand-mono text-[15px] right-[25px] bottom-[18px]"
            style={{ color: slide.decorationColor }}
          >
            {slide.endDecoration}
          </Text>
        </View>

        <Text className="mt-[29px] text-text font-brand-regular text-[27px] leading-[34px] tracking-[-1px]">
          {slide.title}
        </Text>
        <Text className="min-h-[74px] mt-[11px] text-textSecondary font-brand-light text-[15px] leading-[21px]">
          {step === 1 ? (
            <>
              Read problems and check your results on mobile. Tap{" "}
              <Text className="text-primary font-brand-medium">
                Open on Web
              </Text>{" "}
              to write, run, and submit code in the full editor.
            </>
          ) : (
            slide.description
          )}
        </Text>

        {isLastStep ? (
          <View className="mt-[17px] items-center gap-[14px]">
            <Pressable
              accessibilityRole="button"
              onPress={goForward}
              className="h-[52px] rounded-[28px] flex-row items-center justify-center gap-[9px] bg-primary self-stretch active:opacity-[0.84] active:scale-[0.98]"
              style={{
                shadowColor: Brands.colors.primary,
                shadowOpacity: 0.24,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              <Text className="text-surface font-brand-regular text-[16px]">
                Get Started
              </Text>
              <SymbolView
                name={{
                  ios: "arrow.right",
                  android: "arrow_forward",
                  web: "arrow_forward",
                }}
                size={19}
                tintColor={Brands.colors.surface}
              />
            </Pressable>
            <View
              className="flex-row items-center gap-[7px]"
              accessibilityLabel="Onboarding step 3 of 3"
            >
              {slides.map((item, index) => (
                <View
                  key={item.title}
                  className={`h-[7px] rounded-[4px] ${index === step ? "w-[21px] bg-primary" : "w-[7px] bg-progressInactive"}`}
                />
              ))}
            </View>
          </View>
        ) : (
          <View className="mt-[17px] flex-row items-center justify-between">
            <View
              className="flex-row items-center gap-[7px]"
              accessibilityLabel={`Onboarding step ${step + 1} of 3`}
            >
              {slides.map((item, index) => (
                <View
                  key={item.title}
                  className={`h-[7px] rounded-[4px] ${index === step ? "w-[21px] bg-primary" : "w-[7px] bg-progressInactive"}`}
                />
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={goForward}
              className="h-[52px] rounded-[28px] flex-row items-center justify-center gap-[9px] bg-primary min-w-[248px] active:opacity-[0.84] active:scale-[0.98]"
              style={{
                shadowColor: Brands.colors.primary,
                shadowOpacity: 0.24,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              <Text className="text-surface font-brand-regular text-[16px]">
                Continue
              </Text>
              <SymbolView
                name={{
                  ios: "arrow.right",
                  android: "arrow_forward",
                  web: "arrow_forward",
                }}
                size={19}
                tintColor={Brands.colors.surface}
              />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
