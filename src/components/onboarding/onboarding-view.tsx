import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MascotPlaceholder } from '@/components/ui';
import { BrandColors, BrandFonts } from '@/lib/theme';

const slides = [
  {
    title: 'Learn step by step.',
    description: 'Follow the course path your lecturer assigns. Short lessons, worked examples, then practice — in that order.',
    artTitle: 'BYTEY · LEARN',
    artDescription: 'Bytey reading a book with lesson cards',
    background: BrandColors.learn,
    decoration: '{ }',
    decorationColor: BrandColors.primary,
    endDecoration: '✦',
  },
  {
    title: 'Practice with confidence.',
    description: 'Read problems and check your results on mobile. Tap Open on Web to write, run, and submit code in the full editor.',
    artTitle: 'CODE CHALLENGE',
    artDescription: 'Bytey at a terminal, tests passing',
    background: BrandColors.practice,
    decoration: '</>',
    decorationColor: '#2F6A8C',
    endDecoration: '$ run',
  },
  {
    title: 'Watch your skills grow.',
    description: 'Streaks, badges, and a weekly progress ring so you always know where you stand in the class.',
    artTitle: 'BYTEY · GROW',
    artDescription: 'Trophy, rising chart, badge shelf',
    background: BrandColors.grow,
    decoration: '✦',
    decorationColor: '#8A8F4E',
    endDecoration: '♥',
  },
] as const;

export function OnboardingView() {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLastStep = step === slides.length - 1;

  function goForward(): void {
    if (isLastStep) router.replace('/sign-in');
    else setStep(step + 1);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          {!isLastStep && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              onPress={() => router.replace('/sign-in')}
              style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>

        <View style={[styles.artPanel, { backgroundColor: slide.background }]}>
          <Text style={[styles.artDecoration, styles.artDecorationTop, { color: slide.decorationColor }]}>
            {slide.decoration}
          </Text>
          <MascotPlaceholder
            title={slide.artTitle}
            description={slide.artDescription}
            width={200}
            height={200}
          />
          <Text style={[styles.artDecoration, styles.artDecorationBottom, { color: slide.decorationColor }]}>
            {slide.endDecoration}
          </Text>
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>
          {step === 1 ? (
            <>
              Read problems and check your results on mobile. Tap{' '}
              <Text style={styles.descriptionHighlight}>Open on Web</Text> to write, run, and submit code in the full editor.
            </>
          ) : (
            slide.description
          )}
        </Text>

        {isLastStep ? (
          <View style={styles.lastActions}>
            <Pressable
              accessibilityRole="button"
              onPress={goForward}
              style={({ pressed }) => [styles.primaryButton, styles.fullButton, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Get Started</Text>
              <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }} size={19} tintColor={BrandColors.surface} />
            </Pressable>
            <View style={styles.progress} accessibilityLabel="Onboarding step 3 of 3">
              {slides.map((item, index) => (
                <View key={item.title} style={[styles.progressDot, index === step && styles.progressActive]} />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.actions}>
            <View style={styles.progress} accessibilityLabel={`Onboarding step ${step + 1} of 3`}>
              {slides.map((item, index) => (
                <View key={item.title} style={[styles.progressDot, index === step && styles.progressActive]} />
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={goForward}
              style={({ pressed }) => [styles.primaryButton, styles.continueButton, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Continue</Text>
              <SymbolView name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }} size={19} tintColor={BrandColors.surface} />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BrandColors.surface },
  content: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  topRow: { height: 44, alignItems: 'flex-end', justifyContent: 'center' },
  skipButton: { minWidth: 56, minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' },
  skipText: { color: BrandColors.textSecondary, fontFamily: BrandFonts.medium, fontSize: 15 },
  artPanel: {
    flex: 1,
    minHeight: 245,
    maxHeight: 490,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 42,
    overflow: 'hidden',
  },
  artDecoration: {
    position: 'absolute',
    opacity: 0.32,
    fontFamily: BrandFonts.mono,
    fontSize: 18,
  },
  artDecorationTop: { left: 25, top: 20 },
  artDecorationBottom: { right: 25, bottom: 18, fontSize: 15 },
  title: {
    marginTop: 29,
    color: BrandColors.text,
    fontFamily: BrandFonts.regular,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -1,
  },
  description: {
    minHeight: 74,
    marginTop: 11,
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 15,
    lineHeight: 21,
  },
  descriptionHighlight: { color: BrandColors.primary, fontFamily: BrandFonts.medium },
  actions: {
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastActions: { marginTop: 17, alignItems: 'center', gap: 14 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  progressDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: BrandColors.progressInactive },
  progressActive: { width: 21, backgroundColor: BrandColors.primary },
  primaryButton: {
    height: 52,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: BrandColors.primary,
    shadowColor: BrandColors.primary,
    shadowOpacity: 0.24,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 4,
  },
  continueButton: { minWidth: 248 },
  fullButton: { alignSelf: 'stretch' },
  buttonText: { color: BrandColors.surface, fontFamily: BrandFonts.regular, fontSize: 16 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.98 }] },
});
