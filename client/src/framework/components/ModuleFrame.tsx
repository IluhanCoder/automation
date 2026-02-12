import type { ModuleState, ModuleSummary } from '../types'

type ModuleFrameProps = {
  module: ModuleSummary
  moduleState: ModuleState | null
  moduleMessage: string
  moduleError: string
  moduleLoading: boolean
  selectedAnswer: number | null
  onBack: () => void
  onStart: () => void
  onSelectAnswer: (index: number) => void
  onSubmit: () => void
}

export const ModuleFrame = ({
  module,
  moduleState,
  moduleMessage,
  moduleError,
  moduleLoading,
  selectedAnswer,
  onBack,
  onStart,
  onSelectAnswer,
  onSubmit,
}: ModuleFrameProps) => {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-slate-500 transition hover:text-slate-900"
      >
        ← Назад до модулів
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Активний модуль
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {module.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Рівнів: {module.levelsCount} · Балів за рівень: {module.pointsPerLevel}
          </p>
        </div>
        <button
          type="button"
          onClick={onStart}
          disabled={moduleLoading}
          className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {moduleLoading ? 'Завантажуємо...' : 'Почати'}
        </button>
      </div>

      {moduleMessage ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-700">
          {moduleMessage}
        </div>
      ) : null}
      {moduleError ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700">
          {moduleError}
        </div>
      ) : null}

      {moduleState ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Рівень {moduleState.progress.currentLevelIndex + 1} з{' '}
              {moduleState.totalLevels}
            </span>
            <span>Зароблено: {moduleState.progress.pointsEarned}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: moduleState.totalLevels }, (_, index) => {
              const isCompleted = index < moduleState.progress.currentLevelIndex
              const isCurrent =
                index === moduleState.progress.currentLevelIndex &&
                moduleState.question
              return (
                <div
                  key={`level-${index + 1}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : isCompleted
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  {index + 1}
                </div>
              )
            })}
          </div>

          {moduleState.question ? (
            <div className="mt-4 space-y-4">
              <p className="text-base font-semibold text-slate-900">
                {moduleState.question.question}
              </p>
              <div className="grid gap-3">
                {moduleState.question.options.map((option, index) => (
                  <label
                    key={option}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      selectedAnswer === index
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="module-answer"
                      value={index}
                      checked={selectedAnswer === index}
                      onChange={() => onSelectAnswer(index)}
                      className="h-4 w-4"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <button
                type="button"
                disabled={selectedAnswer === null || moduleLoading}
                onClick={onSubmit}
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {moduleLoading ? 'Перевіряємо...' : 'Відповісти'}
              </button>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-600">
              Модуль завершено. Ви отримали всі бали.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Запусти модуль, щоб побачити контент.
        </div>
      )}
    </div>
  )
}
