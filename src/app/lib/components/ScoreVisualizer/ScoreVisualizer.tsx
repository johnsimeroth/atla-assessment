"use client";

import { MetricResponse } from "../../api/metrics/get";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BaseDropdown,
  Option,
} from "@/app/lib/components/Dropdowns/BaseDropdown";
import { Preconditions } from "@/app/lib/utils/preconditions";
import { useGetTestCasesForMetric } from "../../queries/useGetTestCasesForMetric";
import { numToChar } from "./numToChar";
import {
  AllVersionsData,
  CurrentVersionData,
  plotAllVersionScores,
  plotCurrentVersionScores,
} from "./plots";

const DropdownOptions: Option[] = [
  {
    value: "this_version",
    label: "This version",
  },
  {
    value: "all_versions",
    label: "All versions",
  },
];

const ScoreVisualizer = ({
  selectedPrompt,
  selectedMetric,
}: {
  selectedPrompt: MetricResponse["prompts"][number] | null;
  selectedMetric: MetricResponse | null;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [selectedOption, setSelectedOption] = useState<Option>(
    DropdownOptions[0]
  );
  const { data: testCases, error } = useGetTestCasesForMetric({
    metricId: selectedMetric?.id,
  });

  const scoreDataForPrompt: CurrentVersionData = useMemo(() => {
    if (!testCases || !selectedPrompt) return [];
    return testCases.map((testCase, i) => ({
      "Test case": numToChar(i),
      "Test case input": testCase.input,
      "Atla score": testCase.scores[selectedPrompt.id]?.atla_score,
      "Expected score": testCase.scores[selectedPrompt.id]?.expected_score,
    }));
  }, [testCases, selectedPrompt]);

  const scoreDataForAllPrompts: AllVersionsData = useMemo(() => {
    if (!testCases || !selectedMetric) return [];
    return selectedMetric?.prompts.map((prompt) =>
      testCases.map((testCase, i) => {
        const atlaScore = testCase.scores[prompt.id]?.atla_score;
        const expectedScore = testCase.scores[prompt.id]?.expected_score;
        return {
          Version: prompt.version,
          "Test case": numToChar(i),
          "Test case input": testCase.input,
          "Atla score": atlaScore,
          "Expected score": expectedScore,
          Deviation:
            atlaScore != null && expectedScore != null
              ? atlaScore - expectedScore
              : null,
        };
      })
    );
  }, [testCases, selectedMetric]);

  useEffect(() => {
    const chartContainer = chartRef.current;
    if (!chartContainer) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Array should only have one entry - could add a Precondition check or jest test if we wanted to enforce that
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(chartContainer);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const chartContainer = chartRef.current;
    if (!chartContainer) return;

    chartContainer.innerHTML = "";
    const chart =
      selectedOption.value === "this_version"
        ? plotCurrentVersionScores({ width, data: scoreDataForPrompt })
        : plotAllVersionScores({ width, data: scoreDataForAllPrompts });

    chartContainer.appendChild(chart);
  }, [width, scoreDataForPrompt, scoreDataForAllPrompts, selectedOption.value]);

  return (
    <div className="mt-8">
      <div className="flex flex-row items-center mb-2">
        <h2 className="flex inter-600 text-text-secondary text-lg mr-3">
          Visualize this metric&apos;s performance
        </h2>
        <BaseDropdown
          value={selectedOption}
          onChange={(option) =>
            setSelectedOption(Preconditions.checkExists(option))
          }
          options={DropdownOptions}
          className="w-40"
        />
      </div>
      <div className="markdown-box" ref={chartRef}></div>
    </div>
  );
};

export { ScoreVisualizer };
