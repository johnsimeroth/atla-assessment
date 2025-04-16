import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";
//@ts-ignore
import Cohen from "@/app/lib/maths/cohensKappa";
import { ScoringCriteria } from "../lib/types";

const getNumberOfCategories = (scoringCriteria: ScoringCriteria) => {
  if (scoringCriteria === ScoringCriteria.Binary) {
    return 2;
  }

  if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
    return 101;
  }

  if (scoringCriteria === ScoringCriteria.OneToFive) {
    return 5;
  }

  throw new Error("Invalid scoring criteria");
};

const transformScore = ({
  score,
  scoringCriteria,
}: {
  score: number;
  scoringCriteria: ScoringCriteria;
}) => {
  if (scoringCriteria === ScoringCriteria.Binary) {
    return score + 1;
  }

  if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
    return score * 100 + 1;
  }

  if (scoringCriteria === ScoringCriteria.OneToFive) {
    return score;
  }

  throw new Error("Invalid scoring criteria");
};

const getWeighting = (scoringCriteria: ScoringCriteria) => {
  if (scoringCriteria === ScoringCriteria.Binary) {
    return "none";
  }

  if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
    return "linear";
  }

  if (scoringCriteria === ScoringCriteria.OneToFive) {
    return "squared";
  }

  throw new Error("Invalid scoring criteria");
};

function useCohensKappa({
  testCases,
  scoringCriteria,
  promptId,
}: {
  testCases: GetTestCasesForMetricResponse | null;
  scoringCriteria?: ScoringCriteria;
  promptId: string | undefined;
}) {
  if (!scoringCriteria) {
    return { kappa: null };
  }

  if (!testCases) {
    return { kappa: null };
  }

  if (!promptId) {
    return { kappa: null };
  }

  if (testCases.length <= 2) {
    return { kappa: null };
  }

  const expectedScores = testCases?.reduce((acc, testCase) => {
    return {
      ...acc,
      [testCase.id]: transformScore({
        score: testCase.scores[promptId].expected_score!,
        scoringCriteria,
      }),
    };
  }, {});

  const atlaScores = testCases?.reduce((acc, testCase) => {
    return {
      ...acc,
      [testCase.id]: transformScore({
        score: testCase.scores[promptId].atla_score!,
        scoringCriteria,
      }),
    };
  }, {});

  const kappa = Cohen.kappa(
    expectedScores,
    atlaScores,
    getNumberOfCategories(scoringCriteria),
    getWeighting(scoringCriteria)
  );

  return { kappa: isNaN(kappa) ? 1 : kappa };
}

export { useCohensKappa };
