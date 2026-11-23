export type LearningPage<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type LearningRequest<T> =
  | { status: "idle" | "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string; retryable: boolean };

export type LearningRequestResult<T> = {
  state: LearningRequest<T>;
  retry: () => void;
};
