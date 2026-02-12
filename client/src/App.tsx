import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { api } from './framework/api'
import { AuthPanel } from './framework/components/AuthPanel'
import { ModuleFrame } from './framework/components/ModuleFrame'
import { PointsToast } from './framework/components/PointsToast'
import { useModules } from './framework/hooks/useModules'
import { GameSelectionPage } from './framework/pages/GameSelectionPage'
import type { ModuleState, ModuleSummary, Student, ViewMode } from './framework/types'

function App() {
  const [mode, setMode] = useState<ViewMode>('register')
  const [registerForm, setRegisterForm] = useState({
    name: '',
    nickname: '',
    classLevel: '1',
    password: '',
  })
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
  })
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const { modules, loading: modulesLoading, error: modulesError } = useModules(
    Boolean(student),
  )
  const [activeModule, setActiveModule] = useState<ModuleSummary | null>(null)
  const [moduleState, setModuleState] = useState<ModuleState | null>(null)
  const [moduleMessage, setModuleMessage] = useState('')
  const [moduleError, setModuleError] = useState('')
  const [moduleLoading, setModuleLoading] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [pointsToast, setPointsToast] = useState('')
  const [showPointsToast, setShowPointsToast] = useState(false)
  const [lastPoints, setLastPoints] = useState<number | null>(null)

  const isRegisterValid = useMemo(() => {
    const classNumber = Number(registerForm.classLevel)
    return Boolean(
      registerForm.name.trim() &&
        registerForm.nickname.trim() &&
        registerForm.password.trim() &&
        Number.isInteger(classNumber) &&
        classNumber >= 1 &&
        classNumber <= 8,
    )
  }, [registerForm])

  const isLoginValid = useMemo(() => {
    return Boolean(loginForm.identifier.trim() && loginForm.password.trim())
  }, [loginForm])

  const switchMode = (nextMode: ViewMode) => {
    setMode(nextMode)
    setMessage('')
    setError('')
  }

  const resetModule = () => {
    setActiveModule(null)
    setModuleState(null)
    setModuleMessage('')
    setModuleError('')
    setSelectedAnswer(null)
  }

  useEffect(() => {
    if (!modulesError) return
    setModuleError(modulesError)
  }, [modulesError])

  useEffect(() => {
    if (!student) {
      setLastPoints(null)
      setShowPointsToast(false)
      return
    }

    if (lastPoints === null) {
      setLastPoints(student.points)
      return
    }

    if (student.points > lastPoints) {
      const gained = student.points - lastPoints
      setPointsToast(`+${gained} бал(и)`) 
      setShowPointsToast(true)
      setLastPoints(student.points)
    } else if (student.points !== lastPoints) {
      setLastPoints(student.points)
    }
  }, [student, lastPoints])

  useEffect(() => {
    if (!showPointsToast) return

    const timeoutId = window.setTimeout(() => {
      setShowPointsToast(false)
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [showPointsToast])

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()
    if (!isRegisterValid) return

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const payload = await api.register({
        name: registerForm.name,
        nickname: registerForm.nickname,
        classLevel: Number(registerForm.classLevel),
        password: registerForm.password,
      })

      setMessage(`Готово! Учень ${payload.student.nickname} створений.`)
      setRegisterForm({
        name: '',
        nickname: '',
        classLevel: '1',
        password: '',
      })
      setMode('login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка реєстрації.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    if (!isLoginValid) return

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const payload = await api.login(loginForm)

      setMessage(`Вхід успішний. Привіт, ${payload.student.name}!`)
      setLoginForm({ identifier: '', password: '' })
      setStudent(payload.student)
      resetModule()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка входу.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setStudent(null)
    resetModule()
    setMessage('Ви вийшли з акаунта.')
  }

  const handleSelectModule = (module: ModuleSummary) => {
    setActiveModule(module)
    setModuleState(null)
    setModuleMessage('')
    setModuleError('')
    setSelectedAnswer(null)
  }

  const handleStartModule = async (moduleId: string) => {
    if (!student) return
    setModuleLoading(true)
    setModuleMessage('')
    setModuleError('')
    setSelectedAnswer(null)

    try {
      const payload = await api.startModule(moduleId, student.id)
      setModuleState(payload)
    } catch (err) {
      setModuleError(
        err instanceof Error ? err.message : 'Не вдалося запустити модуль.',
      )
    } finally {
      setModuleLoading(false)
    }
  }

  const handleAnswer = async () => {
    if (!student || !moduleState?.question || selectedAnswer === null) return

    setModuleLoading(true)
    setModuleMessage('')
    setModuleError('')

    try {
      const payload = await api.answerModule({
        moduleId: moduleState.module.id,
        studentId: student.id,
        levelId: moduleState.question.levelId,
        answerIndex: selectedAnswer,
      })
      setModuleState((prev) =>
        prev
          ? {
              ...prev,
              progress: payload.progress,
              question: payload.question,
              totalLevels: payload.totalLevels,
            }
          : prev,
      )
      setStudent(payload.student)
      setSelectedAnswer(null)
      setModuleMessage(payload.message)
    } catch (err) {
      setModuleError(
        err instanceof Error ? err.message : 'Відповідь не зарахована.',
      )
    } finally {
      setModuleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <PointsToast visible={showPointsToast} message={pointsToast} />
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              School Code Arena
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {student ? 'Навчальні модулі' : 'Авторизація учнів'}
            </h1>
          </div>
          {!student ? (
            <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm">
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`rounded-full px-4 py-2 transition ${
                  mode === 'register'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Реєстрація
              </button>
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-full px-4 py-2 transition ${
                  mode === 'login'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Вхід
              </button>
            </div>
          ) : null}
        </div>

        {!student ? (
          <AuthPanel
            mode={mode}
            registerForm={registerForm}
            loginForm={loginForm}
            isRegisterValid={isRegisterValid}
            isLoginValid={isLoginValid}
            loading={loading}
            message={message}
            error={error}
            onRegister={handleRegister}
            onLogin={handleLogin}
            onChangeRegister={(field, value) =>
              setRegisterForm((prev) => ({ ...prev, [field]: value }))
            }
            onChangeLogin={(field, value) =>
              setLoginForm((prev) => ({ ...prev, [field]: value }))
            }
          />
        ) : !activeModule ? (
          <GameSelectionPage
            student={student}
            modules={modules}
            loading={modulesLoading}
            error={moduleError}
            onSelectModule={handleSelectModule}
            onLogout={handleLogout}
          />
        ) : (
          <div className="mt-8 space-y-6">
            <ModuleFrame
              module={activeModule}
              moduleState={moduleState}
              moduleMessage={moduleMessage}
              moduleError={moduleError}
              moduleLoading={moduleLoading}
              selectedAnswer={selectedAnswer}
              onBack={resetModule}
              onStart={() => handleStartModule(activeModule.id)}
              onSelectAnswer={(index) => setSelectedAnswer(index)}
              onSubmit={handleAnswer}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
