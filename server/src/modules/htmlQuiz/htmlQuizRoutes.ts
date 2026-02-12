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
      levels: result.allLevels,
      student: {
        id: result.student._id.toString(),
        name: result.student.name,
        nickname: result.student.nickname,
        classLevel: result.student.classLevel,
        points: result.student.points,
      },
      messages: {
        wrongAnswer: "неправильна відповідь",
        levelCompleted: "Рівень завершено!",
        gameCompleted: "Модуль завершено!",
        retryMessage: "Правильно! (Балів не отримано - це повторне проходження)",
      },
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

    const questionData = getHtmlQuestion(String(levelId));
    if (!questionData) {
      return res.status(404).json({ message: "Question not found." });
    }

    const isCorrect = Number(answerIndex) === questionData.correctIndex;

    const result = await completeLevel({
      gameId: HTML_QUIZ_ID,
      studentId: String(studentId),
      levelId: String(levelId),
      isCorrect,
    });

    const messages = {
      wrongAnswer: "неправильна відповідь",
      levelCompleted: "Рівень завершено!",
      gameCompleted: "Модуль завершено!",
      retryMessage: "Правильно! (Балів не отримано - це повторне проходження)",
    };

    if ("error" in result) {
      return res.status(400).json({ message: messages.wrongAnswer });
    }

    const nextQuestionData = result.nextLevel
      ? getHtmlQuestion(result.nextLevel.id)
      : null;

    const game = await GameModel.findOne({ id: HTML_QUIZ_ID });
    const totalLevels = game?.levels.length ?? 0;

    return res.json({
      message: result.message,
      isRetry: result.isRetry,
      progress: result.progress,
      student: {
        id: result.student._id.toString(),
        name: result.student.name,
        nickname: result.student.nickname,
        classLevel: result.student.classLevel,
        points: result.student.points,
      },
      question: nextQuestionData
        ? {
            levelId: nextQuestionData.levelId,
            question: nextQuestionData.question,
            options: nextQuestionData.options,
          }
        : null,
      totalLevels,
      messages,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

htmlQuizRouter.post("/api/modules/html-basics/view-level", async (req, res) => {
  try {
    const { studentId, levelId } = req.body ?? {};

    if (!studentId || !levelId) {
      return res.status(400).json({ message: "Missing studentId or levelId." });
    }

    const question = getHtmlQuestion(String(levelId));
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const game = await GameModel.findOne({ id: HTML_QUIZ_ID });
    if (!game) {
      return res.status(404).json({ message: "Game not found." });
    }

    const progress = game.progress.find(
      (item) => item.studentId === String(studentId)
    );

    if (!progress) {
      return res.status(400).json({ message: "Game not started." });
    }

    const isCompleted = progress.completedLevelIds.includes(String(levelId));
    const totalLevels = game.levels.length;

    return res.json({
      module: { id: HTML_QUIZ_ID, name: HTML_QUIZ_NAME },
      progress,
      question: {
        levelId: question.levelId,
        question: question.question,
        options: question.options,
      },
      isCompleted,
      totalLevels,
      messages: {
        wrongAnswer: "неправильна відповідь",
        levelCompleted: "Рівень завершено!",
        gameCompleted: "Модуль завершено!",
        retryMessage: "Правильно! (Балів не отримано - це повторне проходження)",
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
});
