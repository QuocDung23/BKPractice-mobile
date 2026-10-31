import type { ReactElement } from "react";
import { Text, View } from "react-native";

type BrandMarkProps = {
  size: number;
};

export function BrandMark({ size }: BrandMarkProps): ReactElement {
  return (
    <View
      className="items-center justify-center bg-primary"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text
        className="text-surface font-brand-monoBold"
        style={{ includeFontPadding: false, fontSize: size * 0.39 }}
      >
        {"</>"}
      </Text>
    </View>
  );
}
