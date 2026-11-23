import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

type LearningPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function LearningPagination({
  page, pageSize, total, onPageChange,
}: LearningPaginationProps): ReactElement | null {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  if (page === 1 && lastPage === 1) return null;
  return (
    <View className="flex-row justify-between items-center">
      <Pressable accessibilityRole="button" disabled={page <= 1}
        onPress={() => onPageChange(page - 1)} className="min-h-11 justify-center px-3 disabled:opacity-40">
        <Text className="text-primary font-brand-medium">Previous</Text>
      </Pressable>
      <Text className="text-textSecondary font-brand-regular">Page {page} of {lastPage}</Text>
      <Pressable accessibilityRole="button" disabled={page >= lastPage}
        onPress={() => onPageChange(page + 1)} className="min-h-11 justify-center px-3 disabled:opacity-40">
        <Text className="text-primary font-brand-medium">Next</Text>
      </Pressable>
    </View>
  );
}
