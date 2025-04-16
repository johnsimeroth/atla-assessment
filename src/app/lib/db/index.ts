import {
  FewShot,
  Metric,
  Prompt,
  TestCase,
  TestCaseCollection,
} from "../types";

const createMetric = (metric: Metric) => {
  const metrics = JSON.parse(localStorage.getItem("metrics") || "{}");
  metrics[metric.id] = metric;
  localStorage.setItem("metrics", JSON.stringify(metrics));
};

const getMetrics = (): Metric[] => {
  return Object.values(JSON.parse(localStorage.getItem("metrics") || "{}"));
};

const getMetricById = (id: Metric["id"]): Metric | null => {
  return JSON.parse(localStorage.getItem("metrics") || "{}")[id] || null;
};

const deleteMetric = ({ id }: { id: Metric["id"] }) => {
  const metrics = JSON.parse(localStorage.getItem("metrics") || "{}");
  delete metrics[id];
  localStorage.setItem("metrics", JSON.stringify(metrics));
};

const createPrompt = (prompt: Prompt) => {
  const prompts = JSON.parse(localStorage.getItem("prompts") || "{}");
  prompts[prompt.id] = prompt;
  localStorage.setItem("prompts", JSON.stringify(prompts));
};

const getPromptById = (id: Metric["id"]): Prompt | null => {
  return JSON.parse(localStorage.getItem("prompts") || "{}")[id] || null;
};

const getPromptsForMetric = (metricId: Metric["id"]): Prompt[] => {
  const metrics = getMetrics();

  return (
    metrics
      .find((metric) => metric.id === metricId)
      ?.prompts.map(({ id: promptId }) => {
        const prompt = getPromptById(promptId);
        if (prompt === null) {
          throw new Error("Prompt not found");
        }

        return prompt;
      }) || []
  );
};

const deletePrompt = ({ id }: { id: Prompt["id"] }) => {
  const prompts = JSON.parse(localStorage.getItem("prompts") || "{}");
  delete prompts[id];
  localStorage.setItem("prompts", JSON.stringify(prompts));
};

const createFewShot = (fewShot: FewShot) => {
  const fewShots = JSON.parse(localStorage.getItem("fewShots") || "{}");
  fewShots[fewShot.id] = fewShot;
  localStorage.setItem("fewShots", JSON.stringify(fewShots));
};

const getFewShotById = (id: FewShot["id"]) => {
  return JSON.parse(localStorage.getItem("fewShots") || "{}")[id];
};

const deleteFewShot = ({ id }: { id: FewShot["id"] }) => {
  const fewShots = JSON.parse(localStorage.getItem("fewShots") || "{}");
  delete fewShots[id];
  localStorage.setItem("fewShots", JSON.stringify(fewShots));
};

const createTestCase = (testCase: TestCase) => {
  const testCases = JSON.parse(localStorage.getItem("testCases") || "{}");
  testCases[testCase.id] = testCase;
  localStorage.setItem("testCases", JSON.stringify(testCases));
};

const getTestCaseById = (id: TestCase["id"]): TestCase | null => {
  return JSON.parse(localStorage.getItem("testCases") || "{}")[id] || null;
};

const deleteTestCase = (id: TestCase["id"]) => {
  const testCases = JSON.parse(localStorage.getItem("testCases") || "{}");
  delete testCases[id];
  localStorage.setItem("testCases", JSON.stringify(testCases));
};

const createTestCaseCollection = (testCaseCollection: TestCaseCollection) => {
  const testCaseCollections = JSON.parse(
    localStorage.getItem("testCaseCollections") || "{}"
  );
  testCaseCollections[testCaseCollection.id] = testCaseCollection;
  localStorage.setItem(
    "testCaseCollections",
    JSON.stringify(testCaseCollections)
  );
};

const getTestCaseCollections = (): TestCaseCollection[] => {
  return Object.values(
    JSON.parse(localStorage.getItem("testCaseCollections") || "{}")
  );
};

const getTestCaseCollectionById = ({
  id,
}: {
  id: TestCaseCollection["id"];
}): TestCaseCollection | null => {
  return (
    JSON.parse(localStorage.getItem("testCaseCollections") || "{}")[id] || null
  );
};

export {
  createMetric,
  createPrompt,
  createFewShot,
  getPromptById,
  getMetrics,
  getFewShotById,
  createTestCase,
  getMetricById,
  getTestCaseById,
  deleteTestCase,
  getPromptsForMetric,
  deleteMetric,
  deletePrompt,
  deleteFewShot,
  createTestCaseCollection,
  getTestCaseCollections,
  getTestCaseCollectionById,
};
