import { Router } from "express";
import { modules } from "./registry.js";
import { htmlQuizRouter } from "./htmlQuiz/htmlQuizRoutes.js";
import htmlBuilderRouter from "./htmlBuilder/htmlBuilderRoutes.js";
export const moduleRouter = Router();
moduleRouter.get("/api/modules", (_req, res) => {
    res.json({ modules });
});
moduleRouter.use(htmlQuizRouter);
moduleRouter.use(htmlBuilderRouter);
