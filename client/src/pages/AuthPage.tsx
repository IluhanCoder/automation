import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { api } from '../framework/api'
import { AuthPanel } from '../framework/components/AuthPanel'
import { Header } from '../framework/components/Header'
import type { ViewMode } from '../framework/types'

export function AuthPage() {
  const navigate = useNavigate()
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
  const [loading, setLoading] = useState(false)

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

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault()
    if (!isRegisterValid) return

    setLoading(true)

    try {
      const payload = await api.register({
        name: registerForm.name,
        nickname: registerForm.nickname,
        classLevel: Number(registerForm.classLevel),
        password: registerForm.password,
      })

      toast.success(`Учня ${payload.student.nickname} створено ✨`)
      setRegisterForm({
        name: '',
        nickname: '',
        classLevel: '1',
        password: '',
      })
      setMode('login')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка реєстрації.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    if (!isLoginValid) return

    setLoading(true)

    try {
      const payload = await api.login(loginForm)

      toast.success(`Вітаю, ${payload.student.name}!`)
      setLoginForm({ identifier: '', password: '' })
      localStorage.setItem('student', JSON.stringify(payload.student))
      navigate('/modules')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка входу.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header student={null} onLogout={() => {}} />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                School Code Arena
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Авторизація учнів
              </h1>
            </div>
            <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode('register')}
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
                onClick={() => setMode('login')}
                className={`rounded-full px-4 py-2 transition ${
                  mode === 'login'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Вхід
              </button>
            </div>
          </div>

          <AuthPanel
            mode={mode}
            registerForm={registerForm}
            loginForm={loginForm}
            isRegisterValid={isRegisterValid}
            isLoginValid={isLoginValid}
            loading={loading}
            onChangeRegister={(field, value) =>
              setRegisterForm((prev) => ({ ...prev, [field]: value }))
            }
            onChangeLogin={(field, value) =>
              setLoginForm((prev) => ({ ...prev, [field]: value }))
            }
            onRegister={handleRegister}
            onLogin={handleLogin}
          />
        </div>
      </div>
    </div>
  )
}
