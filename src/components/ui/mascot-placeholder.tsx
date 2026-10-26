import { StyleSheet, Text, View } from 'react-native';

import { BrandColors, BrandFonts } from '@/lib/theme';

type MascotPlaceholderProps = {
  title: string;
  description: string;
  width: number;
  height: number;
  compact?: boolean;
};

const STRIPES = Array.from({ length: 18 }, (_, index) => index);

export function MascotPlaceholder({
  title,
  description,
  width,
  height,
  compact = false,
}: MascotPlaceholderProps) {
  return (
    <View style={[styles.tile, { width, height, borderRadius: compact ? 28 : 42 }]}>
      <View pointerEvents="none" style={styles.stripeContainer}>
        {STRIPES.map((index) => (
          <View key={index} style={[styles.stripe, { top: index * 28 - 220 }]} />
        ))}
      </View>
      <Text style={[styles.title, compact && styles.compactTitle]}>{title}</Text>
      <Text style={[styles.description, compact && styles.compactDescription]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: BrandColors.surface,
    borderColor: '#7FBFAE',
    borderWidth: 1,
    borderStyle: 'dashed',
    paddingHorizontal: 18,
  },
  stripeContainer: { ...StyleSheet.absoluteFill },
  stripe: {
    position: 'absolute',
    left: -150,
    width: 500,
    height: 13,
    backgroundColor: '#F2FAF7',
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    color: BrandColors.primary,
    fontFamily: BrandFonts.monoMedium,
    fontSize: 10,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  compactTitle: {
    fontSize: 8,
    letterSpacing: 0.5,
  },
  description: {
    color: BrandColors.textSecondary,
    fontFamily: BrandFonts.light,
    fontSize: 11,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 6,
  },
  compactDescription: {
    color: BrandColors.primary,
    fontFamily: BrandFonts.monoMedium,
    fontSize: 8,
    lineHeight: 12,
    marginTop: 0,
  },
});
