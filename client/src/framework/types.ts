export type ViewMode = 'login' | 'register'

export type Student = {
  id: string
  name: string
  nickname: string
  classLevel: number
  points: number
}

export type ModuleSummary = {
  id: string
  name: string
  type: 'quiz' | 'game'
  levelsCount: number
  pointsPerLevel: number
}

export type ModuleQuestion = {
  levelId: string
  question: string
  options: string[]
}

export type GameMessages = {
  wrongAnswer: string
  levelCompleted: string
  gameCompleted: string
  retryMessage: string
}

export type ModuleState = {
  module: { id: string; name: string }
  progress: {
    currentLevelIndex: number
    completedLevelIds: string[]
    pointsEarned: number
  }
  question: ModuleQuestion | null
  totalLevels: number
  levels?: Array<{ id: string; points: number }>
  messages?: GameMessages
}
