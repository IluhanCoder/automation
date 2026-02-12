import mongoose, { Schema } from "mongoose";

import type { GameProgress, LevelConfig } from "./types.js";

export type StudentDoc = mongoose.Document & {
  name: string;
  nickname: string;
  classLevel: number;
  password: string;
  points: number;
  createdAt: Date;
};

export type GameDoc = mongoose.Document & {
  id: string;
  name: string;
  levels: LevelConfig[];
  progress: GameProgress[];
};

const LevelSchema = new Schema<LevelConfig>(
  {
    id: { type: String, required: true },
    points: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const GameProgressSchema = new Schema<GameProgress>(
  {
    studentId: { type: String, required: true },
    currentLevelIndex: { type: Number, required: true },
    completedLevelIds: { type: [String], default: [] },
    pointsEarned: { type: Number, required: true },
    updatedAt: { type: Date, required: true },
  },
  { _id: false }
);

const GameSchema = new Schema<GameDoc>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    levels: { type: [LevelSchema], default: [] },
    progress: { type: [GameProgressSchema], default: [] },
  },
  { timestamps: true }
);

const StudentSchema = new Schema<StudentDoc>(
  {
    name: { type: String, required: true },
    nickname: { type: String, required: true, unique: true },
    classLevel: { type: Number, required: true, min: 1, max: 8 },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false }
);

export const GameModel = mongoose.model<GameDoc>("Game", GameSchema);
export const StudentModel = mongoose.model<StudentDoc>("Student", StudentSchema);
