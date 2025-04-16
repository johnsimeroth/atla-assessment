import { BlankSlate } from "./BlankSlate";
import { PopulatedPrompt } from "./PopulatedPrompt/PopulatedPrompt";
import { MetricResponse } from "../../api/metrics/get";
import { ScoreVisualizer } from "../ScoreVisualizer/ScoreVisualizer";

const Prompt = ({
  selectedPrompt,
  selectedMetric,
  setSelectedPrompt,
}: {
  selectedPrompt: MetricResponse["prompts"][number] | null;
  selectedMetric: MetricResponse | null;
  setSelectedPrompt: (value: {
    selectedPromptId: string | null;
    selectedMetricId: string | null;
  }) => void;
}) => {
  return (
    <div className="bg-white h-full ml-2.5 rounded-2xl border border-border-gray flex flex-col py-4 px-6">
      {selectedPrompt === null ? (
        <BlankSlate />
      ) : (
        <>
          <PopulatedPrompt
            selectedPrompt={selectedPrompt}
            selectedMetric={selectedMetric!}
            setSelectedPrompt={setSelectedPrompt}
          />
          <ScoreVisualizer
            selectedPrompt={selectedPrompt}
            selectedMetric={selectedMetric}
          />
        </>
      )}
    </div>
  );
};

export { Prompt };
