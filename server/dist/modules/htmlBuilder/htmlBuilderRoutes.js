import { Router } from "express";
import { HTML_BUILDER_LEVELS } from "./htmlBuilderData.js";
import { GameModel, StudentModel } from "../../framework/models.js";
const htmlBuilderRouter = Router();
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const parseHtmlStructure = (rawHtml) => {
    const html = String(rawHtml || "");
    const tokenRegex = /<\/?([a-zA-Z0-9-]+)([^>]*)>/g;
    const root = { tag: "__root__", className: "", children: [] };
    const stack = [root];
    let match;
    while ((match = tokenRegex.exec(html)) !== null) {
        const fullToken = match[0];
        const rawTag = match[1] || "";
        const tag = rawTag.toLowerCase();
        const attrs = match[2] || "";
        const isClosing = fullToken.startsWith("</");
        if (isClosing) {
            if (stack.length <= 1)
                return null;
            const current = stack[stack.length - 1];
            if (current.tag !== tag)
                return null;
            stack.pop();
            continue;
        }
        const classMatch = attrs.match(/class\s*=\s*["']([^"']*)["']/i);
        const className = (classMatch?.[1] || "").trim().replace(/\s+/g, " ");
        const node = { tag, className, children: [] };
        const parent = stack[stack.length - 1];
        parent.children.push(node);
        const selfClosing = /\/\s*>$/.test(fullToken) || VOID_TAGS.has(tag);
        if (!selfClosing) {
            stack.push(node);
        }
    }
    if (stack.length !== 1)
        return null;
    return root.children;
};
const areStructureNodesEqual = (a, b) => {
    if (a.tag !== b.tag)
        return false;
    if (a.className !== b.className)
        return false;
    if (a.children.length !== b.children.length)
        return false;
    for (let i = 0; i < a.children.length; i += 1) {
        if (!areStructureNodesEqual(a.children[i], b.children[i]))
            return false;
    }
    return true;
};
const findFirstNodeByTag = (nodes, targetTag) => {
    for (const node of nodes) {
        if (node.tag === targetTag)
            return node;
        const nested = findFirstNodeByTag(node.children, targetTag);
        if (nested)
            return nested;
    }
    return null;
};
const isVisualStructureMatch = (submittedHtml, targetHtml) => {
    const submittedTree = parseHtmlStructure(submittedHtml);
    const targetTree = parseHtmlStructure(targetHtml);
    if (!submittedTree || !targetTree)
        return false;
    const submittedBody = findFirstNodeByTag(submittedTree, "body");
    const targetBody = findFirstNodeByTag(targetTree, "body");
    if (!submittedBody || !targetBody)
        return false;
    return areStructureNodesEqual(submittedBody, targetBody);
};
const NON_BODY_REQUIRED_TAGS = new Set(["html", "head", "body", "title"]);
const getTagsOutsideBody = (tree) => {
    const outsideTags = [];
    const walk = (nodes, insideBody) => {
        for (const node of nodes) {
            const isBody = node.tag === "body";
            const nextInsideBody = insideBody || isBody;
            if (!nextInsideBody && !NON_BODY_REQUIRED_TAGS.has(node.tag)) {
                outsideTags.push(node.tag);
            }
            if (node.children.length > 0) {
                walk(node.children, nextInsideBody);
            }
        }
    };
    walk(tree, false);
    return Array.from(new Set(outsideTags));
};
// Start HTML Builder session
htmlBuilderRouter.post("/api/modules/html-builder/start", async (req, res) => {
    console.log("[HTML Builder] /start endpoint hit", req.body);
    const { studentId } = req.body;
    if (!studentId) {
        return res.status(400).json({ message: "Не передано studentId." });
    }
    // Find or create game entry for HTML Builder
    const gameId = "html-builder";
    let game = await GameModel.findOne({ id: gameId });
    if (!game) {
        game = await GameModel.create({
            id: gameId,
            name: "HTML Builder",
            levels: HTML_BUILDER_LEVELS.map(l => ({ id: String(l.id), points: 1 })),
            progress: []
        });
    }
    else {
        // Update levels if they changed
        game.levels = HTML_BUILDER_LEVELS.map(l => ({ id: String(l.id), points: 1 }));
        await game.save();
    }
    // Find or create progress for student
    let progress = game.progress.find(p => p.studentId === String(studentId));
    if (!progress) {
        progress = {
            studentId: String(studentId),
            currentLevelIndex: 0,
            completedLevelIds: [],
            pointsEarned: 0,
            updatedAt: new Date()
        };
        game.progress.push(progress);
        await game.save();
    }
    // Find student
    const student = await StudentModel.findById(studentId);
    if (!student) {
        return res.status(404).json({ message: "Учня не знайдено." });
    }
    // Current level
    const currentLevel = HTML_BUILDER_LEVELS[progress.currentLevelIndex] || null;
    res.json({
        module: { id: gameId, name: "HTML Builder" },
        progress,
        question: currentLevel ? {
            levelId: String(currentLevel.id),
            title: currentLevel.title,
            description: currentLevel.description,
            targetHtml: currentLevel.targetHtml,
            rules: currentLevel.rules,
        } : null,
        student: {
            id: student._id.toString(),
            name: student.name,
            nickname: student.nickname,
            classLevel: student.classLevel,
            points: student.points
        },
        levels: HTML_BUILDER_LEVELS,
        totalLevels: HTML_BUILDER_LEVELS.length,
        message: "Сесію HTML Builder розпочато"
    });
});
// Get all levels
htmlBuilderRouter.get("/api/modules/html-builder/levels", (req, res) => {
    res.json({ levels: HTML_BUILDER_LEVELS });
});
// Validate submitted HTML structure
htmlBuilderRouter.post("/api/modules/html-builder/validate", (req, res) => {
    const { html, levelId } = req.body;
    const level = HTML_BUILDER_LEVELS.find(l => l.id === levelId);
    if (!level)
        return res.status(404).json({ error: "Рівень не знайдено" });
    // Check required tags
    const missingTags = level.requiredTags.filter(tag => !html.includes(`<${tag}`));
    // Structure validation
    let structureErrors = [];
    // Parse HTML as string (not DOM, for simplicity)
    // 1. head only in html
    const htmlMatch = html.match(/<html[\s\S]*?<\/html>/);
    if (!htmlMatch)
        structureErrors.push("Відсутній кореневий тег <html> або він розташований неправильно.");
    else {
        const htmlContent = htmlMatch[0];
        // 2. head only in html
        if (!/<head[\s\S]*?<\/head>/.test(htmlContent))
            structureErrors.push("<head> має бути всередині <html>.");
        // 3. body only in html
        if (!/<body[\s\S]*?<\/body>/.test(htmlContent))
            structureErrors.push("<body> має бути всередині <html>.");
        // 4. head only before body
        const headIndex = htmlContent.indexOf("<head");
        const bodyIndex = htmlContent.indexOf("<body");
        if (headIndex === -1 || bodyIndex === -1) {
            // Already handled above
        }
        else if (headIndex > bodyIndex) {
            structureErrors.push("<head> має бути перед <body>.");
        }
        // 5. body only after head
        if (headIndex !== -1 && bodyIndex !== -1 && bodyIndex < headIndex) {
            structureErrors.push("<body> має бути після <head>.");
        }
    }
    const submittedTree = parseHtmlStructure(html);
    if (!submittedTree) {
        structureErrors.push("Некоректна структура HTML: не вдалося розібрати дерево тегів.");
    }
    else {
        const tagsOutsideBody = getTagsOutsideBody(submittedTree);
        if (tagsOutsideBody.length > 0) {
            structureErrors.push(`Теги мають бути всередині <body>: ${tagsOutsideBody.join(", ")}.`);
        }
    }
    // Combine errors
    const htmlMatchesTarget = isVisualStructureMatch(html, level.targetHtml);
    const isCorrect = missingTags.length === 0 &&
        structureErrors.length === 0 &&
        htmlMatchesTarget;
    let feedback = "";
    if (isCorrect) {
        feedback = "Правильно! Структура відповідає завданню.";
    }
    else {
        if (missingTags.length > 0)
            feedback += `Не вистачає тегів: ${missingTags.join(", ")}. `;
        if (structureErrors.length > 0)
            feedback += `Помилки структури: ${structureErrors.join(" ")} `;
        if (!htmlMatchesTarget)
            feedback += "Візуальна структура (порядок/вкладеність/класи) не відповідає зразку.";
    }
    res.json({
        isCorrect,
        htmlMatchesTarget,
        missingTags,
        structureErrors,
        feedback
    });
});
// Answer HTML Builder submission
htmlBuilderRouter.post("/api/modules/html-builder/answer", async (req, res) => {
    const { studentId, levelId, html } = req.body;
    if (!studentId || !levelId || !html) {
        return res.status(400).json({ message: "Не передано studentId, levelId або html." });
    }
    try {
        // Get game
        const gameId = "html-builder";
        let game = await GameModel.findOne({ id: gameId });
        if (!game) {
            return res.status(404).json({ message: "Гру не знайдено." });
        }
        // Get progress
        const progress = game.progress.find(p => p.studentId === String(studentId));
        if (!progress) {
            return res.status(404).json({ message: "Прогрес учня не знайдено." });
        }
        // Get level
        const level = HTML_BUILDER_LEVELS.find(l => String(l.id) === String(levelId));
        if (!level) {
            return res.status(404).json({ message: "Рівень не знайдено." });
        }
        // Validate HTML
        const missingTags = level.requiredTags.filter(tag => !html.includes(`<${tag}`));
        let structureErrors = [];
        const htmlMatch = html.match(/<html[\s\S]*?<\/html>/);
        if (!htmlMatch)
            structureErrors.push("Відсутній кореневий тег <html>.");
        else {
            const htmlContent = htmlMatch[0];
            if (!/<head[\s\S]*?<\/head>/.test(htmlContent))
                structureErrors.push("<head> має бути всередині <html>.");
            if (!/<body[\s\S]*?<\/body>/.test(htmlContent))
                structureErrors.push("<body> має бути всередині <html>.");
            const headIndex = htmlContent.indexOf("<head");
            const bodyIndex = htmlContent.indexOf("<body");
            if (headIndex !== -1 && bodyIndex !== -1 && headIndex > bodyIndex) {
                structureErrors.push("<head> має бути перед <body>.");
            }
        }
        const submittedTree = parseHtmlStructure(html);
        if (!submittedTree) {
            structureErrors.push("Некоректна структура HTML: не вдалося розібрати дерево тегів.");
        }
        else {
            const tagsOutsideBody = getTagsOutsideBody(submittedTree);
            if (tagsOutsideBody.length > 0) {
                structureErrors.push(`Теги мають бути всередині <body>: ${tagsOutsideBody.join(", ")}.`);
            }
        }
        const htmlMatchesTarget = isVisualStructureMatch(html, level.targetHtml);
        const isCorrect = missingTags.length === 0 &&
            structureErrors.length === 0 &&
            htmlMatchesTarget;
        let feedback = "";
        if (isCorrect) {
            feedback = "Правильно! Структура валідна.";
        }
        else {
            if (missingTags.length > 0)
                feedback += `Не вистачає: ${missingTags.join(", ")}. `;
            if (structureErrors.length > 0)
                feedback += `${structureErrors.join(" ")} `;
            if (!htmlMatchesTarget)
                feedback += "Візуальна структура (порядок/вкладеність/класи) не відповідає зразку.";
        }
        let isRetry = false;
        if (isCorrect && !progress.completedLevelIds.includes(String(levelId))) {
            // First correct submission
            progress.completedLevelIds.push(String(levelId));
            progress.pointsEarned += 1;
            progress.currentLevelIndex = Math.min(progress.currentLevelIndex + 1, HTML_BUILDER_LEVELS.length - 1);
        }
        else if (isCorrect) {
            // Retry
            isRetry = true;
        }
        progress.updatedAt = new Date();
        await game.save();
        // Get student
        const student = await StudentModel.findById(studentId);
        if (student && isCorrect && !isRetry) {
            student.points = (student.points || 0) + 1;
            await student.save();
        }
        res.json({
            message: isCorrect ? "Рівень пройдено!" : "Спробуй ще раз.",
            isCorrect,
            isRetry,
            feedback,
            progress: {
                currentLevelIndex: progress.currentLevelIndex,
                completedLevelIds: progress.completedLevelIds,
                pointsEarned: progress.pointsEarned,
            },
            question: HTML_BUILDER_LEVELS[progress.currentLevelIndex]
                ? {
                    levelId: String(HTML_BUILDER_LEVELS[progress.currentLevelIndex].id),
                    title: HTML_BUILDER_LEVELS[progress.currentLevelIndex].title,
                    description: HTML_BUILDER_LEVELS[progress.currentLevelIndex].description,
                    targetHtml: HTML_BUILDER_LEVELS[progress.currentLevelIndex].targetHtml,
                    rules: HTML_BUILDER_LEVELS[progress.currentLevelIndex].rules,
                }
                : null,
            student: student ? {
                id: student._id.toString(),
                name: student.name,
                nickname: student.nickname,
                classLevel: student.classLevel,
                points: student.points,
            } : null,
            totalLevels: HTML_BUILDER_LEVELS.length,
        });
    }
    catch (error) {
        console.error("[HTML Builder] Answer error:", error);
        res.status(500).json({ message: "Помилка сервера під час обробки відповіді." });
    }
});
export default htmlBuilderRouter;
