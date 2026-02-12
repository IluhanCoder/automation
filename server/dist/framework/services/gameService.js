import { GameModel, StudentModel } from "../models.js";
export const listGames = async () => GameModel.find().lean();
export const createGame = async (data) => GameModel.create({ ...data, progress: [] });
export const startGame = async (params) => {
    const game = await GameModel.findOne({ id: params.gameId });
    if (!game) {
        return { error: "Game not found." };
    }
    const student = await StudentModel.findById(params.studentId);
    if (!student) {
        return { error: "Student not found." };
    }
    let progress = game.progress.find((item) => item.studentId === String(params.studentId));
    if (!progress) {
        progress = {
            studentId: String(params.studentId),
            currentLevelIndex: 0,
            completedLevelIds: [],
            pointsEarned: 0,
            updatedAt: new Date(),
        };
        game.progress.push(progress);
        await game.save();
    }
    const currentLevel = game.levels[progress.currentLevelIndex] ?? null;
    return { game, progress, currentLevel, allLevels: game.levels, student };
};
export const completeLevel = async (params) => {
    const game = await GameModel.findOne({ id: params.gameId });
    if (!game) {
        return { error: "Game not found." };
    }
    const student = await StudentModel.findById(params.studentId);
    if (!student) {
        return { error: "Student not found." };
    }
    const progress = game.progress.find((item) => item.studentId === String(params.studentId));
    if (!progress) {
        return { error: "Game not started yet." };
    }
    if (!params.isCorrect) {
        return { error: "Level not completed successfully." };
    }
    const level = game.levels.find((l) => l.id === String(params.levelId));
    if (!level) {
        return { error: "Level not found." };
    }
    // Check if this is a new level (must be in order) or a retry of completed level
    const isNewLevel = progress.completedLevelIds.includes(level.id) === false;
    const currentLevel = game.levels[progress.currentLevelIndex];
    if (isNewLevel) {
        // New level - must complete levels in order
        if (!currentLevel || currentLevel.id !== String(params.levelId)) {
            return { error: "You must complete levels in order." };
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
    };
};
export const getGameSummary = (game) => ({
    id: game.id,
    name: game.name,
    levels: game.levels,
});
