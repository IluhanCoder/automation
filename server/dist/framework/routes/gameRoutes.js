import { Router } from "express";
import { handleError } from "../utils.js";
import { completeLevel, createGame, listGames, startGame } from "../services/gameService.js";
export const gameRouter = Router();
gameRouter.get("/api/games", async (_req, res) => {
    try {
        const games = await listGames();
        res.json({ games });
    }
    catch (error) {
        return handleError(res, error);
    }
});
gameRouter.post("/api/games", async (req, res) => {
    try {
        const { id, name, levels } = req.body ?? {};
        if (!id || !name || !Array.isArray(levels) || levels.length === 0) {
            return res.status(400).json({ message: "Invalid game payload." });
        }
        const sanitizedLevels = levels.map((level) => ({
            id: String(level.id),
            points: Number(level.points),
        }));
        const hasInvalidLevel = sanitizedLevels.some((level) => !level.id || !Number.isFinite(level.points) || level.points < 0);
        if (hasInvalidLevel) {
            return res.status(400).json({ message: "Invalid levels data." });
        }
        const game = await createGame({
            id: String(id),
            name: String(name),
            levels: sanitizedLevels,
        });
        return res.status(201).json({ game });
    }
    catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Game already exists." });
        }
        return handleError(res, error);
    }
});
gameRouter.post("/api/games/:gameId/start", async (req, res) => {
    try {
        const { gameId } = req.params;
        const { studentId } = req.body ?? {};
        if (!studentId) {
            return res.status(400).json({ message: "Missing studentId." });
        }
        const result = await startGame({ gameId, studentId: String(studentId) });
        if ("error" in result) {
            return res.status(404).json({ message: result.error });
        }
        return res.json(result);
    }
    catch (error) {
        return handleError(res, error);
    }
});
gameRouter.post("/api/games/:gameId/complete", async (req, res) => {
    try {
        const { gameId } = req.params;
        const { studentId, levelId, isCorrect } = req.body ?? {};
        if (!studentId || !levelId) {
            return res.status(400).json({ message: "Missing studentId or levelId." });
        }
        const result = await completeLevel({
            gameId,
            studentId: String(studentId),
            levelId: String(levelId),
            isCorrect: Boolean(isCorrect),
        });
        if ("error" in result) {
            return res.status(400).json({ message: result.error });
        }
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
            nextLevel: result.nextLevel,
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
