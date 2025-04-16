import {
  createTestCase,
  createTestCaseCollection,
  deleteTestCase,
  getTestCaseCollectionById,
} from "../../db";
import { CollectionTestCase, TestCase, TestCaseCollection } from "../../types";

export interface RequestTestCase {
  id: string;
  input: string | null;
  response: string | null;
  context?: string | null;
  reference?: string | null;
  scores: Record<
    string,
    { expected_score: number | null; atla_score: number | null }
  >;
  critique: string | null;
}

export interface UpdateTestCaseCollectionRequest {
  id: string;
  testCaseCollection: {
    name?: string;
    description?: string;
    testCases?: RequestTestCase[];
  };
}

async function update(request: UpdateTestCaseCollectionRequest) {
  const existingTestCaseCollection = getTestCaseCollectionById({
    id: request.id,
  });

  if (existingTestCaseCollection === null) {
    throw new Error("TestCaseCollection not found");
  }

  let newTestCases: TestCase[] | null = null;

  if (request.testCaseCollection.testCases !== undefined) {
    const existingTestCases = existingTestCaseCollection.testCases;

    existingTestCases.forEach((testCase) => {
      deleteTestCase(testCase.id);
    });

    const duplicatedTestCases = request.testCaseCollection.testCases.map(
      (testCase) => ({
        ...testCase,
        id: crypto.randomUUID(),
      })
    );

    const mappedTestCases: CollectionTestCase[] = duplicatedTestCases.map(
      (testCase) => ({
        id: testCase.id,
        input: testCase.input,
        response: testCase.response,
        ...(testCase.context ? { context: testCase.context } : {}),
        ...(testCase.reference ? { reference: testCase.reference } : {}),
        // TODO: Check if promptIds are needed here
        scores: {},
        critique: null,
      })
    );

    newTestCases = mappedTestCases;

    mappedTestCases.forEach((testCase) => {
      createTestCase(testCase);
    });
  }

  const testCaseCollection: TestCaseCollection = {
    id: existingTestCaseCollection.id,
    name: request.testCaseCollection.name || existingTestCaseCollection.name,
    description:
      request.testCaseCollection.description ||
      existingTestCaseCollection.description,
    testCases: (newTestCases || existingTestCaseCollection.testCases).map(
      ({ id }) => ({ id })
    ),
  };

  createTestCaseCollection(testCaseCollection);
}

export { update };
