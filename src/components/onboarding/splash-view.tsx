import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark, MascotPlaceholder } from '@/components/ui';
import { BrandColors, BrandFonts } from '@/lib/theme';

export function SplashView() {
  useEffect(() => {
    const timeout = setTimeout(() => router.replace('/onboarding'), 1700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View pointerEvents="none" style={[styles.circle, styles.circleTop]} />
      <View pointerEvents="none" style={[styles.circle, styles.circleBottom]} />
      <Text style={[styles.decoration, styles.codeTop]}>{'</>'}</Text>
      <Text style={[styles.decoration, styles.braces]}>{'{ }'}</Text>
      <Text style={[styles.decoration, styles.terminal]}>{'$_'}</Text>
      <Text style={[styles.decoration, styles.star]}>{'✦'}</Text>
      <Text style={[styles.decoration, styles.semicolon]}>{';;'}</Text>

      <View style={styles.content}>
        <MascotPlaceholder title="BYTEY" description="waving mascot art" width={130} height={130} />
        <View style={styles.brandRow}>
          <BrandMark size={38} />
          <Text style={styles.brandName}>BKPractice</Text>
        </View>
        <Text style={styles.tagline}>Grow your coding skills.</Text>
        <View style={styles.dots} accessibilityLabel="Loading BKPractice">
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotMiddle]} />
          <View style={[styles.dot, styles.dotLast]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BrandColors.splash,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 35,
  },
  circle: {
    position: 'absolute',
    backgroundColor: BrandColors.splashAccent,
    borderRadius: 150,
  },
  circleTop: {
    width: 220,
    height: 220,
    right: -70,
    top: -70,
    opacity: 0.6,
  },
  circleBottom: {
    width: 240,
    height: 240,
    left: -75,
    bottom: -95,
    opacity: 0.5,
  },
  decoration: {
    position: 'absolute',
    color: BrandColors.primary,
    opacity: 0.2,
    fontFamily: BrandFonts.mono,
  },
  codeTop: { top: 80, left: 34, fontSize: 25 },
  braces: { top: 165, right: 43, fontSize: 20 },
  terminal: { top: '37%', left: 20, fontSize: 15 },
  star: { bottom: '27%', right: 34, fontSize: 24 },
  semicolon: { bottom: '18%', left: 52, fontSize: 17 },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 28,
  },
  brandName: {
    color: BrandColors.darkGreen,
    fontFamily: BrandFonts.regular,
    fontSize: 30,
    letterSpacing: -1.4,
  },
  tagline: {
    color: '#2F6459',
    fontFamily: BrandFonts.light,
    fontSize: 15,
    marginTop: 5,
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: 67 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: BrandColors.primary },
  dotMiddle: { opacity: 0.5 },
  dotLast: { opacity: 0.25 },
});
