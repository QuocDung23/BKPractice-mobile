import { Redirect, useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";

import { CourseDetailView } from "@/components/courses";

export default function CourseDetailRoute(): ReactElement {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  return typeof id === "string" && id ? <CourseDetailView id={id} /> : <Redirect href="/courses" />;
}
