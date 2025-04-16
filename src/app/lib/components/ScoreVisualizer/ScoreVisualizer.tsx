"use client";

import { MetricResponse } from "../../api/metrics/get";
import { plot, lineY } from "@observablehq/plot";
import unstacked from "@/../unstacked.json";
import { useEffect, useMemo, useRef, useState } from "react";
import { BaseDropdown } from "@/app/lib/components/Dropdowns/BaseDropdown";
import { Preconditions } from "@/app/lib/utils/preconditions";
import { useGetTestCasesForMetric } from "../../queries/useGetTestCasesForMetric";
import { numToChar } from "./numToChar";

const DropdownOptions = [
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
  const [selectedOption, setSelectedOption] = useState<
    (typeof DropdownOptions)[number]
  >(DropdownOptions[0]);
  const { data: testCases, error } = useGetTestCasesForMetric({
    metricId: selectedMetric?.id,
  });

  const scoreDataForPrompt = useMemo(() => {
    if (!testCases || !selectedPrompt) return [];
    return testCases.map((testCase, i) => ({
      "Test case": numToChar(i),
      "Atla score": testCase.scores[selectedPrompt.id]?.atla_score,
      "Expected score": testCase.scores[selectedPrompt.id]?.expected_score,
    }));
  }, [testCases, selectedPrompt]);

  console.log(testCases, error);
  // const scoreDataForAllPrompts = useMemo(() => {
  //   if (!testCases) return [];
  //   return testCases.map((testCase, i) => ({
  //     label: numToChar(i),
  //     "Atla score": testCase.scores[selectedPrompt.id]?.atla_score,
  //     "Expected score": testCase.scores[selectedPrompt.id]?.expected_score,
  //   }));
  // }, [testCases]);
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
    const chart = plot({
      width,
      height: 500,
      y: { grid: true, label: "Score" },
      color: { legend: true },
      marks: [
        lineY(scoreDataForPrompt, {
          x: "Test case",
          y: "Atla score",
          stroke: () => "Atla score",
        }),
        lineY(scoreDataForPrompt, {
          x: "Test case",
          y: "Expected score",
          stroke: () => "Expected score",
        }),
      ],
    });
    chartContainer.appendChild(chart);
  }, [width, scoreDataForPrompt]);

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
