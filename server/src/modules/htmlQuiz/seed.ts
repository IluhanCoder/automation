import { GameModel } from "../../framework/models.js";
import { HTML_QUIZ_ID, HTML_QUIZ_NAME, HTML_QUIZ_QUESTIONS } from "./htmlQuizData.js";

export const seedHtmlQuizGame = async () => {
  // Always recreate the game to ensure levels are correct
  await GameModel.deleteOne({ id: HTML_QUIZ_ID });

  await GameModel.create({
    id: HTML_QUIZ_ID,
    name: HTML_QUIZ_NAME,
    levels: HTML_QUIZ_QUESTIONS.map((question) => ({
      id: question.levelId,
      points: 1,
    })),
    progress: [],
  });
};
