import { getMetricById, getTestCaseById } from "../../db";
import { SnakeCaseScores, toSnakeCaseScores } from "./scoreCaseMapper";

export interface GetTestCasesForMetricRequest {
  metricId: string;
}

export type GetTestCasesForMetricResponse = {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  scores: SnakeCaseScores;
  critique: string | null;
}[];

async function getTestCasesForMetric(
  request: GetTestCasesForMetricRequest
): Promise<GetTestCasesForMetricResponse> {
  const metric = getMetricById(request.metricId);

  if (!metric) {
    throw new Error("Metric not found");
  }

  return metric.testCases
    .map(({ id }) => {
      const testCase = getTestCaseById(id);

      if (testCase === null) {
        throw new Error("Test case not found");
      }

      return testCase;
    })
    .map((testCase) => {
      const { scores, ...rest } = testCase;

      return {
        ...rest,
        scores: toSnakeCaseScores(scores),
      };
    });
}

export { getTestCasesForMetric };
