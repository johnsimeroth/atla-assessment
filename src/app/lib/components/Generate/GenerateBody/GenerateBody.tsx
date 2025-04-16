import { TestCasesTableHeader } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/TestCasesTableHeader";
import { TestCasesTableRow } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/TestCasesTableRow";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";
import { ScoringCriteria } from "../../../types";
import { RunEvaluationInput } from "@/app/generate/useRunEvaluations";

function GenerateBody({
  testCases,
  hasContext,
  hasReference,
  onValueChange,
  scoringCriteria,
  runEvaluations,
  runningEvaluations,
  removeTestCase,
  completeTestCases,
  selectedMetricId,
  selectedPromptId,
  hasMaxFewShots,
  isInitialMetric,
}: {
  testCases: GetTestCasesForMetricResponse;
  hasContext: boolean;
  hasReference: boolean;
  onValueChange: (input: {
    id: string;
    key: string;
    value: string | number | null;
  }) => void;
  scoringCriteria: ScoringCriteria;
  runEvaluations: (testCases: RunEvaluationInput) => void;
  runningEvaluations: string[];
  removeTestCase: (id: string) => void;
  completeTestCases: GetTestCasesForMetricResponse | null;
  selectedPromptId: string | undefined;
  selectedMetricId: string | undefined;
  hasMaxFewShots: boolean;
  isInitialMetric: boolean;
}) {
  return (
    <div className="min-h-0 overflow-auto flex-grow [scrollbar-gutter:stable] pl-6 pr-3">
      <div className="border border-border-primary rounded-t-lg rounded-b-lg">
        <TestCasesTableHeader
          displayContext={hasContext}
          displayReference={hasReference}
        />
        {testCases.map((testCase, index) => {
          const isOnlyTestCase = testCases.length === 1;
          const testCaseIsComplete = completeTestCases?.some(
            (testCase) => testCase.id === testCase.id
          );
          const deleteDisabled =
            !selectedPromptId ||
            (isOnlyTestCase &&
              !testCaseIsComplete &&
              !testCase.scores[selectedPromptId]?.atla_score &&
              !testCase.critique) ||
            false;

          return (
            <TestCasesTableRow
              key={testCase.id}
              id={testCase.id}
              isRunning={runningEvaluations.includes(testCase.id)}
              input={testCase.input}
              context={testCase.context}
              reference={testCase.reference}
              response={testCase.response}
              expectedScore={
                selectedPromptId
                  ? testCase.scores[selectedPromptId]?.expected_score
                  : null
              }
              atlaScore={
                selectedPromptId
                  ? testCase.scores[selectedPromptId]?.atla_score
                  : null
              }
              atlaCritique={testCase.critique}
              onValueChange={onValueChange}
              isLastRow={testCases.length - 1 === index}
              scoringCriteria={scoringCriteria}
              runEvaluations={runEvaluations}
              removeTestCase={() => removeTestCase(testCase.id)}
              deleteDisabled={deleteDisabled}
              selectedMetricId={selectedMetricId}
              selectedPromptId={selectedPromptId}
              hasMaxFewShots={hasMaxFewShots}
              isInitialMetric={isInitialMetric}
              isFirstRow={index === 0}
            />
          );
        })}
      </div>
    </div>
  );
}

export { GenerateBody };
