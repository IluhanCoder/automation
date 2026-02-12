import { Router } from "express";

import { handleError } from "../../framework/utils.js";
import { completeLevel, startGame } from "../../framework/services/gameService.js";
import { GameModel } from "../../framework/models.js";
import { HTML_QUIZ_ID, HTML_QUIZ_NAME, getHtmlQuestion } from "./htmlQuizData.js";

export const htmlQuizRouter = Router();

htmlQuizRouter.post("/api/modules/html-basics/start", async (req, res) => {
  try {
    const { studentId } = req.body ?? {};

    if (!studentId) {
      return res.status(400).json({ message: "Missing studentId." });
    }

    const result = await startGame({
      gameId: HTML_QUIZ_ID,
      studentId: String(studentId),
    });

    if ("error" in result) {
      return res.status(404).json({ message: result.error });
    }

    const question = result.currentLevel
      ? getHtmlQuestion(result.currentLevel.id)
      : null;

    return res.json({
      module: { id: HTML_QUIZ_ID, name: HTML_QUIZ_NAME },
      progress: result.progress,
      question: question
        ? {
            levelId: question.levelId,
            question: question.question,
            options: question.options,
          }
        : null,
      totalLevels: result.game.levels.length,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

htmlQuizRouter.post("/api/modules/html-basics/answer", async (req, res) => {
  try {
    const { studentId, levelId, answerIndex } = req.body ?? {};

    if (!studentId || !levelId) {
      return res.status(400).json({ message: "Missing studentId or levelId." });
    }

    if (!Number.isInteger(Number(answerIndex))) {
      return res.status(400).json({ message: "Invalid answer index." });
    }

    const question = getHtmlQuestion(String(levelId));
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const isCorrect = Number(answerIndex) === question.correctIndex;

    const result = await completeLevel({
      gameId: HTML_QUIZ_ID,
      studentId: String(studentId),
      levelId: String(levelId),
      isCorrect,
    });

    if ("error" in result) {
      return res.status(400).json({ message: result.error });
    }

    const nextQuestion = result.nextLevel
      ? getHtmlQuestion(result.nextLevel.id)
      : null;

    const game = await GameModel.findOne({ id: HTML_QUIZ_ID });
    const totalLevels = game?.levels.length ?? 0;

    return res.json({
      message: result.message,
      progress: result.progress,
      student: {
        id: result.student._id.toString(),
        name: result.student.name,
        nickname: result.student.nickname,
        classLevel: result.student.classLevel,
        points: result.student.points,
      },
      question: nextQuestion
        ? {
            levelId: nextQuestion.levelId,
            question: nextQuestion.question,
            options: nextQuestion.options,
          }
        : null,
      totalLevels,
    });
  } catch (error) {
    return handleError(res, error);
  }
});
