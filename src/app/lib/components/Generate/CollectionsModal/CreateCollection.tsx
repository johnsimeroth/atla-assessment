import { GetTestCaseCollectionsResponse } from "@/app/lib/api/testCaseCollections/get";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";
import { useState } from "react";
import classNames from "classnames";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import { CreateTestCaseCollectionRequest } from "@/app/lib/api/testCaseCollections/create";

function CreateCollection({
  createTestCaseCollection,
  testCases,
  onClose,
}: {
  createTestCaseCollection: (request: CreateTestCaseCollectionRequest) => void;
  testCases: GetTestCasesForMetricResponse | null;
  onClose: () => void;
}) {
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");

  const cleanedTestCases =
    testCases?.map((testCase) => ({
      ...testCase,
      scores: {},
      critique: null,
    })) || null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <p className="inter-500 text-xs text-text-secondary opacity-70 mb-3">
        Create a new test set
      </p>
      <div className="flex flex-col flex-1">
        <input
          className="border border-border-primary w-full rounded inter-400 text-text-secondary text-xs py-1.5 px-2 mb-2"
          type="text"
          placeholder="Enter the test set name..."
          value={name || ""}
          onChange={(event) => setName(event.target.value || null)}
        />
        <textarea
          className="w-full inter-400 text-xs text-text-secondary py-1.5 px-2 border border-border-primary rounded h-20 resize-none mb-1"
          placeholder="Describe the test set..."
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <PrimaryButton
        onClick={() => {
          createTestCaseCollection({
            name: name!,
            description: description!,
            testCases: cleanedTestCases!,
          });
          onClose();
        }}
        disabled={name === null}
        className="mt-2"
      >
        Create test set
      </PrimaryButton>
    </div>
  );
}

export { CreateCollection };
