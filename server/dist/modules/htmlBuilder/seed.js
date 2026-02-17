import { GameModel } from "../../framework/models.js";
import { HTML_BUILDER_LEVELS } from "./htmlBuilderData.js";
export const seedHtmlBuilderGame = async () => {
    // Always recreate the game to ensure levels are correct
    await GameModel.deleteOne({ id: "html-builder" });
    await GameModel.create({
        id: "html-builder",
        name: "HTML Builder",
        levels: HTML_BUILDER_LEVELS.map((level) => ({
            id: String(level.id),
            points: 1,
        })),
        progress: [],
    });
};
