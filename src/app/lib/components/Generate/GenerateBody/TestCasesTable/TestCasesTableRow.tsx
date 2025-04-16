import { VariableWidthCell } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/VariableWidthCell";
import { FixedWidthCell } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/FixedWidthCell";
import classNames from "classnames";
import { ScoringCriteria } from "../../../../types";
import { OneToFiveDropdown } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/ScoreInputs/OneToFiveDropdown";
import { BinaryToggle } from "@/app/lib/components/CreateMetric/AddExamples/Example/BinaryToggle";
import { FloatInput } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/ScoreInputs/FloatInput";
import { RunEvaluationInput } from "@/app/generate/useRunEvaluations";
import { AtlaScoreButton } from "@/app/lib/components/Generate/GenerateBody/TestCasesTable/AtlaScoreButton";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import Image from "next/image";
import { Tooltip } from "@/app/lib/components/Tooltips/Tooltip";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const getAtlaScoreColour = ({
  scoringCriteria,
  atlaScore,
  expectedScore,
}: {
  scoringCriteria: ScoringCriteria;
  atlaScore: number;
  expectedScore: number | null;
}) => {
  if (expectedScore === null) {
    return "none";
  }

  if (scoringCriteria === ScoringCriteria.OneToFive) {
    const diff = Math.abs(atlaScore - expectedScore);

    if (diff <= 1) {
      return "green";
    }

    if (diff <= 2) {
      return "amber";
    }
    return "red";
  }

  if (scoringCriteria === ScoringCriteria.Binary) {
    return atlaScore === expectedScore ? "green" : "red";
  }

  if (scoringCriteria === ScoringCriteria.FloatZeroToOne) {
    const diff = Math.abs(atlaScore - expectedScore);

    if (diff <= 0.1) {
      return "green";
    }

    if (diff <= 0.2) {
      return "amber";
    }
    return "red";
  }

  throw new Error("Invalid scoring criteria");
};

const areInputsFilled = ({
  input,
  response,
}: {
  input: string | null;
  response: string | null;
}) => {
  return input !== null && response !== null;
};

const requestAReviewTooltipHtml = `
    <p style="font-size:12px;text-align: center;margin-bottom: 10px">Try adjusting the prompt to<br />align the evaluation score.</p>
    <p style="font-size:12px;text-align: center;font-weight: 700">Still not working?<p>
    <p style="font-size:12px;text-align: center;font-style: italic">Click to add as few-shot example</p>
  `;

function TestCasesTableRow({
  id,
  input,
  context,
  reference,
  response,
  expectedScore,
  atlaScore,
  atlaCritique,
  onValueChange,
  isLastRow,
  scoringCriteria,
  runEvaluations,
  isRunning,
  removeTestCase,
  deleteDisabled,
  selectedPromptId,
  selectedMetricId,
  hasMaxFewShots,
  isInitialMetric,
  isFirstRow,
}: {
  id: string;
  input: string | null;
  context?: string | null;
  reference?: string | null;
  response: string | null;
  expectedScore: number | null;
  atlaScore: number | null;
  atlaCritique: string | null;
  onValueChange: (input: {
    id: string;
    key: string;
    value: string | number | null;
  }) => void;
  isLastRow: boolean;
  scoringCriteria: ScoringCriteria;
  runEvaluations: (testCases: RunEvaluationInput) => void;
  isRunning: boolean;
  removeTestCase: (id: string) => void;
  deleteDisabled?: boolean;
  selectedPromptId: string | undefined;
  selectedMetricId: string | undefined;
  hasMaxFewShots: boolean;
  isInitialMetric: boolean;
  isFirstRow: boolean;
}) {
  const router = useRouter();

  const sharedCellClasses = classNames(
    "border-r border-border-primary p-3 bg-white",
    {
      "border-b": !isLastRow,
    }
  );
  const sharedTextAreaClasses =
    "inter-400 text-xs text-text-secondary w-full h-full min-h-44 p-2 overflow-hidden";

  const runEvaluation = () =>
    runEvaluations([
      {
        id,
        input: input,
        context: context,
        reference: reference,
        response: response,
        promptId: selectedPromptId ?? null,
        expectedScore: expectedScore,
      },
    ]);

  const inputsAreFilled = areInputsFilled({
    input,
    response,
  });

  const examplesUrl =
    `/metric/create/?metric=${selectedMetricId}` +
    `&prompt=${selectedPromptId}` +
    `&page=add-examples` +
    `&allow-back=false` +
    `&redirect=${encodeURIComponent(`/generate?metric=${selectedMetricId}&prompt=${selectedPromptId}`)}`;

  const onClickAtlaScoreButton = () => {
    if (hasMaxFewShots) {
      toast(
        <div>
          Maximum few-shot examples reached.
          <br />{" "}
          <p style={{ fontSize: "14px" }}>
            To avoid overloading the context window <br />
            and increasing latency with our model, we currently <br />
            limit at 3 examples.
            <br />
            <br />
            <button
              className="underline"
              onClick={() => router.push(examplesUrl)}
            >
              Please remove an existing example to add this test case.
            </button>
          </p>
        </div>,
        {
          type: "error",
          theme: "dark",
          position: "top-center",
          pauseOnFocusLoss: false,
          autoClose: 5000,
          closeOnClick: true,
          style: {
            width: "max-content",
          },
        }
      );

      return;
    }

    const testCaseURI = JSON.stringify({
      input,
      ...(context ? { context } : {}),
      ...(reference ? { reference } : {}),
      response,
      expected_score: expectedScore,
    });

    router.push(examplesUrl + `&few-shot=${encodeURIComponent(testCaseURI)}`);
  };

  const runButtonDisabled = !inputsAreFilled || isRunning;

  const atlaScoreColour =
    atlaScore !== null
      ? getAtlaScoreColour({
          scoringCriteria,
          expectedScore,
          atlaScore,
        })
      : "none";

  const atlaScoreIsSuccess = ["green", "none"].includes(atlaScoreColour);

  return (
    <div className="flex flex-grow">
      <VariableWidthCell
        className={classNames(sharedCellClasses, {
          "z-50": isFirstRow,
        })}
      >
        <textarea
          className={sharedTextAreaClasses}
          placeholder="User question / chat dialogue /  user instructon, etc."
          value={input || ""}
          onChange={(e) =>
            onValueChange({
              id: id,
              key: "input",
              value: e.target.value || null,
            })
          }
        />
      </VariableWidthCell>
      {context !== undefined && (
        <VariableWidthCell
          className={classNames(sharedCellClasses, {
            "z-50": isFirstRow,
          })}
        >
          <textarea
            placeholder="Context retrieved"
            className={sharedTextAreaClasses}
            value={context || ""}
            onChange={(e) =>
              onValueChange({
                id: id,
                key: "context",
                value: e.target.value || null,
              })
            }
          />
        </VariableWidthCell>
      )}
      {reference !== undefined && (
        <VariableWidthCell
          className={classNames(sharedCellClasses, {
            "z-50": isFirstRow,
          })}
        >
          <textarea
            placeholder="A ‘ground-truth’ or gold-standard answer"
            className={sharedTextAreaClasses}
            value={reference || ""}
            onChange={(e) =>
              onValueChange({
                id: id,
                key: "reference",
                value: e.target.value || null,
              })
            }
          />
        </VariableWidthCell>
      )}
      <VariableWidthCell
        className={classNames(sharedCellClasses, {
          "z-50": isFirstRow,
        })}
      >
        <textarea
          placeholder="Response from the AI"
          className={sharedTextAreaClasses}
          value={response || ""}
          onChange={(e) =>
            onValueChange({
              id: id,
              key: "response",
              value: e.target.value || null,
            })
          }
        />
      </VariableWidthCell>
      <FixedWidthCell
        className={classNames(sharedCellClasses, {
          "z-50": isFirstRow,
        })}
      >
        {scoringCriteria === ScoringCriteria.OneToFive && (
          <OneToFiveDropdown
            value={expectedScore}
            onChange={(value) =>
              onValueChange({ id, key: "expected_score", value })
            }
          />
        )}
        {scoringCriteria === ScoringCriteria.Binary && (
          <div className="border border-border-primary rounded">
            <BinaryToggle
              value={expectedScore}
              onChange={(value) =>
                onValueChange({ id, key: "expected_score", value })
              }
              allowNoValue
            />
          </div>
        )}
        {scoringCriteria === ScoringCriteria.FloatZeroToOne && (
          <FloatInput
            value={expectedScore}
            onChange={(value) =>
              onValueChange({ id, key: "expected_score", value: value })
            }
            max={1}
            min={0}
            step={0.1}
          />
        )}
        <p className="inter-400 text-xs text-text-secondary mt-2 ml-1 opacity-70">
          Optional
        </p>
      </FixedWidthCell>
      <FixedWidthCell
        className={classNames(sharedCellClasses, "flex flex-col items-center", {
          "z-50": isFirstRow,
        })}
      >
        {atlaScore === null ? (
          <PrimaryButton
            fullWidth={false}
            onClick={runEvaluation}
            disabled={runButtonDisabled}
            disabledTooltip={
              !inputsAreFilled
                ? "‘Input’ and ‘Response’ fields required to run evaluation"
                : undefined
            }
          >
            <Image
              src={
                runButtonDisabled
                  ? "/play-icon-disabled.svg"
                  : "/play-icon-white.svg"
              }
              alt="Run evaluation"
              width="16"
              height="16"
              className="mr-2.5"
            />
            Run
          </PrimaryButton>
        ) : (
          <>
            <Tooltip
              id={"atla-score-request-a-review"}
              html={requestAReviewTooltipHtml}
              place="top"
              hidden={atlaScoreIsSuccess || isInitialMetric}
            >
              <AtlaScoreButton
                onClick={atlaScoreIsSuccess ? () => {} : onClickAtlaScoreButton}
                score={atlaScore}
                colour={atlaScoreColour}
                disabled={isInitialMetric}
              />
            </Tooltip>
            <PrimaryButton
              fullWidth={false}
              className="mt-4 px-4"
              onClick={runEvaluation}
              disabled={runButtonDisabled}
              disabledTooltip={
                !inputsAreFilled
                  ? "‘Input’ and ‘Response’ fields required to run evaluation"
                  : undefined
              }
            >
              <Image
                src={
                  runButtonDisabled
                    ? "/refresh-icon-disabled.svg"
                    : "/refresh-icon-white.svg"
                }
                alt="Rerun evaluation"
                width="16"
                height="16"
                className="mr-2.5"
              />
              Rerun
            </PrimaryButton>
          </>
        )}
      </FixedWidthCell>
      <VariableWidthCell
        className={classNames(sharedCellClasses, {
          "z-50": isFirstRow,
        })}
      >
        <textarea
          placeholder="Atla’s reasoning for the score"
          className={classNames(sharedTextAreaClasses, "disabled:bg-white")}
          value={atlaCritique || ""}
          readOnly
          disabled
        />
      </VariableWidthCell>
      <FixedWidthCell
        width="w-10"
        className={classNames(sharedCellClasses, "border-r-0 flex", {
          "z-50": isFirstRow,
        })}
      >
        <button disabled={deleteDisabled} onClick={() => removeTestCase(id)}>
          <Image
            src={
              deleteDisabled
                ? "/delete-icon-disabled.svg"
                : "/delete-icon-red.svg"
            }
            alt="Delete evaluation row"
            width="18"
            height="18"
          />
        </button>
      </FixedWidthCell>
    </div>
  );
}

export { TestCasesTableRow };
