import { TestCaseScores } from "../../types";

export type SnakeCaseScores = Record<
  string,
  {
    expected_score: number | null;
    atla_score: number | null;
  }
>;

function toSnakeCaseScores(scores: TestCaseScores): SnakeCaseScores {
  return Object.entries(scores).reduce(
    (acc, [promptId, score]) => ({
      ...acc,
      [promptId]: {
        expected_score: score.expectedScore,
        atla_score: score.atlaScore,
      },
    }),
    {}
  );
}

function toCamelCaseScores(scores: SnakeCaseScores): TestCaseScores {
  return Object.entries(scores).reduce(
    (acc, [promptId, score]) => ({
      ...acc,
      [promptId]: {
        expectedScore: score.expected_score,
        atlaScore: score.atla_score,
      },
    }),
    {}
  );
}

export { toSnakeCaseScores, toCamelCaseScores };
