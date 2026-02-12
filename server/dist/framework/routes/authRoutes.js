import { Router } from "express";
import { StudentModel } from "../models.js";
import { escapeRegex, handleError } from "../utils.js";
export const authRouter = Router();
authRouter.post("/api/register", async (req, res) => {
    try {
        const { name, nickname, classLevel, password } = req.body ?? {};
        if (!name || !nickname || !classLevel || !password) {
            return res.status(400).json({ message: "Missing required fields." });
        }
        const classNumber = Number(classLevel);
        if (!Number.isInteger(classNumber) || classNumber < 1 || classNumber > 8) {
            return res
                .status(400)
                .json({ message: "Class must be a number between 1 and 8." });
        }
        const nicknameValue = String(nickname).trim();
        const nicknameRegex = new RegExp(`^${escapeRegex(nicknameValue)}$`, "i");
        const exists = await StudentModel.findOne({ nickname: nicknameRegex });
        if (exists) {
            return res.status(409).json({ message: "Nickname already exists." });
        }
        const student = await StudentModel.create({
            name: String(name).trim(),
            nickname: nicknameValue,
            classLevel: classNumber,
            password: String(password),
            points: 0,
        });
        return res.status(201).json({
            message: "Registered successfully.",
            student: {
                id: student._id.toString(),
                name: student.name,
                nickname: student.nickname,
                classLevel: student.classLevel,
                points: student.points,
            },
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
authRouter.post("/api/login", async (req, res) => {
    try {
        const { identifier, password } = req.body ?? {};
        if (!identifier || !password) {
            return res.status(400).json({ message: "Missing credentials." });
        }
        const normalizedIdentifier = String(identifier).trim();
        const identifierRegex = new RegExp(`^${escapeRegex(normalizedIdentifier)}$`, "i");
        const student = await StudentModel.findOne({
            $or: [{ name: identifierRegex }, { nickname: identifierRegex }],
        });
        if (!student || student.password !== String(password)) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        return res.json({
            message: "Logged in successfully.",
            student: {
                id: student._id.toString(),
                name: student.name,
                nickname: student.nickname,
                classLevel: student.classLevel,
                points: student.points,
            },
        });
    }
    catch (error) {
        return handleError(res, error);
    }
});
