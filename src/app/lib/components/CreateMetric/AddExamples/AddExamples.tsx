import Image from "next/image";
import { InputVariablesMultiSelectOption } from "@/app/lib/components/CreateMetric/BuildMetric/MetricDetails/InputVariablesMultiSelect";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import { MetricExample } from "@/app/metric/create/useMetricData";
import { Example } from "@/app/lib/components/CreateMetric/AddExamples/Example/Example";
import { SecondaryButton } from "@/app/lib/components/Buttons/SecondaryButton";
import { useState } from "react";
import { Tooltip } from "@/app/lib/components/Tooltips/Tooltip";
import { isExampleComplete } from "@/app/lib/utils/isExampleComplete";

const areAllExamplesComplete = (examples: MetricExample[]) => {
  return examples.every((example) => isExampleComplete(example));
};

const AddExamples = ({
  onClose,
  onSave,
  onUpdateExamples,
  onBack,
  metricId,
  scoringRuberic,
  inputVariables,
  examples,
  onExamplesChange,
  createNewExample,
  generateNewExample,
  removeExample,
  resetExample,
}: {
  onClose: () => void;
  onBack: () => void;
  metricId: string | null;
  onSave: () => void;
  onUpdateExamples: () => void;
  scoringRuberic: string | null;
  inputVariables: InputVariablesMultiSelectOption[];
  examples: MetricExample[];
  onExamplesChange: (examples: MetricExample[]) => void;
  createNewExample: () => void;
  generateNewExample: () => Promise<void>;
  removeExample: (index: number) => void;
  resetExample: (index: number) => void;
}) => {
  const [generatingExample, setGeneratingExample] = useState<boolean>(false);

  const generateExample = async () => {
    setGeneratingExample(true);

    try {
      await generateNewExample();
    } catch (error) {
      console.log(error);
      alert(
        "Something went wrong while trying to generate a new example. Please try again."
      );
    } finally {
      setGeneratingExample(false);
    }
  };

  const latestExampleIsComplete =
    examples.length > 0
      ? isExampleComplete(examples[examples.length - 1])
      : false;

  const allExamplesComplete = areAllExamplesComplete(examples);
  const maxExamplesReached = examples.length === 3;
  const generateButtonDisabled =
    generatingExample || maxExamplesReached || !latestExampleIsComplete;
  const addExampleDisabled = maxExamplesReached;

  const maxExamplesTooltipHtml = `<p style="font-size:12px;">You have reached the maximum<br/>number of examples</p>`;
  const getGenerateExamplesTooltip = () => {
    if (maxExamplesReached) {
      return maxExamplesTooltipHtml;
    }
    if (!latestExampleIsComplete) {
      return `<p style="font-size:12px;">Add one example to help AI<br/>generate more examples</p>`;
    }
    return "";
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex flex-col items-center">
        <button onClick={onClose}>
          <Image
            src="/close-icon-grey.svg"
            alt="Close metric builder"
            width="24"
            height="24"
            className="absolute top-4 right-6"
          />
        </button>
        {metricId === null && (
          <button onClick={onBack}>
            <Image
              src="/icon-arrow-left-black.svg"
              alt="Back to build metric"
              width="24"
              height="24"
              className="absolute top-4 left-6"
            />
          </button>
        )}
        <h1 className="mt-6 inter-600 text-lg text-text-secondary">
          Add few-shot examples
        </h1>
      </div>
      <div className="flex-grow min-h-0 flex flex-col overflow-auto">
        <div className="flex flex-col">
          {examples.map((example, index) => (
            <Example
              key={index}
              example={example}
              inputVariables={inputVariables}
              scoringRuberic={scoringRuberic}
              index={index}
              onExampleChange={(example) => {
                const newExamples = [...examples];
                newExamples[index] = example;
                onExamplesChange(newExamples);
              }}
              removeExample={() => removeExample(index)}
              resetExample={() => resetExample(index)}
              isOnlyExample={examples.length === 1}
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex gap-x-4 mb-4">
          <Tooltip
            hidden={!addExampleDisabled}
            id="add-another-example-disabled"
            html={maxExamplesTooltipHtml}
            containerClassName="flex-1 flex"
          >
            <SecondaryButton
              onClick={createNewExample}
              disabled={addExampleDisabled}
              className="flex-1 px-0"
            >
              <Image
                src={
                  addExampleDisabled
                    ? "/plus-icon-disabled.svg"
                    : "/plus-icon-black.svg"
                }
                alt="Create new Example"
                width="20"
                height="20"
                className="pr-1"
              />
              Add another example
            </SecondaryButton>
          </Tooltip>
          <Tooltip
            hidden={!generateButtonDisabled}
            id="generate-another-example-disabled"
            html={getGenerateExamplesTooltip()}
            containerClassName="flex flex-1 min-w-0"
          >
            <SecondaryButton
              disabled={generateButtonDisabled}
              onClick={generateExample}
              className="flex-1 min-w-0 px-0"
            >
              <Image
                src={
                  generateButtonDisabled
                    ? "/sparkle-icon-disabled.svg"
                    : "/sparkle-icon-black.svg"
                }
                alt="Generate new Example"
                width="20"
                height="20"
                className="pr-1"
              />
              Generate another example
            </SecondaryButton>
          </Tooltip>
        </div>
        <PrimaryButton
          disabled={!allExamplesComplete}
          onClick={metricId === null ? onSave : onUpdateExamples}
        >
          Save few-shot examples
        </PrimaryButton>
      </div>
    </div>
  );
};

export { AddExamples };
