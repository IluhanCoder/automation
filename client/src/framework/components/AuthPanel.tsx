import type { FormEvent } from 'react'

type AuthPanelProps = {
  mode: 'login' | 'register'
  registerForm: {
    name: string
    nickname: string
    classLevel: string
    password: string
  }
  loginForm: {
    identifier: string
    password: string
  }
  isRegisterValid: boolean
  isLoginValid: boolean
  loading: boolean
  message: string
  error: string
  onRegister: (event: FormEvent) => void
  onLogin: (event: FormEvent) => void
  onChangeRegister: (field: keyof AuthPanelProps['registerForm'], value: string) => void
  onChangeLogin: (field: keyof AuthPanelProps['loginForm'], value: string) => void
}

export const AuthPanel = ({
  mode,
  registerForm,
  loginForm,
  isRegisterValid,
  isLoginValid,
  loading,
  message,
  error,
  onRegister,
  onLogin,
  onChangeRegister,
  onChangeLogin,
}: AuthPanelProps) => {
  return (
    <>
      {message ? (
        <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-700">
          {error}
        </div>
      ) : null}

      {mode === 'register' ? (
        <form className="mt-8 space-y-4" onSubmit={onRegister}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Імʼя та Прізвище
              <input
                type="text"
                value={registerForm.name}
                onChange={(event) => onChangeRegister('name', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                placeholder="Олексій"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Нікнейм
              <input
                type="text"
                value={registerForm.nickname}
                onChange={(event) => onChangeRegister('nickname', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                placeholder="foxCoder"
                required
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Клас (1-8)
              <input
                type="number"
                min={1}
                max={8}
                value={registerForm.classLevel}
                onChange={(event) =>
                  onChangeRegister('classLevel', event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-600">
              Пароль
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => onChangeRegister('password', event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
                placeholder="••••••••"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={!isRegisterValid || loading}
            className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Створюємо акаунт...' : 'Зареєструватися'}
          </button>
        </form>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={onLogin}>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Імʼя або нікнейм
            <input
              type="text"
              value={loginForm.identifier}
              onChange={(event) =>
                onChangeLogin('identifier', event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
              placeholder="foxCoder"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Пароль
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => onChangeLogin('password', event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-400"
              placeholder="••••••••"
              required
            />
          </label>
          <button
            type="submit"
            disabled={!isLoginValid || loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Перевіряємо...' : 'Увійти'}
          </button>
        </form>
      )}
    </>
  )
}
