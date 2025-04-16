import { getMetrics } from "@/app/lib/db/index";
import { Metric, Prompt, ScoringCriteria, TestCase } from "../types";
import { Preconditions } from "../utils/preconditions";

const initialMetrics: Record<string, Metric> = {
  "b24fa599-5bfb-47ce-b4c0-86427565c337": {
    id: "b24fa599-5bfb-47ce-b4c0-86427565c337",
    name: "hallucination",
    model: "atla",
    isDraft: false,
    updatedAt: "2024-08-27T14:54:38.406Z",
    scoringCriteria: ScoringCriteria.OneToFive,
    prompts: [
      {
        version: 1,
        isDeployed: true,
        id: "085ba0d5-638d-4272-ae22-cdd08b97a61b",
      },
    ],
    fewShots: [],
    testCases: [
      {
        id: "f109835d-4112-4ae3-8deb-9475a2f3ee3b",
      },
      {
        id: "2b5c7a45-2925-4c42-89b3-41564f9eb7c6",
      },
      {
        id: "9aac8677-507a-4fb7-a880-7ce435227300",
      },
    ],
  },
  "f69c855f-23c2-4547-a4cd-9f245320e00a": {
    id: "f69c855f-23c2-4547-a4cd-9f245320e00a",
    name: "logical_coherence",
    model: "atla",
    isDraft: false,
    updatedAt: "2024-08-27T15:00:48.761Z",
    scoringCriteria: ScoringCriteria.OneToFive,
    prompts: [
      {
        version: 1,
        isDeployed: true,
        id: "11faa329-6f95-48cf-a798-cb93aa809cd3",
      },
    ],
    fewShots: [],
    testCases: [
      {
        id: "fc14fa2a-2911-4e84-9f34-0ffa4dd02456",
      },
      {
        id: "4691174c-39bc-462f-99d4-f023b9379a5f",
      },
      {
        id: "5ec7bad5-206b-4339-81fb-df89e30ebc13",
      },
    ],
  },
  "22c6ae98-26e7-4434-931d-2f49999a7436": {
    id: "22c6ae98-26e7-4434-931d-2f49999a7436",
    name: "context_relevance",
    model: "atla",
    isDraft: false,
    updatedAt: "2024-08-27T14:52:55.242Z",
    scoringCriteria: ScoringCriteria.OneToFive,
    prompts: [
      {
        version: 1,
        isDeployed: true,
        id: "9a1c24b2-813b-43c0-a306-9890fb029570",
      },
    ],
    fewShots: [],
    testCases: [
      {
        id: "813bf775-2adf-4cfe-9867-764b8a9ed187",
      },
      {
        id: "34c47864-670e-4212-92bf-5a0fe14b9ab1",
      },
      {
        id: "fae041bd-1fc5-45db-a22a-bf3dc133dbe9",
      },
    ],
  },
  "91347ffa-1e89-4330-8955-f11734af4ca3": {
    id: "91347ffa-1e89-4330-8955-f11734af4ca3",
    name: "faithfulness",
    model: "atla",
    isDraft: false,
    updatedAt: "2024-08-27T14:50:29.056Z",
    scoringCriteria: ScoringCriteria.OneToFive,
    prompts: [
      {
        version: 1,
        isDeployed: true,
        id: "ce44f1b4-28c9-4b0a-ac36-49f0e8cf18d3",
      },
    ],
    fewShots: [],
    testCases: [
      {
        id: "1d1378a6-8cf3-4f80-9c39-c9a820691147",
      },
      {
        id: "fdd088e1-4ac2-4e9f-b9ba-e76af310bbfa",
      },
      {
        id: "8138a77d-a91b-42a3-9426-ddd908d22322",
      },
    ],
  },
  "1053e440-92f0-4d7b-a684-4eff33fec80f": {
    id: "1053e440-92f0-4d7b-a684-4eff33fec80f",
    name: "precision",
    model: "atla",
    isDraft: false,
    updatedAt: "2024-08-27T14:56:49.511Z",
    scoringCriteria: ScoringCriteria.OneToFive,
    prompts: [
      {
        version: 1,
        isDeployed: false,
        id: "5ffc6d5a-1a02-43a0-9fa4-f6fe9f233c3e",
      },
    ],
    fewShots: [],
    testCases: [
      {
        id: "ba1d02df-5663-4a3c-a35e-5b75eba1b792",
      },
      {
        id: "d14905b5-1e41-4be2-b392-69ba80858f0e",
      },
      {
        id: "d6f27d4d-09ab-4de1-8f3c-ba7715feddd1",
      },
    ],
  },
  "80de6513-71da-4462-b843-842d86c3330d": {
    id: "80de6513-71da-4462-b843-842d86c3330d",
    name: "recall",
    model: "atla",
    isDraft: false,
    updatedAt: "2024-08-27T14:59:18.976Z",
    scoringCriteria: ScoringCriteria.OneToFive,
    prompts: [
      {
        version: 1,
        isDeployed: false,
        id: "de9cecf2-4b85-4af7-8f57-4fa79765dfe6",
      },
    ],
    fewShots: [],
    testCases: [
      {
        id: "560a64f4-3eab-4de6-ab87-94ee58d7b15e",
      },
      {
        id: "88d8faa8-b102-40a1-9acd-0845fd452a12",
      },
      {
        id: "a0cc4dae-8a24-4033-ac70-7398cce34735",
      },
    ],
  },
};
const initialPrompts: Record<string, Prompt> = {
  "085ba0d5-638d-4272-ae22-cdd08b97a61b": {
    id: "085ba0d5-638d-4272-ae22-cdd08b97a61b",
    version: 1,
    isDeployed: true,
    updatedAt: "2024-08-27T14:54:38.405Z",
    name: "hallucination",
    template:
      "### **Content Accuracy Evaluation:**\n" +
      "\n" +
      "**Objective:** Rate the responses of an AI model, focusing on the absence of incorrect or unrelated content compared to the reference response. Ensure that the AI's response does not contain any information that is either factually incorrect or not pertinent to the reference response. Do not evaluate generally or based on the style of the response.\n" +
      "\n" +
      "**Scoring:**\n" +
      "- **Lowest score:** The response contains only incorrect or unrelated information with no alignment to the reference.\n" +
      "- **Low score:** The response contains mostly incorrect or unrelated information with minimal relevant or correct details.\n" +
      "- **Medium score:** The response has a balance of correct and incorrect or unrelated information.\n" +
      "- **High score:** The response contains mostly correct and relevant information with minor incorrect or unrelated details.\n" +
      "- **Highest score:** The response is completely free of incorrect or unrelated content, perfectly aligning with the reference.\n" +
      "\n" +
      "**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.",
    inputVariables: ["input", "response", "reference"],
    criteria:
      "Assess the presence of incorrect or unrelated content in the AI’s response against the reference response.",
  },
  "11faa329-6f95-48cf-a798-cb93aa809cd3": {
    id: "11faa329-6f95-48cf-a798-cb93aa809cd3",
    version: 1,
    isDeployed: true,
    updatedAt: "2024-08-27T15:00:48.761Z",
    name: "logical coherence",
    template:
      "### **Logical Consistency Evaluation:**\n" +
      "\n" +
      "**Objective:** Rate the responses of an AI model, focusing on the logical flow, consistency, and rationality of the response. Assess how well the response maintains a coherent and logical progression, stays consistent with the information provided, and uses rational arguments or explanations.\n" +
      "\n" +
      "**Scoring:**\n" +
      "- **Lowest score:** The response shows no logical flow, is inconsistent with provided information or context, and lacks rationality.\n" +
      "- **Low score:** The response has minimal logical flow, contains inconsistencies, and shows only slight signs of rationality.\n" +
      "- **Medium score:** The response generally follows a logical flow, is mostly consistent with the provided information, and is rational, with minor lapses in logic or consistency.\n" +
      "- **High score:** The response has a strong logical flow, is consistent with all provided information, and demonstrates clear rationality with only very minor errors.\n" +
      "- **Highest score:** The response is exemplary in its logical flow, maintains perfect consistency with the provided information, and is entirely rational throughout.\n" +
      "\n" +
      "**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.",
    inputVariables: ["input", "response"],
    criteria:
      "Measure the logical flow, consistency, and rationality of the response.",
  },
  "9a1c24b2-813b-43c0-a306-9890fb029570": {
    id: "9a1c24b2-813b-43c0-a306-9890fb029570",
    version: 1,
    isDeployed: true,
    updatedAt: "2024-08-27T14:52:55.242Z",
    name: "context relevance",
    template:
      "### **Context Relevance Evaluation:**\n" +
      "\n" +
      "**Objective:** Rate the relevance of the retrieved context in relation to the user query. Examine the retrieved context to ensure it relevantly covers the user query. Focus on appropriateness of the context, not on style or comprehensiveness. Evaluate only the retrieved context, not the AI's response.\n" +
      "\n" +
      "**Scoring:**\n" +
      "- **Lowest score:** The context is completely irrelevant to the query or topic.\n" +
      "- **Low score:** The context is only tangentially related to the query, with minimal relevant information.\n" +
      "- **Medium score:** The context is somewhat relevant, addressing parts of the query but missing key aspects.\n" +
      "- **High score:** The context is highly relevant, addressing most aspects of the query directly.\n" +
      "- **Highest score:** The context is perfectly on-point, directly and comprehensively addressing the query.\n" +
      "\n" +
      "**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.",
    inputVariables: ["input", "response", "context"],
    criteria: "Measure how on-point the retrieved context is.",
  },
  "ce44f1b4-28c9-4b0a-ac36-49f0e8cf18d3": {
    id: "ce44f1b4-28c9-4b0a-ac36-49f0e8cf18d3",
    version: 1,
    isDeployed: true,
    updatedAt: "2024-08-27T14:50:29.056Z",
    name: "faithfulness",
    template:
      "### **Groundedness Evaluation:**\n" +
      "\n" +
      "**Objective:** Rate the responses of an AI model based on how well the statements are grounded in the provided context. Do not evaluate based on your internal knowledge. Assess the AI response to ensure it includes information that is supported by the given context. Do not evaluate generally or based on the breadth of the response.\n" +
      "\n" +
      "**Scoring:**\n" +
      "- **Lowest score:** The response contains statements that directly contradict the context or are entirely unsupported by it.\n" +
      "- **Low score:** The response includes some information from the context, but contains significant ungrounded claims or misinterpretations.\n" +
      "- **Medium score:** The response is mostly grounded in the context, with only minor unsupported claims or misinterpretations.\n" +
      "- **High score:** The response closely aligns with the context, with only rare and minor deviations.\n" +
      "- **Highest score:** The response is fully grounded in the context, with all statements accurately reflecting the provided information.\n" +
      "\n" +
      "**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.",
    inputVariables: ["input", "response", "context"],
    criteria:
      "Determine if the response is factually based on the provided context.",
  },
  "5ffc6d5a-1a02-43a0-9fa4-f6fe9f233c3e": {
    id: "5ffc6d5a-1a02-43a0-9fa4-f6fe9f233c3e",
    version: 1,
    isDeployed: true,
    updatedAt: "2024-08-27T14:56:49.511Z",
    name: "precision",
    template:
      "### **Relevance Evaluation:**\n" +
      "\n" +
      "**Objective:** Rate the responses of an AI model, focusing on how relevant each piece of information in the response is compared to the reference response. Assess whether the AI response includes only pertinent details that directly relate to the reference response. Do not evaluate generally or based on the breadth of the response.\n" +
      "\n" +
      "**Scoring:**\n" +
      "- **Lowest score:** The response is completely irrelevant or contradicts the reference response.\n" +
      "- **Low score:** The response includes some relevant information but is mostly filled with irrelevant or incorrect details.\n" +
      "- **Medium score:** The response is somewhat relevant with a balanced mix of relevant and irrelevant information.\n" +
      "- **High score:** The response is mostly relevant, containing only minor irrelevant details.\n" +
      "- **Highest score:** The response is entirely relevant, perfectly aligning with the reference response without any irrelevant information.\n" +
      "\n" +
      "**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.",
    inputVariables: ["input", "response", "reference"],
    criteria:
      "Assess the relevance of all the information in the response against the reference response.",
  },
  "de9cecf2-4b85-4af7-8f57-4fa79765dfe6": {
    id: "de9cecf2-4b85-4af7-8f57-4fa79765dfe6",
    version: 1,
    isDeployed: true,
    updatedAt: "2024-08-27T14:59:18.976Z",
    name: "recall",
    template:
      "### **Comprehensiveness Evaluation:**\n" +
      "\n" +
      "**Objective:** Rate the responses of an AI model based on how completely they capture the key facts and details from the reference response. Focus on the inclusion of all relevant information as presented in the reference.\n" +
      "\n" +
      "**Scoring:**\n" +
      "- **Lowest score:** The response misses almost all the key facts and details from the reference.\n" +
      "- **Low score:** The response includes only a few of the key facts and details from the reference.\n" +
      "- **Medium score:** The response captures a moderate amount of the key facts and details from the reference.\n" +
      "- **High score:** The response includes most of the key facts and details from the reference.\n" +
      "- **Highest score:** The response perfectly captures all key facts and details from the reference without omission.\n" +
      "\n" +
      "**Feedback:** Provide a concise justification, focusing solely on the evaluation criteria specified above and NOT evaluating generally. Keep it very BRIEF and to the point.",
    inputVariables: ["input", "response", "reference"],
    criteria:
      "Measure how completely the response captures the key facts and details of the reference response.",
  },
};

const initialTestCasesWithUnformattedScores: Record<
  string,
  Omit<TestCase, "scores"> & { expectedScore: number; atlaScore: null }
> = {
  "f109835d-4112-4ae3-8deb-9475a2f3ee3b": {
    input: "What are the main factors contributing to climate change?",
    response:
      "The primary factors contributing to climate change are the burning of fossil fuels, deforestation, and industrial activities that emit lots of greenhouse gases.",
    reference:
      "The main factors contributing to climate change include the burning of fossil fuels, deforestation, and industrial activities that release large amounts of greenhouse gases into the atmosphere.",
    critique: null,
    id: "f109835d-4112-4ae3-8deb-9475a2f3ee3b",
    expectedScore: 5,
    atlaScore: null,
  },
  "fc14fa2a-2911-4e84-9f34-0ffa4dd02456": {
    input: "What are the main stages of the water cycle?",
    response:
      "The main stages of the water cycle are evaporation, condensation, precipitation, and collection. Water evaporates into vapor, condenses into clouds, falls as precipitation, and collects in bodies of water to start the cycle again.",
    critique: null,
    id: "fc14fa2a-2911-4e84-9f34-0ffa4dd02456",
    expectedScore: 5,
    atlaScore: null,
  },
  "813bf775-2adf-4cfe-9867-764b8a9ed187": {
    input: "What are the benefits of exercise?",
    response:
      "Improved cardiovascular health, increased muscle strength, enhanced flexibility, and better mental well-being.",
    context:
      "[21] Exercise helps in improving cardiovascular health, building muscle strength, enhancing flexibility, and boosting mental health. It can help reduce the risk of chronic diseases such as heart disease, diabetes, and obesity.",
    critique: null,
    id: "813bf775-2adf-4cfe-9867-764b8a9ed187",
    expectedScore: 5,
    atlaScore: null,
  },
  "1d1378a6-8cf3-4f80-9c39-c9a820691147": {
    input: "How do solar panels generate electricity?",
    response:
      "Solar panels use photovoltaic cells to convert sunlight into electricity.",
    context:
      "Section 21 [3.2] Solar panels are made from semiconductor materials like silicon. Solar panels can be durable and have long service lifetimes, with some lasting up to 30 years or longer. They generate electricity by converting sunlight into electricity using photovoltaic cells. These cells create an electrical current when exposed to sunlight, which is then used to power electrical devices or sent to the grid.",
    critique: null,
    id: "1d1378a6-8cf3-4f80-9c39-c9a820691147",
    expectedScore: 5,
    atlaScore: null,
  },
  "ba1d02df-5663-4a3c-a35e-5b75eba1b792": {
    input: "What are the penalties for insider trading?",
    response:
      "Penalties for insider trading include fines and potential imprisonment.",
    reference:
      "Insider trading penalties can include both civil and criminal charges. Civil penalties may involve fines up to three times the profit gained or loss avoided, while criminal penalties can result in imprisonment for up to 20 years and fines up to $5 million for individuals.",
    critique: null,
    id: "ba1d02df-5663-4a3c-a35e-5b75eba1b792",
    expectedScore: 5,
    atlaScore: null,
  },
  "560a64f4-3eab-4de6-ab87-94ee58d7b15e": {
    input: "What are the effects of smoking on health?",
    response:
      "Smoking increases the risk of lung cancer, heart disease, stroke,chronic obstructive pulmonary disease, and can cause gum disease. It also harms fetal development during pregnancy.",
    reference:
      "Smoking has numerous adverse effects on health, including an increased risk of lung cancer, heart disease, stroke, and chronic obstructive pulmonary disease (COPD). It also leads to poor oral health, such as gum disease, and can harm fetal development during pregnancy.",
    critique: null,
    id: "560a64f4-3eab-4de6-ab87-94ee58d7b15e",
    expectedScore: 5,
    atlaScore: null,
  },
  "fdd088e1-4ac2-4e9f-b9ba-e76af310bbfa": {
    id: "fdd088e1-4ac2-4e9f-b9ba-e76af310bbfa",
    input:
      "What is the process of water purification in a typical water treatment plant?",
    response:
      "Water purification involves coagulation, which removes impurities, and then the water is filtered. Finally, salt is added to kill any remaining bacteria before the water is distributed for use.",
    context:
      "[2] Water purification in treatment plants typically involves several stages: coagulation, sedimentation, filtration, and disinfection. Coagulation adds chemicals that bind with impurities, forming larger particles. Sedimentation allows these particles to settle out of the water. Filtration removes smaller particles by passing water through sand, gravel, or charcoal. Finally, disinfection kills any remaining microorganisms, often using chlorine or ultraviolet light.",
    critique: null,
    expectedScore: 3,
    atlaScore: null,
  },
  "8138a77d-a91b-42a3-9426-ddd908d22322": {
    id: "8138a77d-a91b-42a3-9426-ddd908d22322",
    input: "How do plants perform photosynthesis?",
    response:
      "Photosynthesis happens when plants absorb water through their roots, which then turns into sugar. The process also involves plants taking in oxygen from the air and releasing carbon dioxide.",
    context:
      "Understanding Photosynthesis: Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in the chloroplasts of plant cells, where chlorophyll absorbs sunlight. This energy is used to convert carbon dioxide from the air and water from the soil into glucose, which plants use for food, releasing oxygen as a byproduct.",
    critique: null,
    expectedScore: 1,
    atlaScore: null,
  },
  "34c47864-670e-4212-92bf-5a0fe14b9ab1": {
    id: "34c47864-670e-4212-92bf-5a0fe14b9ab1",
    input: "What are the symptoms of the flu?",
    response:
      "Fever, chills, muscle aches, fatigue, sore throat, and runny nose.",
    context:
      "The flu can be a serious illness, especially for young children and the elderly. Many people confuse the flu with the common cold, but the flu generally causes more severe symptoms. It typically presents with symptoms such as fever, chills, and muscle aches. The flu season usually peaks during the winter months. It’s important to get vaccinated annually to reduce the risk of contracting the virus. Fatigue, a sore throat, and a runny nose are also common symptoms of the flu.",
    critique: null,
    expectedScore: 3,
    atlaScore: null,
  },
  "fae041bd-1fc5-45db-a22a-bf3dc133dbe9": {
    id: "fae041bd-1fc5-45db-a22a-bf3dc133dbe9",
    input: "What are the causes of deforestation?",
    response: "Large-scale removal of forests.",
    context:
      "[14] Deforestation refers to the large-scale removal of forests. It is a major environmental issue, especially in tropical rainforests. Many organizations work to combat deforestation by promoting sustainable land management practices. The Amazon rainforest is one of the most affected areas. The loss of forests can lead to a decrease in biodiversity and disrupt ecosystems.",
    critique: null,
    expectedScore: 1,
    atlaScore: null,
  },
  "2b5c7a45-2925-4c42-89b3-41564f9eb7c6": {
    id: "2b5c7a45-2925-4c42-89b3-41564f9eb7c6",
    input: "What are the core principles of the Mediterranean diet?",
    response:
      "The Mediterranean diet emphasizes eating fruits and vegetables along with olive oil. It also encourages the consumption of dairy products",
    reference:
      "The core principles of the Mediterranean diet include high consumption of fruits, vegetables, whole grains, and olive oil; moderate intake of fish and poultry; low consumption of dairy products and red meats; and a focus on meals shared with family and friends.",
    critique: null,
    expectedScore: 3,
    atlaScore: null,
  },
  "9aac8677-507a-4fb7-a880-7ce435227300": {
    id: "9aac8677-507a-4fb7-a880-7ce435227300",
    input: "What are the benefits of regular physical exercise?",
    response:
      "Regular exercise is primarily beneficial for building large muscle mass and preparing for bodybuilding competitions. Exercise alone is enough to prevent all chronic diseases and is the most important factor in longevity.",
    reference:
      "Regular physical exercise helps in improving cardiovascular health, increasing muscle strength, enhancing flexibility, and boosting mental well-being. It also aids in weight management and reduces the risk of chronic diseases such as diabetes and heart disease.",
    critique: null,
    expectedScore: 1,
    atlaScore: null,
  },
  "d14905b5-1e41-4be2-b392-69ba80858f0e": {
    id: "d14905b5-1e41-4be2-b392-69ba80858f0e",
    input: "What are the common symptoms of dehydration?",
    response:
      "Symptoms of dehydration can include thirst and dry mouth. Dehydration might also cause issues like dizziness, fatigue, or confusion. Some people may experience muscle cramps, and it’s important to drink plenty of fluids to prevent dehydration. Severe dehydration can lead to serious health complications if not addressed promptly.",
    reference:
      "Common symptoms of dehydration include thirst, dry mouth, dark-colored urine, fatigue, dizziness, and confusion.",
    critique: null,
    expectedScore: 3,
    atlaScore: null,
  },
  "d6f27d4d-09ab-4de1-8f3c-ba7715feddd1": {
    id: "d6f27d4d-09ab-4de1-8f3c-ba7715feddd1",
    input: "What are the common causes of global warming?",
    response:
      "Global warming is mainly caused by natural climate cycles and solar radiation. While some believe that human activities have a minor role, the natural processes of the Earth are the primary drivers. The planet has experienced warming and cooling phases long before industrialization, and these cycles are considered normal. Volcanic eruptions and ocean currents also contribute significantly to global temperature changes.",
    reference:
      "The common causes of global warming include the burning of fossil fuels, deforestation, and industrial activities that increase greenhouse gas emissions.",
    critique: null,
    expectedScore: 1,
    atlaScore: null,
  },
  "88d8faa8-b102-40a1-9acd-0845fd452a12": {
    id: "88d8faa8-b102-40a1-9acd-0845fd452a12",
    input: "What are the penalties for insider trading?",
    response:
      "Penalties for insider trading include fines and potential imprisonment.",
    reference:
      "Insider trading penalties can include both civil and criminal charges. Civil penalties may involve fines up to three times the profit gained or loss avoided, while criminal penalties can result in imprisonment for up to 20 years and fines up to $5 million for individuals.",
    critique: null,
    expectedScore: 3,
    atlaScore: null,
  },
  "a0cc4dae-8a24-4033-ac70-7398cce34735": {
    id: "a0cc4dae-8a24-4033-ac70-7398cce34735",
    input: "What are the causes of water pollution?",
    response: "Water pollution is mainly caused by plastic waste.",
    reference:
      "Water pollution is caused by various factors, including industrial waste discharge, agricultural runoff containing pesticides and fertilizers, oil spills, sewage and wastewater, plastic waste, and heavy metals from mining activities.",
    critique: null,
    expectedScore: 1,
    atlaScore: null,
  },
  "4691174c-39bc-462f-99d4-f023b9379a5f": {
    id: "4691174c-39bc-462f-99d4-f023b9379a5f",
    input: "What is the primary function of the heart?",
    response:
      "The heart pumps blood throughout the body, which is important for keeping everything working. It also helps in delivering nutrients and oxygen, but sometimes it’s also related to breathing, and the heart has chambers like the brain has different parts.",
    critique: null,
    expectedScore: 3,
    atlaScore: null,
  },
  "5ec7bad5-206b-4339-81fb-df89e30ebc13": {
    id: "5ec7bad5-206b-4339-81fb-df89e30ebc13",
    input: "What are the main stages of plant growth?",
    response:
      "Plant growth starts with seeds, which need sunlight to grow. Sometimes plants grow faster in the shade. After seeds, plants develop roots that reach deep into the soil to find water, but too much water can make them wilt. Then leaves appear, which can be different colors, like flowers. Finally, plants can grow into trees or remain small, and some plants don't need water at all.",
    critique: null,
    expectedScore: 1,
    atlaScore: null,
  },
};

const initialTestCases: Record<string, TestCase> = Object.entries(
  initialTestCasesWithUnformattedScores
)
  .map(([id, testCase]) => {
    const metricWithThisCase = Object.values(initialMetrics).find((metric) =>
      metric.testCases.some((testCase) => testCase.id === id)
    );
    const promptId = metricWithThisCase?.prompts[0].id;
    return {
      ...testCase,
      scores: promptId
        ? {
            [promptId]: {
              expectedScore: testCase.expectedScore,
              atlaScore: null,
            },
          }
        : {},
    };
  })
  .reduce((acc, testCase) => {
    // @ts-ignore
    acc[testCase.id] = testCase;
    return acc;
  }, {});

function setInitialMetrics() {
  const metrics = getMetrics();

  if (metrics.length > 0) {
    return;
  }

  localStorage.setItem("metrics", JSON.stringify(initialMetrics));
  localStorage.setItem("prompts", JSON.stringify(initialPrompts));
  localStorage.setItem("testCases", JSON.stringify(initialTestCases));
  localStorage.setItem("fewShots", JSON.stringify({}));
  localStorage.setItem("testCaseCollections", JSON.stringify({}));
}

export { setInitialMetrics };
