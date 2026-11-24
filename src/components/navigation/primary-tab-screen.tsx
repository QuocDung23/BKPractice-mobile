import { router } from "expo-router";
import { useMemo, type ReactElement, type ReactNode } from "react";
import { PanResponder, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BottomNavigation,
  PRIMARY_TABS,
  type PrimaryTab,
} from "./bottom-navigation";

type PrimaryTabScreenProps = {
  active: PrimaryTab;
  className: string;
  children: ReactNode;
};

const SWIPE_SLOP = 12;
const SWIPE_DISTANCE = 48;

function createTabSwipe(
  active: PrimaryTab,
): ReturnType<typeof PanResponder.create>["panHandlers"] {
  const tabIndex = PRIMARY_TABS.findIndex((tab) => tab.label === active);
  let startX = 0;
  let startY = 0;
  let cancelled = false;

  return PanResponder.create({
    onStartShouldSetPanResponderCapture: ({ nativeEvent }) => {
      const { pageX, pageY } = nativeEvent;
      startX = pageX;
      startY = pageY;
      cancelled = false;
      return false;
    },
    onMoveShouldSetPanResponderCapture: ({ nativeEvent }, gesture) => {
      const dx = nativeEvent.pageX - startX;
      const dy = nativeEvent.pageY - startY;
      if (gesture.numberActiveTouches !== 1) cancelled = true;
      if (Math.abs(dy) >= SWIPE_SLOP && Math.abs(dy) >= Math.abs(dx)) {
        cancelled = true;
      }
      return !cancelled && Math.abs(dx) >= SWIPE_SLOP &&
        Math.abs(dx) >= Math.abs(dy) * 1.5;
    },
    onPanResponderStart: (_event, gesture) => {
      if (gesture.numberActiveTouches > 1) cancelled = true;
    },
    onPanResponderRelease: ({ nativeEvent }) => {
      const dx = nativeEvent.pageX - startX;
      const dy = nativeEvent.pageY - startY;
      if (
        cancelled ||
        Math.abs(dx) < SWIPE_DISTANCE ||
        Math.abs(dx) < Math.abs(dy) * 1.5
      ) return;

      const next = PRIMARY_TABS[tabIndex - Math.sign(dx)];
      if (next) {
        router.navigate({
          pathname: next.href,
          params: { tabSwipe: dx < 0 ? "left" : "right" },
        });
      }
    },
  }).panHandlers;
}

export function PrimaryTabScreen({
  active,
  className,
  children,
}: PrimaryTabScreenProps): ReactElement {
  const panHandlers = useMemo(() => createTabSwipe(active), [active]);

  return (
    <SafeAreaView edges={["top", "left", "right"]} className={`flex-1 ${className}`}>
      <View className="flex-1" {...panHandlers}>
        {children}
      </View>
      <BottomNavigation active={active} />
    </SafeAreaView>
  );
}
