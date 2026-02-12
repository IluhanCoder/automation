import { GameModel, StudentModel } from "../models.js";
import type { GameDoc } from "../models.js";
import type { GameProgress } from "../types.js";

export const listGames = async () => GameModel.find().lean();

export const createGame = async (data: {
  id: string;
  name: string;
  levels: { id: string; points: number }[];
}) => GameModel.create({ ...data, progress: [] });

export const startGame = async (params: {
  gameId: string;
  studentId: string;
}) => {
  const game = await GameModel.findOne({ id: params.gameId });
  if (!game) {
    return { error: "Game not found." } as const;
  }

  const student = await StudentModel.findById(params.studentId);
  if (!student) {
    return { error: "Student not found." } as const;
  }

  let progress = game.progress.find(
    (item) => item.studentId === String(params.studentId)
  );
  if (!progress) {
    progress = {
      studentId: String(params.studentId),
      currentLevelIndex: 0,
      completedLevelIds: [],
      pointsEarned: 0,
      updatedAt: new Date(),
    } satisfies GameProgress;

    game.progress.push(progress);
    await game.save();
  }

  const currentLevel = game.levels[progress.currentLevelIndex] ?? null;

  return { game, progress, currentLevel, allLevels: game.levels } as const;
};

export const completeLevel = async (params: {
  gameId: string;
  studentId: string;
  levelId: string;
  isCorrect: boolean;
}) => {
  const game = await GameModel.findOne({ id: params.gameId });
  if (!game) {
    return { error: "Game not found." } as const;
  }

  const student = await StudentModel.findById(params.studentId);
  if (!student) {
    return { error: "Student not found." } as const;
  }

  const progress = game.progress.find(
    (item) => item.studentId === String(params.studentId)
  );
  if (!progress) {
    return { error: "Game not started yet." } as const;
  }

  if (!params.isCorrect) {
    return { error: "Level not completed successfully." } as const;
  }

  const level = game.levels.find((l) => l.id === String(params.levelId));
  if (!level) {
    return { error: "Level not found." } as const;
  }

  // Check if this is a new level (must be in order) or a retry of completed level
  const isNewLevel = progress.completedLevelIds.includes(level.id) === false;
  const currentLevel = game.levels[progress.currentLevelIndex];

  if (isNewLevel) {
    // New level - must complete levels in order
    if (!currentLevel || currentLevel.id !== String(params.levelId)) {
      return { error: "You must complete levels in order." } as const;
    }
    // Award points for new level
    progress.completedLevelIds.push(level.id);
    progress.pointsEarned += level.points;
    progress.currentLevelIndex += 1;
    student.points += level.points;
  }
  // If retry - just continue without awarding points

  progress.updatedAt = new Date();
  await Promise.all([student.save(), game.save()]);

  const nextLevel = game.levels[progress.currentLevelIndex] ?? null;
  const messageKey = isNewLevel
    ? nextLevel
      ? "Level completed."
      : "Game completed."
    : "Level completed. (No points for retry)";

  return {
    message: messageKey,
    progress,
    student,
    nextLevel,
    isRetry: !isNewLevel,
  } as const;
};

export const getGameSummary = (game: GameDoc) => ({
  id: game.id,
  name: game.name,
  levels: game.levels,
});
