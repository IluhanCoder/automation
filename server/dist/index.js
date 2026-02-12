import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { authRouter } from "./framework/routes/authRoutes.js";
import { gameRouter } from "./framework/routes/gameRoutes.js";
import { seedDefaultGame } from "./framework/seed.js";
import { moduleRouter } from "./modules/routes.js";
import { seedHtmlQuizGame } from "./modules/htmlQuiz/seed.js";
const app = express();
const port = Number(process.env.PORT) || 4000;
const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/automation_beta";
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use(authRouter);
app.use(gameRouter);
app.use(moduleRouter);
const startServer = async () => {
    try {
        await mongoose.connect(mongoUrl);
        await seedDefaultGame();
        await seedHtmlQuizGame();
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
};
startServer();
