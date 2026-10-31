import type { ReactElement } from "react";
import { Text, View } from "react-native";

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
}: MascotPlaceholderProps): ReactElement {
  return (
    <View
      className="items-center justify-center overflow-hidden bg-surface border-signInAccent border-[1px] border-dashed px-[18px]"
      style={{ width, height, borderRadius: compact ? 28 : 42 }}
    >
      <View
        pointerEvents="none"
        className="absolute top-0 right-0 bottom-0 left-0"
      >
        {STRIPES.map((index) => (
          <View
            key={index}
            className="absolute left-[-150px] w-[500px] h-[13px] bg-learnHighlight rotate-[-45deg]"
            style={{ top: index * 28 - 220 }}
          />
        ))}
      </View>
      <Text
        className={`text-primary font-brand-monoMedium text-center ${compact ? "text-[8px] tracking-[0.5px]" : "text-[10px] tracking-[1.5px]"}`}
      >
        {title}
      </Text>
      <Text
        className={`text-center ${compact ? "text-primary font-brand-monoMedium text-[8px] leading-[12px] mt-0" : "text-textSecondary font-brand-light text-[11px] leading-[20px] mt-[6px]"}`}
      >
        {description}
      </Text>
    </View>
  );
}
