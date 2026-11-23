import { Brands } from "@/lib/themes";

export const COURSE_VISUALS = [
  {
    symbol: { ios: "book.closed", android: "menu_book", web: "menu_book" },
    background: Brands.colors.courseMint,
    tint: Brands.colors.primary,
  },
  {
    symbol: { ios: "curlybraces", android: "code", web: "code" },
    background: Brands.colors.practice,
    tint: Brands.colors.homeBlueText,
  },
  {
    symbol: {
      ios: "point.3.connected.trianglepath.dotted",
      android: "account_tree",
      web: "account_tree",
    },
    background: Brands.colors.grow,
    tint: Brands.colors.growText,
  },
  {
    symbol: { ios: "square.grid.2x2", android: "widgets", web: "widgets" },
    background: Brands.colors.homePink,
    tint: Brands.colors.homePinkText,
  },
  {
    symbol: { ios: "function", android: "functions", web: "functions" },
    background: Brands.colors.splashAccent,
    tint: Brands.colors.splashText,
  },
  {
    symbol: { ios: "desktopcomputer", android: "computer", web: "computer" },
    background: Brands.colors.resultRowBackground,
    tint: Brands.colors.darkGreen,
  },
] as const;

export const COURSE_FILTERS = ["All", "In Progress", "Completed"] as const;
