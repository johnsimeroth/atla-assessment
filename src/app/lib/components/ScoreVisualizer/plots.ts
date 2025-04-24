import { plot, lineY } from "@observablehq/plot";

interface PlotDatum {
  "Test case": string;
  "Test case input": string | null;
  "Atla score": number | null;
  "Expected score": number | null;
}
interface AllVersionsDatum extends PlotDatum {
  Version: number | undefined;
  Deviation: number | null;
}

export type CurrentVersionData = PlotDatum[];
export type AllVersionsData = AllVersionsDatum[][];

const PLOT_HEIGHT = 300;

export function plotCurrentVersionScores({
  width,
  data,
}: {
  width: number;
  data: CurrentVersionData;
}) {
  return plot({
    width,
    height: PLOT_HEIGHT,
    y: { grid: true, label: "Score" },
    color: { legend: true },
    marks: [
      lineY(data, {
        x: "Test case",
        y: "Atla score",
        stroke: () => "Atla score",
      }),
      lineY(data, {
        x: "Test case",
        y: "Expected score",
        stroke: () => "Expected score",
      }),
    ],
  });
}

export function plotAllVersionScores({
  width,
  data,
}: {
  width: number;
  data: AllVersionsData;
}) {
  return plot({
    width,
    height: PLOT_HEIGHT,
    y: { grid: true, label: "Deviation" },
    color: { legend: true },
    marks: data.map((prompt) => {
      const version = prompt[0].Version;
      return lineY(prompt, {
        x: "Test case",
        y: "Deviation",
        stroke: () => (version ? `v${version}` : null),
      });
    }),
  });
}
