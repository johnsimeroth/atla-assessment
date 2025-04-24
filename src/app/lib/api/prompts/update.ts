import { FewShot, Prompt, ScoringCriteria, TestCaseScores } from "../../types";
import {
  createFewShot,
  createMetric,
  createPrompt,
  getTestCaseById,
  createTestCase,
  getPromptsForMetric,
} from "../../db";

export interface UpdatePromptRequest {
  id: string;
  metric: {
    name: string;
    model: string;
    scoring_criteria: ScoringCriteria;
    is_draft: boolean;
    prompts: {
      id: string;
      version: number;
      is_deployed: boolean;
      name: string;
      template: string;
      input_variables: string[];
      criteria: string;
    }[];
    few_shots?: {
      id: string;
      input: string;
      response: string;
      score: number;
      context?: string | null;
      reference?: string | null;
      critique: string | null;
      in_use: boolean;
    }[];
    test_cases?: {
      id: string;
    }[];
  };
}

interface UpdatePromptResponse {
  id: string;
  name: string;
  model: string;
  scoring_criteria: ScoringCriteria;
  is_draft: boolean;
  prompts: {
    version: number;
    is_deployed: boolean;
    id: string;
    name: string;
    template: string;
    input_variables: string[];
    criteria: string;
  }[];
  few_shots: {
    id: string;
    in_use: boolean;
  }[];
  testCases: {
    id: string;
  }[];
}

async function update(
  request: UpdatePromptRequest
): Promise<UpdatePromptResponse> {
  const prompts: Prompt[] = request.metric.prompts.map((prompt, index) => {
    return {
      id: prompt.id,
      version: prompt.version,
      isDeployed: prompt.is_deployed,
      updatedAt: new Date().toISOString(),
      name: prompt.name,
      template: prompt.template,
      inputVariables: prompt.input_variables,
      criteria: prompt.criteria,
    };
  });

  const existingPromptIds = getPromptsForMetric(request.id).map(({ id }) => id);
  prompts.forEach(createPrompt);

  const fewShots: FewShot[] | undefined = request.metric.few_shots?.map(
    (fewShot, index) => {
      return {
        id: fewShot.id,
        input: fewShot.input,
        response: fewShot.response,
        score: fewShot.score,
        critique: fewShot.critique,
        ...(fewShot.context ? { context: fewShot.context } : {}),
        ...(fewShot.reference ? { reference: fewShot.reference } : {}),
        inUse: fewShot.in_use || true,
      };
    }
  );

  if (fewShots) {
    fewShots.forEach(createFewShot);
  }

  const newPromptScores: TestCaseScores = {};
  prompts.forEach((p) => {
    if (!existingPromptIds.includes(p.id)) {
      newPromptScores[p.id] = { expectedScore: null, atlaScore: null };
    }
  });

  const testCaseIds = request.metric.test_cases?.map(({ id }) => id);

  if (testCaseIds) {
    const latestExistingPromptId =
      existingPromptIds[existingPromptIds.length - 1];
    const updatedTestCases = testCaseIds
      .map((id) => {
        const currentTestCase = getTestCaseById(id);
        if (!currentTestCase) {
          return;
        }
        const testCaseExpectedScore =
          currentTestCase.scores[latestExistingPromptId].expectedScore;
        const populatedPromptScores: TestCaseScores = Object.entries(
          newPromptScores
        ).reduce((acc, [k, v]) => {
          return {
            ...acc,
            [k]: { ...v, expectedScore: testCaseExpectedScore },
          };
        }, {});
        return {
          ...currentTestCase,
          scores: { ...currentTestCase.scores, ...populatedPromptScores },
        };
      })
      .filter((tc) => tc != null);
    console.log({ updatedTestCases });
    updatedTestCases.forEach(createTestCase);
  }

  const metric = {
    id: request.id,
    name: request.metric.name,
    model: request.metric.model,
    isDraft: request.metric.is_draft || false,
    updatedAt: new Date().toISOString(),
    scoringCriteria: request.metric.scoring_criteria,
    prompts: prompts.map((prompt) => ({
      version: prompt.version,
      isDeployed: prompt.isDeployed,
      id: prompt.id,
    })),
    fewShots:
      fewShots?.map((fewShot) => ({
        id: fewShot.id,
        inUse: fewShot.inUse,
      })) || [],
    testCases: request.metric.test_cases || [],
  };

  createMetric(metric);

  return {
    id: metric.id,
    name: metric.name,
    model: metric.model,
    is_draft: metric.isDraft,
    scoring_criteria: metric.scoringCriteria,
    prompts: prompts.map((prompt) => ({
      version: prompt.version,
      is_deployed: prompt.isDeployed,
      id: prompt.id,
      name: prompt.name,
      template: prompt.template,
      input_variables: prompt.inputVariables,
      criteria: prompt.criteria,
    })),
    few_shots:
      fewShots?.map((fewShot) => ({
        id: fewShot.id,
        in_use: fewShot.inUse,
      })) || [],
    testCases: metric.testCases || [],
  };
}

export { update };
