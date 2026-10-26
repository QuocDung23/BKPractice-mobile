import { StyleSheet, Text, View } from 'react-native';

import { BrandColors, BrandFonts } from '@/lib/theme';

type BrandMarkProps = {
  size: number;
};

export function BrandMark({ size }: BrandMarkProps) {
  return (
    <View style={[styles.mark, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.glyph, { fontSize: size * 0.39 }]}>{'</>'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.primary,
  },
  glyph: {
    color: BrandColors.surface,
    fontFamily: BrandFonts.monoBold,
    includeFontPadding: false,
  },
});
