import { MetricResponse } from "@/app/lib/api/metrics/get";
import { BaseDropdown, ChangeHandler } from "./BaseDropdown";
import classNames from "classnames";

const VersionDropdown = ({
  selectedPrompt,
  onChange,
  prompts,
  className = "",
}: {
  selectedPrompt: MetricResponse["prompts"][number] | null;
  onChange: ChangeHandler;
  prompts: MetricResponse["prompts"] | null;
  className?: string;
}) => {
  if (!prompts) {
    return null;
  }

  const options = prompts
    .map((prompt) => ({
      value: prompt.id,
      label: `v${prompt.version}`,
    }))
    .reverse();

  if (!selectedPrompt) {
    return null;
  }

  return (
    <BaseDropdown
      value={{ value: selectedPrompt.id, label: `v${selectedPrompt.version}` }}
      onChange={onChange}
      options={options}
      className={classNames(className, "min-w-24")}
    />
  );
};

export { VersionDropdown };
