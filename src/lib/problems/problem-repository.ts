import type {
  ProblemDifficulty,
  ProblemRepository,
  PublishedProblem,
  PublishedProblemDetail,
} from "@/domain/problems";
import {
  fetchLearning,
  readBoolean,
  readCount,
  readList,
  readObject,
  readOptionalText,
  readPage,
  readText,
} from "@/lib/learning";

function readUuid(value: unknown): string {
  const id = readText(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Expected a problem UUID");
  }
  return id.toLowerCase();
}

function readDifficulty(value: unknown): ProblemDifficulty {
  if (value === "EASY") return "Easy";
  if (value === "MEDIUM") return "Medium";
  if (value === "HARD") return "Hard";
  throw new Error("Expected a problem difficulty");
}

function readProblem(value: unknown): Omit<PublishedProblem, "solved"> {
  const problem = readObject(value);
  return {
    id: readUuid(problem.id),
    slug: readText(problem.slug),
    title: readText(problem.title),
    difficulty: readDifficulty(problem.difficulty),
    topics: readList(problem.topics, (topic) => {
      const item = readObject(topic);
      readText(item.id);
      return readText(item.name);
    }),
  };
}

function readProblemDetail(value: unknown): Omit<PublishedProblemDetail, "solved"> {
  const problem = readObject(value);
  const executionLimits = readObject(problem.executionLimits);
  const timeLimitMs = readCount(executionLimits.timeLimitMs);
  const memoryLimitMb = readCount(executionLimits.memoryLimitMb);
  if (!timeLimitMs || !memoryLimitMb) throw new Error("Expected positive execution limits");

  return {
    ...readProblem(problem),
    statement: readText(problem.statement),
    examples: readList(problem.examples, (example) => {
      const item = readObject(example);
      return { input: readText(item.input), output: readText(item.output) };
    }),
    constraints: readOptionalText(problem.constraints),
    timeLimitMs,
    memoryLimitMb,
  };
}

function readSolvedStatus(value: unknown): { problemId: string; solved: boolean } {
  const status = readObject(value);
  const problemId = readUuid(status.problemId);
  const solved = readBoolean(status.solved);
  const solvedAt = readOptionalText(status.solvedAt);
  if ((solved && !solvedAt) || (!solved && solvedAt !== null)) {
    throw new Error("Invalid problem progress status");
  }
  if (solvedAt && !Number.isFinite(Date.parse(solvedAt))) {
    throw new Error("Invalid problem progress date");
  }
  return { problemId, solved };
}

async function getSolvedStatuses(
  token: string,
  problemIds: readonly string[],
): Promise<boolean[]> {
  if (!problemIds.length) return [];
  return fetchLearning(
    token,
    {
      path: `/api/progress/me/problems/status?problemIds=${problemIds.join(",")}`,
    },
    (value) => {
      const statuses = readList(value, readSolvedStatus);
      if (
        statuses.length !== problemIds.length ||
        statuses.some((status, index) => status.problemId !== problemIds[index])
      ) {
        throw new Error("Problem progress did not match the requested problems");
      }
      return statuses.map((status) => status.solved);
    },
  );
}

export const problemRepository: ProblemRepository = {
  async list(token, page, filter) {
    const difficulty = filter === "All" ? "" : `&difficulty=${filter.toUpperCase()}`;
    const result = await fetchLearning(
      token,
      { path: `/api/problems?page=${page}&limit=20${difficulty}` },
      (value) => readPage(value, readProblem, "limit"),
    );
    const solved = await getSolvedStatuses(
      token,
      result.items.map((problem) => problem.id),
    );
    return {
      ...result,
      items: result.items.map((problem, index) => ({ ...problem, solved: solved[index] })),
    };
  },

  async get(token, idOrSlug) {
    const problem = await fetchLearning(
      token,
      { path: `/api/problems/${encodeURIComponent(idOrSlug)}` },
      (value) => {
        const detail = readProblemDetail(value);
        if (detail.id !== idOrSlug && detail.slug !== idOrSlug) {
          throw new Error("Problem details did not match the requested problem");
        }
        return detail;
      },
    );
    const [solved] = await getSolvedStatuses(token, [problem.id]);
    return { ...problem, solved };
  },
};
