import { createTestCase, createTestCaseCollection } from "../../db";
import { CollectionTestCase, TestCase, TestCaseCollection } from "../../types";
import { toCamelCaseScores } from "../testCases/scoreCaseMapper";

export interface RequestTestCase {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  scores: Record<
    string,
    {
      expected_score: null;
      atla_score: null;
    }
  >;
  critique: null;
}

export interface CreateTestCaseCollectionRequest {
  name: string;
  description: string;
  testCases: RequestTestCase[];
}

async function create(request: CreateTestCaseCollectionRequest) {
  const duplicatedTestCases = request.testCases.map((testCase) => ({
    ...testCase,
    id: crypto.randomUUID(),
  }));

  const mappedTestCases: CollectionTestCase[] = duplicatedTestCases.map(
    (testCase) => ({
      id: testCase.id,
      input: testCase.input,
      response: testCase.response,
      ...(testCase.context ? { context: testCase.context } : {}),
      ...(testCase.reference ? { reference: testCase.reference } : {}),
      // TODO: Check if promptIds are needed here
      scores: {},
      critique: testCase.critique,
    })
  );

  mappedTestCases.forEach((testCase) => {
    createTestCase(testCase);
  });

  const testCaseCollection: TestCaseCollection = {
    id: crypto.randomUUID(),
    name: request.name,
    description: request.description,
    testCases: mappedTestCases.map((testCase) => ({ id: testCase.id })),
  };

  createTestCaseCollection(testCaseCollection);
}

export { create };
