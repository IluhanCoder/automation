import type { ModuleState, ModuleSummary, Student, GameMessages } from './types'

const API_URL = 'http://localhost:4000'

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload?.message ?? 'Помилка запиту.')
  }
  return payload as T
}

export const api = {
  register: async (data: {
    name: string
    nickname: string
    classLevel: number
    password: string
  }) => {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return parseResponse<{ student: Student; message: string }>(response)
  },
  login: async (data: { identifier: string; password: string }) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return parseResponse<{ student: Student; message: string }>(response)
  },
  listModules: async () => {
    const response = await fetch(`${API_URL}/api/modules`)
    return parseResponse<{ modules: ModuleSummary[] }>(response)
  },
  startModule: async (moduleId: string, studentId: string) => {
    const response = await fetch(`${API_URL}/api/modules/${moduleId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    })
    return parseResponse<ModuleState & { student: Student }>(response)
  },
  answerModule: async (params: {
    moduleId: string
    studentId: string
    levelId: string
    answerIndex: number
  }) => {
    const response = await fetch(`${API_URL}/api/modules/${params.moduleId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: params.studentId,
        levelId: params.levelId,
        answerIndex: params.answerIndex,
      }),
    })
    return parseResponse<{
      message: string
      isRetry: boolean
      progress: ModuleState['progress']
      question: ModuleState['question']
      student: Student
      totalLevels: number
      messages?: GameMessages
    }>(response)
  },
  viewLevel: async (params: {
    moduleId: string
    studentId: string
    levelId: string
  }) => {
    const response = await fetch(`${API_URL}/api/modules/${params.moduleId}/view-level`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: params.studentId,
        levelId: params.levelId,
      }),
    })
    return parseResponse<{
      module: { id: string; name: string }
      progress: ModuleState['progress']
      question: ModuleState['question']
      isCompleted: boolean
      totalLevels: number
      messages?: GameMessages
    }>(response)
  },
}
