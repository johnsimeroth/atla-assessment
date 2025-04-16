import { useGetTestCasesForMetric } from "@/app/lib/queries/useGetTestCasesForMetric";
import { useEffect, useState } from "react";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";
import { useSyncTestCasesData } from "@/app/generate/useSyncTestCasesData";
import { MetricResponse } from "@/app/lib/api/metrics/get";

function useTestCaseData({
  metricId,
  selectedMetric,
  selectedPrompt,
}: {
  metricId?: string;
  selectedMetric: MetricResponse | null;
  selectedPrompt: MetricResponse["prompts"][number] | null;
}) {
  const { isLoading, data: dbTestCases } = useGetTestCasesForMetric({
    metricId,
  });

  const [testCases, setTestCases] =
    useState<GetTestCasesForMetricResponse | null>(dbTestCases || null);

  useEffect(() => {
    if (!dbTestCases) {
      return;
    }

    if (testCases === null && dbTestCases) {
      setTestCases(dbTestCases);
      return;
    }
  }, [dbTestCases]);

  useSyncTestCasesData({
    testCases,
    dbTestCases: dbTestCases || null,
    selectedMetric,
  });

  const firstTestCase = testCases ? testCases[0] : null;
  const hasContext = "context" in (firstTestCase || {});
  const hasReference = "reference" in (firstTestCase || {});

  const completeTestCases =
    testCases?.filter((testCase) => {
      const hasInput = testCase.input !== null;
      const hasResponse = testCase.response !== null;

      return hasInput && hasResponse;
    }) || null;

  const testCasesWithScores =
    testCases?.filter((testCase) => {
      const promptScores = selectedPrompt
        ? testCase.scores[selectedPrompt.id]
        : null;
      const expectedScore = promptScores?.expected_score;
      const hasScore = expectedScore != null && !isNaN(expectedScore);
      const hasAtlaScore = promptScores?.atla_score != null;

      return hasScore && hasAtlaScore;
    }) || null;

  const setTestCaseValue = ({
    id,
    key,
    value,
  }: {
    id: string;
    key: string;
    value: string | number | null;
  }) => {
    if (testCases === null) {
      throw new Error("Test cases are not loaded yet");
    }

    const updatedTestCases = testCases.map((testCase) => {
      if (testCase.id === id) {
        return {
          ...testCase,
          [key]: value,
        };
      }

      return testCase;
    });

    setTestCases(updatedTestCases);
  };

  const setTestCaseValues = (
    values: {
      id: string;
      key: string;
      value: string | number | null;
    }[]
  ) => {
    if (testCases === null) {
      throw new Error("Test cases are not loaded yet");
    }

    const updatedTestCases = testCases.map((testCase) => {
      const updatedValues = values.reduce((acc, { id, key, value }) => {
        if (testCase.id === id) {
          // @ts-ignore
          acc[key] = value;
        }

        return acc;
      }, testCase);

      return updatedValues;
    });

    setTestCases(updatedTestCases);
  };

  function createEmptyTestCase() {
    return {
      id: crypto.randomUUID(),
      input: null,
      response: null,
      ...(hasContext ? { context: null } : {}),
      ...(hasReference ? { reference: null } : {}),
      scores: {},
      critique: null,
    };
  }

  const addTestCase = () => {
    if (testCases === null) {
      throw new Error("Test cases are not loaded yet");
    }
    const newTestCase = createEmptyTestCase();

    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (id: string) => {
    if (testCases === null) {
      throw new Error("Test cases required");
    }

    const updatedTestCases = testCases.filter((testCase) => testCase.id !== id);

    setTestCases([
      ...updatedTestCases,
      ...(updatedTestCases.length === 0 ? [createEmptyTestCase()] : []),
    ]);
  };

  const loadTestCases = (testCasesToLoad: GetTestCasesForMetricResponse) => {
    setTestCases(
      testCasesToLoad.map((testCase) => {
        const { context, reference, ...rest } = testCase;

        return {
          ...rest,
          ...(hasContext ? { context: context || null } : {}),
          ...(hasReference ? { reference: reference || null } : {}),
          id: crypto.randomUUID(),
        };
      })
    );
  };

  return {
    isLoading,
    testCases: testCases,
    setTestCaseValue,
    setTestCaseValues,
    addTestCase,
    completeTestCases,
    testCasesWithScores,
    removeTestCase,
    inputs: {
      hasContext,
      hasReference,
    },
    loadTestCases,
  };
}

export { useTestCaseData };
