import { GetTestCaseCollectionsResponse } from "@/app/lib/api/testCaseCollections/get";
import { GetTestCasesForMetricResponse } from "@/app/lib/api/testCases/getTestCasesForMetric";
import { useState } from "react";
import classNames from "classnames";
import { PrimaryButton } from "@/app/lib/components/Buttons/PrimaryButton";
import { UpdateTestCaseCollectionRequest } from "@/app/lib/api/testCaseCollections/update";

function UpdateCollection({
  testCaseCollections,
  onClose,
  testCases,
  selectedTestCaseCollectionId,
  setSelectedTestCaseCollectionId,
  updateTestCaseCollection,
}: {
  testCaseCollections: GetTestCaseCollectionsResponse;
  testCases: GetTestCasesForMetricResponse | null;
  onClose: () => void;
  selectedTestCaseCollectionId: string | null;
  setSelectedTestCaseCollectionId: (id: string) => void;
  updateTestCaseCollection: (request: UpdateTestCaseCollectionRequest) => void;
}) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(selectedTestCaseCollectionId);

  const selectedCollection = testCaseCollections.find(
    (collection) => collection.id === selectedCollectionId
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <p className="inter-500 text-xs text-text-secondary opacity-70 mb-3">
        Select a test set to update with your current test cases
      </p>
      {testCaseCollections.length > 0 ? (
        <div className="flex flex-col flex-1 bg-white py-2 border border-border-primary rounded items-stretch min-h-0 overflow-auto">
          {testCaseCollections.map((testCaseCollection, index) => (
            <button
              className={classNames(
                "text-left px-2 flex items-center justify-between py-2 border-border-primary border-t",
                {
                  "bg-gray": selectedCollectionId === testCaseCollection.id,
                  "border-b": index + 1 === testCaseCollections.length,
                }
              )}
              key={testCaseCollection.id}
              onClick={() => {
                setSelectedCollectionId(testCaseCollection.id);
              }}
            >
              <div className="flex items-center">
                <p className="inter-500 text-sm text-text-secondary mr-2">
                  {testCaseCollection.name}
                </p>
                <p className="inter-500 text-xs text-text-secondary opacity-70 !italic">
                  {testCaseCollection.description}
                </p>
              </div>
              <p className="inter-500 text-xs text-text-secondary opacity-70">
                ({testCaseCollection.testCases.length} test cases)
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="border flex items-center justify-center h-20 bg-white border-border-primary rounded">
          <p className="text-sm inter-400 text-text-secondary opacity-70">
            No test sets yet
          </p>
        </div>
      )}
      <PrimaryButton
        onClick={() => {
          updateTestCaseCollection({
            id: selectedCollection!.id,
            testCaseCollection: { testCases: testCases! },
          });
          setSelectedTestCaseCollectionId(selectedCollection!.id);
          onClose();
        }}
        disabled={!selectedCollection}
        className="mt-2"
      >
        Update collection
      </PrimaryButton>
    </div>
  );
}

export { UpdateCollection };
