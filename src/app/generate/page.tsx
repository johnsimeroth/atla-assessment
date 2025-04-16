"use client";

import Image from "next/image";
import { useSelectedPrompt } from "@/app/useSelectedPrompt";
import { GenerateHeader } from "@/app/lib/components/Generate/GenerateHeader/GenerateHeader";
import { useRouter } from "next/navigation";
import { GenerateBody } from "@/app/lib/components/Generate/GenerateBody/GenerateBody";
import { useTestCaseData } from "@/app/generate/useTestCaseData";
import { GenerateFooter } from "@/app/lib/components/Generate/GenerateFooter/GenerateFooter";
import { useRunEvaluations } from "@/app/generate/useRunEvaluations";
import { useState } from "react";
import { PromptModal } from "@/app/lib/components/Generate/Prompt/PromptModal";
import { useCohensKappa } from "@/app/generate/useCohensKappa";
import { useTestCaseCollections } from "@/app/generate/useTestCaseCollections";
import { CollectionsModal } from "@/app/lib/components/Generate/CollectionsModal/CollectionsModal";
import { useEditTemplate } from "@/app/lib/components/Prompt/useEditTemplate";
import { checkIsInitialMetric } from "@/app/lib/metrics/checkIsInitialMetric";

export default function Generate() {
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const [collectionsModalPage, setCollectionsModalPage] = useState<
    string | null
  >(null);

  const [selectedTestCaseCollectionId, setSelectedTestCaseCollectionId] =
    useState<string | null>(null);

  const { selectedPrompt, selectedMetric, handleSetSelectedPrompt } =
    useSelectedPrompt();

  const {
    isLoading,
    testCases,
    inputs,
    setTestCaseValue,
    addTestCase,
    setTestCaseValues,
    testCasesWithScores,
    completeTestCases,
    removeTestCase,
    loadTestCases,
  } = useTestCaseData({
    metricId: selectedMetric?.id,
    selectedMetric,
    selectedPrompt,
  });

  const { kappa } = useCohensKappa({
    testCases: testCasesWithScores,
    scoringCriteria: selectedMetric?.scoring_criteria,
    promptId: selectedPrompt?.id,
  });

  const {
    runEvaluations,
    runningEvaluations,
    runningAllEvaluations,
    runAllEvaluations,
  } = useRunEvaluations({
    scoringRuberic: selectedMetric?.scoring_criteria,
    template: selectedPrompt?.template,
    examples: selectedMetric?.few_shots,
    setTestCaseValues,
    completeTestCases,
  });

  const {
    createTestCaseCollection,
    testCaseCollections,
    updateTestCaseCollection,
  } = useTestCaseCollections();

  const { template, setTemplate, templateChanged, createNewPromptVersion } =
    useEditTemplate({
      selectedPrompt,
      selectedMetric,
    });

  const metricMainPageUrl = `/?metric=${selectedMetric?.id}&prompt=${selectedPrompt?.id}`;

  return (
    <main className="h-full w-full bg-gray flex items-stretch flex-col p-2.5">
      <header className="h-16 min-h-16 flex items-center justify-between p-2">
        <button onClick={() => router.push(metricMainPageUrl)}>
          <Image src="/atla-logo.svg" alt="Atla Logo" width="75" height="24" />
        </button>
        <div />
      </header>
      <div className="bg-white h-full ml-2.5 rounded-2xl border border-border-gray flex flex-col py-6 min-h-0">
        <GenerateHeader
          onBack={() => router.push(metricMainPageUrl)}
          title={selectedMetric?.name}
          showPrompt={showPrompt}
          onPromptToggle={setShowPrompt}
          kappa={kappa}
          runningAllEvaluations={runningAllEvaluations}
          runAllEvaluations={runAllEvaluations}
          noCompleteTestCases={
            completeTestCases === null || completeTestCases.length === 0
          }
          selectedPrompt={selectedPrompt}
          selectedMetric={selectedMetric}
          setSelectedPrompt={handleSetSelectedPrompt}
          templateChanged={templateChanged}
        />
        {!isLoading && testCases && (
          <GenerateBody
            removeTestCase={removeTestCase}
            testCases={testCases}
            hasContext={inputs.hasContext}
            hasReference={inputs.hasReference}
            onValueChange={setTestCaseValue}
            scoringCriteria={selectedMetric!.scoring_criteria}
            runEvaluations={runEvaluations}
            runningEvaluations={runningEvaluations}
            completeTestCases={completeTestCases}
            selectedPromptId={selectedPrompt?.id}
            selectedMetricId={selectedMetric?.id}
            hasMaxFewShots={selectedMetric?.few_shots?.length === 3}
            isInitialMetric={checkIsInitialMetric(selectedMetric?.name)}
          />
        )}
        <GenerateFooter
          onAddTestCase={addTestCase}
          setCollectionsModalPage={setCollectionsModalPage}
          setShowPrompt={setShowPrompt}
        />
        {showPrompt && (
          <PromptModal
            selectedPrompt={selectedPrompt!}
            selectedMetric={selectedMetric!}
            onClose={() => setShowPrompt(false)}
            template={template!}
            setTemplate={setTemplate}
            templateChanged={templateChanged}
            createNewPromptVersion={createNewPromptVersion}
          />
        )}
        {collectionsModalPage && (
          <CollectionsModal
            onClose={() => setCollectionsModalPage(null)}
            page={collectionsModalPage}
            testCaseCollections={testCaseCollections}
            loadTestCases={loadTestCases}
            createTestCaseCollection={createTestCaseCollection}
            testCases={testCases}
            selectedTestCaseCollectionId={selectedTestCaseCollectionId}
            setSelectedTestCaseCollectionId={setSelectedTestCaseCollectionId}
            updateTestCaseCollection={updateTestCaseCollection}
          />
        )}
      </div>
    </main>
  );
}
