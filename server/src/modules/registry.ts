import { HTML_QUIZ_ID, HTML_QUIZ_NAME, HTML_QUIZ_QUESTIONS } from "./htmlQuiz/htmlQuizData.js";
import { HTML_BUILDER_ID, HTML_BUILDER_NAME, HTML_BUILDER_LEVELS } from "./htmlBuilder/htmlBuilderData.js";

export type ModuleSummary = {
  id: string;
  name: string;
  type: "quiz" | "game";
  levelsCount: number;
  pointsPerLevel: number;
};

export const modules: ModuleSummary[] = [
  {
    id: HTML_QUIZ_ID,
    name: HTML_QUIZ_NAME,
    type: "quiz",
    levelsCount: HTML_QUIZ_QUESTIONS.length,
    pointsPerLevel: 1,
  },
  {
    id: HTML_BUILDER_ID,
    name: HTML_BUILDER_NAME,
    type: "game",
    levelsCount: HTML_BUILDER_LEVELS.length,
    pointsPerLevel: 1,
  },
];
