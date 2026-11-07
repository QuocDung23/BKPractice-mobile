import type { ReactElement, ReactNode } from "react";
import { SymbolView } from "expo-symbols";
import { Text, TextInput, View } from "react-native";

import { Brands } from "@/lib/themes";

type InputFieldProps = {
  label?: string;
  icon?: React.ComponentProps<typeof SymbolView>["name"];
  iconTintColor?: string;
  borderColor?: string;
  rightElement?: ReactNode;
  wrapperClassName?: string;
  className?: string;
} & Omit<
  React.ComponentPropsWithoutRef<typeof TextInput>,
  "ref" | "className"
>;

export function InputField({
  label,
  icon,
  iconTintColor = Brands.colors.textMuted,
  borderColor = Brands.colors.fieldBorder,
  rightElement,
  wrapperClassName,
  className,
  ...textInputProps
}: InputFieldProps): ReactElement {
  return (
    <View className="gap-2">
      {label && (
        <Text className="text-text font-brand-medium text-[13px]">
          {label}
        </Text>
      )}
      <View
        className={`h-[52px] border-[1px] rounded-[28px] flex-row items-center gap-[11px] pl-[17px] pr-[10px] bg-surface ${wrapperClassName ?? ""}`}
        style={{ borderColor }}
      >
        {icon && (
          <SymbolView
            name={icon}
            size={19}
            tintColor={iconTintColor}
          />
        )}
        <TextInput
          {...textInputProps}
          className={`flex-1 min-w-0 text-text font-brand-regular text-[15px] py-0 ${className ?? ""}`}
        />
        {rightElement}
      </View>
    </View>
  );
}
