import { createTestCase } from "../../db";
import { SnakeCaseScores, toCamelCaseScores } from "./scoreCaseMapper";
export interface CreateTestCaseRequest {
  id?: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  scores: SnakeCaseScores;
  critique: string | null;
}

interface CreateTestCaseResponse {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  scores: SnakeCaseScores;
  critique: string | null;
}

async function create(
  request: CreateTestCaseRequest
): Promise<CreateTestCaseResponse> {
  const id = request.id || crypto.randomUUID();

  const { scores, ...rest } = request;

  createTestCase({
    ...rest,
    id,
    scores: toCamelCaseScores(scores),
  });

  return {
    ...request,
    id,
  };
}

export { create };
