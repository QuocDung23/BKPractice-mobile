import { SymbolView } from "expo-symbols";
import type { ReactElement } from "react";
import { Pressable } from "react-native";

import { Brands } from "@/lib/themes";

type PasswordVisibilityToggleProps = {
  passwordVisible: boolean;
  onToggle: () => void;
};

export function PasswordVisibilityToggle({
  passwordVisible,
  onToggle,
}: PasswordVisibilityToggleProps): ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={passwordVisible ? "Hide password" : "Show password"}
      onPress={onToggle}
      className="w-11 h-11 items-center justify-center"
    >
      <SymbolView
        name={{
          ios: passwordVisible ? "eye" : "eye.slash",
          android: passwordVisible ? "visibility" : "visibility_off",
          web: passwordVisible ? "visibility" : "visibility_off",
        }}
        size={21}
        tintColor={Brands.colors.textSecondary}
      />
    </Pressable>
  );
}
