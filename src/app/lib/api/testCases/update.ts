import { createTestCase, getTestCaseById } from "../../db";
import { toCamelCaseScores, toSnakeCaseScores } from "./scoreCaseMapper";
export interface UpdateTestCaseRequest {
  id: string;
  testCase: {
    input?: string | null;
    response?: string | null;
    context?: string | null;
    reference?: string | null;
    scores?: Record<
      string,
      {
        expected_score: number | null;
        atla_score: number | null;
      }
    >;
    critique?: string | null;
  };
}

interface UpdateTestCaseResponse {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  scores?: Record<
    string,
    {
      expected_score: number | null;
      atla_score: number | null;
    }
  >;
  critique: string | null;
}

async function update(
  request: UpdateTestCaseRequest
): Promise<UpdateTestCaseResponse> {
  const testCase = getTestCaseById(request.id);

  if (!testCase) {
    throw new Error("Test case not found");
  }

  const { scores, ...rest } = request.testCase;

  const updatedTestCase = {
    ...testCase,
    ...rest,
    ...(scores !== undefined ? { scores: toCamelCaseScores(scores) } : {}),
  };

  createTestCase(updatedTestCase);

  return {
    ...updatedTestCase,
    scores: toSnakeCaseScores(updatedTestCase.scores),
  };
}

export { update };
