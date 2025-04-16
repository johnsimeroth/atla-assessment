import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { useCreatePrompt } from "@/app/lib/queries/useCreatePrompt";
import { CreatePromptRequest } from "@/app/lib/api/prompts/create";
import { ScoringCriteria } from "../../lib/types";
import { useEffect, useState } from "react";
import { MetricExample } from "@/app/metric/create/useMetricData";
import { useCreateTestCase } from "@/app/lib/queries/useCreateTestCase";
import { CreateTestCaseRequest } from "@/app/lib/api/testCases/create";
import { optionsToInputVariableIds } from "@/app/lib/utils/optionsToInputVariableIds";
import { isExampleComplete } from "@/app/lib/utils/isExampleComplete";

const getScoringCriteria = (ruberic: string) => {
  if (ruberic === "one-to-five") {
    return ScoringCriteria.OneToFive;
  }
  if (ruberic === "binary") {
    return ScoringCriteria.Binary;
  }
  if (ruberic === "float") {
    return ScoringCriteria.FloatZeroToOne;
  }
  throw new Error(`Invalid ruberic: ${ruberic}`);
};

function useSaveMetric({
  scoringRuberic,
  metricName,
  prompt,
  inputVariables,
  examples,
  criteria,
  onSuccess,
  onError,
}: {
  scoringRuberic: string | null;
  inputVariables: InputVariablesMultiSelectOption[];
  prompt: string | null;
  examples: MetricExample[];
  metricName: string | null;
  criteria: string | null;
  onSuccess: (value: { metricId: string; promptId: string }) => void;
  onError: () => void;
}) {
  const {
    mutate: createPrompt,
    isSuccess: createPromptIsSuccess,
    isError: createPromptIsError,
    data: createPromptData,
    isPending: createPromptIsPending,
  } = useCreatePrompt();
  const {
    mutateAsync: createTestCase,
    isSuccess: createTestCaseIsSuccess,
    isError: createTestCaseIsError,
    isPending: createTestCaseIsPending,
  } = useCreateTestCase();
  const [isSavingMetric, setIsSavingMetric] = useState<boolean>(false);

  const saveMetric = async () => {
    if (metricName === null) {
      throw new Error("Metric name is required");
    }

    if (scoringRuberic === null) {
      throw new Error("Scoring ruberic is required");
    }

    if (prompt === null) {
      throw new Error("Prompt is required");
    }

    if (criteria === null) {
      throw new Error("Criteria is required");
    }

    setIsSavingMetric(true);

    const cleanedExamples = examples.filter((example) =>
      isExampleComplete(example)
    );

    const inputVariableIds = optionsToInputVariableIds(inputVariables);

    const testCaseRequest: CreateTestCaseRequest = {
      input: null,
      response: null,
      ...(inputVariableIds.includes("context") ? { context: null } : {}),
      ...(inputVariableIds.includes("reference") ? { reference: null } : {}),
      scores: {},
      critique: null,
    };

    const testCase = await createTestCase(testCaseRequest);

    const request: CreatePromptRequest = {
      name: metricName.replace(/\s/g, "_").toLowerCase(),
      model: "atla",
      scoring_criteria: getScoringCriteria(scoringRuberic),
      prompts: [
        {
          version: 1,
          name: metricName,
          template: prompt,
          input_variables: inputVariableIds,
          criteria,
        },
      ],
      few_shots: cleanedExamples.map((example) => ({
        input: example.input!,
        response: example.response!,
        score: example.score!,
        critique: example.critique!,
        context: example.context!,
        reference: example.reference!,
      })),
      test_cases: [{ id: testCase.id }],
    };

    createPrompt(request);
  };

  useEffect(() => {
    if (createPromptIsPending || createTestCaseIsPending) {
      return;
    }

    if (createTestCaseIsSuccess && createPromptIsSuccess && !createPromptData) {
      throw new Error("No data returned from create prompt mutation");
    }

    if (createTestCaseIsSuccess && createPromptIsSuccess) {
      onSuccess({
        metricId: createPromptData.id,
        promptId: createPromptData.prompts[0].id,
      });
    }
  }, [
    createPromptIsPending,
    createTestCaseIsPending,
    createPromptIsSuccess,
    createTestCaseIsSuccess,
    createPromptData,
    onSuccess,
  ]);

  useEffect(() => {
    if (createPromptIsError || createTestCaseIsError) {
      onError();
      setIsSavingMetric(false);
    }
  }, [createPromptIsError, createTestCaseIsError, onError]);

  return { saveMetric, isSavingMetric };
}

export { useSaveMetric };
