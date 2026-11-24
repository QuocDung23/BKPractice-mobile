import type { ReactElement } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type QuizExitConfirmationProps = {
  visible: boolean;
  onStay: () => void;
  onExit: () => void;
};

export function QuizExitConfirmation({
  visible,
  onStay,
  onExit,
}: QuizExitConfirmationProps): ReactElement {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onStay}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View
          accessibilityViewIsModal
          className="w-full max-w-[290px] overflow-hidden rounded-[22px] border border-fieldBorder bg-[#F5F5F7]"
        >
          <View className="gap-1.5 px-5 py-5">
            <Text accessibilityRole="header" className="text-center text-text font-brand-medium text-[17px] leading-6">
              Thoát khỏi quiz?
            </Text>
            <Text className="text-center text-textSupporting font-brand-regular text-[14px] leading-[21px]">
              Tiến độ đã lưu. Bạn có thể quay lại và tiếp tục sau.
            </Text>
          </View>
          <View className="flex-row border-t border-fieldBorder">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ở lại quiz"
              onPress={onStay}
              className="min-h-[52px] min-w-0 flex-1 items-center justify-center px-2 py-3 active:bg-progressTrack"
            >
              <Text className="text-successLabel text-center font-brand-medium text-[16px]">
                Ở lại
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thoát quiz"
              onPress={onExit}
              className="min-h-[52px] min-w-0 flex-1 items-center justify-center border-l border-fieldBorder px-2 py-3 active:bg-errorBackground"
            >
              <Text className="text-hardLabel text-center font-brand-regular text-[16px]">
                Thoát quiz
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
