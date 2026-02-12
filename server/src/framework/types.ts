export type LevelConfig = {
  id: string;
  points: number;
};

export type GameProgress = {
  studentId: string;
  currentLevelIndex: number;
  completedLevelIds: string[];
  pointsEarned: number;
  updatedAt: Date;
};
