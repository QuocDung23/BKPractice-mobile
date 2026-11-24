import { Redirect, useLocalSearchParams } from 'expo-router';
import type { ReactElement } from 'react';

import { ProblemDetailView } from '@/components/problems';

export default function ProblemDetailRoute(): ReactElement {
  const { idOrSlug } = useLocalSearchParams<{ idOrSlug?: string | string[] }>();
  return typeof idOrSlug === 'string' && idOrSlug ? (
    <ProblemDetailView idOrSlug={idOrSlug} />
  ) : (
    <Redirect href="/problems" />
  );
}
