import type { Config } from "tailwindcss";

import { Brands } from "./src/lib/themes";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: Brands.colors,
      fontFamily: {
        "brand-light": [Brands.fonts.light],
        "brand-regular": [Brands.fonts.regular],
        "brand-medium": [Brands.fonts.medium],
        "brand-mono": [Brands.fonts.mono],
        "brand-monoMedium": [Brands.fonts.monoMedium],
        "brand-monoBold": [Brands.fonts.monoBold],
      },
    },
  },
  plugins: [],
} satisfies Config;
