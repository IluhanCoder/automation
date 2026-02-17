import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { api } from '../framework/api'
import { ModuleFrame } from '../framework/components/ModuleFrame'
import { Header } from '../framework/components/Header'
import { HtmlBuilderGame } from '../modules/htmlBuilder/HtmlBuilderGame'
import type { ModuleState, Student, GameMessages } from '../framework/types'

interface GamePageProps {
  student: Student | null
  onStudentUpdate: (student: Student) => void
}

export function GamePage({ student, onStudentUpdate }: GamePageProps) {
  const navigate = useNavigate()
  const { moduleId } = useParams()
  const hasInitialized = useRef(false)
  const [moduleState, setModuleState] = useState<ModuleState | null>(null)
  const [moduleLoading, setModuleLoading] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [messages, setMessages] = useState<GameMessages | null>(null)

  if (!student || !moduleId) {
    navigate('/modules')
    return null
  }

  // Load game state from API on mount (only once)
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      startModule()
    }
  }, [moduleId])

  const startModule = async () => {
    setModuleLoading(true)
    setSelectedAnswer(null)

    try {
      console.log('[GamePage] Starting module:', moduleId)
      const payload = await api.startModule(moduleId, student.id)
      console.log('[GamePage] Module started, payload:', payload)
      setModuleState({
        ...payload,
        levels: payload.levels,
        question: payload.question, // Ensure question is included
      })
      if (payload.messages) {
        setMessages(payload.messages)
      }
      // Update student with points from server
      if (payload.student) {
        onStudentUpdate(payload.student)
      }
    } catch (err) {
      console.error('[GamePage] Failed to start module:', err)
      const errorMessage = err instanceof Error ? err.message : 'Не вдалося запустити модуль.'
      toast.error(errorMessage)
      navigate('/modules')
    } finally {
      setModuleLoading(false)
    }
  }

  const handleSelectLevel = async (levelId: string) => {
    if (!student || !moduleState) return
    setModuleLoading(true)
    setSelectedAnswer(null)

    try {
      const payload = await api.viewLevel({
        moduleId,
        studentId: student.id,
        levelId,
      })

      setModuleState({
        ...moduleState,
        question: payload.question,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не вдалося завантажити рівень.'
      toast.error(errorMessage)
    } finally {
      setModuleLoading(false)
    }
  }

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleAnswer = async () => {
    if (!student || !moduleState?.question || selectedAnswer === null) return

    setModuleLoading(true)

    try {
      const payload = await api.answerModule({
        moduleId,
        studentId: student.id,
        levelId: moduleState.question.levelId,
        answerIndex: selectedAnswer,
      })
      const isGameComplete = payload.progress.completedLevelIds.length === payload.totalLevels

      setModuleState((prev) =>
        prev
          ? {
              ...prev,
              progress: payload.progress,
              question: payload.question || prev.question,
              totalLevels: payload.totalLevels,
            }
          : prev,
      )
      onStudentUpdate(payload.student)
      if (payload.messages) {
        setMessages(payload.messages)
      }
      setSelectedAnswer(null)

      // Check if all levels are now completed
      if (isGameComplete) {
        const successMsg = messages?.gameCompleted || '🎉 Модуль завершено! Ви отримали всі можливі бали!'
        toast.success(successMsg)
      } else if (payload.isRetry) {
        const retryMsg = messages?.retryMessage || 'Правильно! (Балів не отримано - це повторне проходження)'
        toast.success(retryMsg)
      } else {
        toast.success(payload.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messages?.wrongAnswer || 'Відповідь не зарахована.'
      toast.error(errorMessage)
    } finally {
      setModuleLoading(false)
    }
  }

  const handleBackToModules = () => {
    navigate('/modules')
  }

  const handleHtmlBuilderSubmit = async (html: string) => {
    if (!student || !moduleState?.question) return

    setModuleLoading(true)

    try {
      const payload = await api.submitHtmlBuilder({
        moduleId,
        studentId: student.id,
        levelId: (moduleState.question as any).levelId,
        html,
      })
      const isGameComplete = payload.progress.completedLevelIds.length === payload.totalLevels

      setModuleState((prev) =>
        prev
          ? {
              ...prev,
              progress: payload.progress,
              question: payload.question || prev.question,
              totalLevels: payload.totalLevels,
            }
          : prev,
      )
      onStudentUpdate(payload.student)
      if (payload.messages) {
        setMessages(payload.messages)
      }

      // Check if all levels are now completed
      if (isGameComplete) {
        const successMsg = messages?.gameCompleted || '🎉 Модуль завершено! Ви отримали всі можливі бали!'
        toast.success(successMsg)
      } else if (payload.isRetry) {
        const retryMsg = messages?.retryMessage || 'Правильно! (Балів не отримано - це повторне проходження)'
        toast.success(retryMsg)
      } else if (payload.isCorrect) {
        toast.success(payload.feedback || payload.message)
      } else {
        toast.error(payload.feedback || payload.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : messages?.wrongAnswer || 'Помилка при перевірці.'
      toast.error(errorMessage)
    } finally {
      setModuleLoading(false)
    }
  }

  if (!moduleState) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="text-center text-slate-600">Завантаження модуля...</div>
      </div>
    )
  }

  // Check if this is HTML Builder module
  const isHtmlBuilder = moduleId === 'html-builder'

  console.log('[GamePage] Rendering, isHtmlBuilder:', isHtmlBuilder, 'question:', moduleState.question)

  if (isHtmlBuilder) {
    return (
      <div className="flex h-screen w-screen flex-col items-stretch">
        <Header student={student} onLogout={() => navigate('/auth')} />
        <div className="flex-1 overflow-hidden bg-white flex flex-col">
          {/* Header - only takes needed space */}
          <div className="flex-shrink-0 overflow-visible bg-white p-4 border-b border-slate-200">
            <button
              type="button"
              onClick={handleBackToModules}
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 mb-2"
            >
              ← Назад до модулів
            </button>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{moduleState.module.name}</h1>
            <p className="text-sm text-slate-500">
              Рівень {moduleState.progress.currentLevelIndex + 1} з {moduleState.totalLevels} · Зароблено: {moduleState.progress.pointsEarned} балів
            </p>
          </div>
          {/* Game - takes remaining space */}
          <div className="flex-1 overflow-hidden flex">
            <HtmlBuilderGame
              question={
                moduleState.question
                  ? {
                      levelId: (moduleState.question as any).levelId,
                      title: (moduleState.question as any).title || 'Level',
                      description: (moduleState.question as any).description || '',
                      targetHtml: (moduleState.question as any).targetHtml || '',
                      rules: (moduleState.question as any).rules || [],
                    }
                  : undefined
              }
              onSubmit={handleHtmlBuilderSubmit}
              isLoading={moduleLoading}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col items-stretch">
      <Header student={student} onLogout={() => navigate('/auth')} />
      <div className="flex-1 overflow-auto rounded-none border-none bg-white p-0 shadow-none flex flex-col">
        <div className="flex-1 overflow-auto p-6">
          <ModuleFrame
            module={{ id: moduleId, name: '', type: 'quiz', levelsCount: moduleState.totalLevels, pointsPerLevel: 10 }}
            moduleState={moduleState}
            moduleLoading={moduleLoading}
            selectedAnswer={selectedAnswer}
            onBack={handleBackToModules}
            onSelectLevel={handleSelectLevel}
            onSelectAnswer={handleSelectAnswer}
            actionButton={{
              label: 'Відповісти',
              loading: moduleLoading,
              disabled: selectedAnswer === null,
              onClick: handleAnswer,
            }}
          />
        </div>
      </div>
    </div>
  )
}
