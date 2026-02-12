import { HTML_QUIZ_ID, HTML_QUIZ_NAME, HTML_QUIZ_QUESTIONS } from "./htmlQuiz/htmlQuizData.js";

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
];
