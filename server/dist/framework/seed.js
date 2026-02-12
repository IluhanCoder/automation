import { GameModel } from "./models.js";
export const seedDefaultGame = async () => {
    const existing = await GameModel.findOne({ id: "intro" });
    if (existing)
        return;
    await GameModel.create({
        id: "intro",
        name: "Intro Challenge",
        levels: [
            { id: "level-1", points: 10 },
            { id: "level-2", points: 15 },
            { id: "level-3", points: 20 },
        ],
        progress: [],
    });
};
