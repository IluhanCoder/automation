import type { ModuleState, ModuleSummary } from '../types'

type ActionButtonConfig = {
  label: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}

type ModuleFrameProps = {
  module: ModuleSummary
  moduleState: ModuleState | null
  moduleLoading: boolean
  selectedAnswer: number | null
  actionButton?: ActionButtonConfig
  onBack: () => void
  onSelectLevel: (levelId: string) => void
  onSelectAnswer: (index: number) => void
}

export const ModuleFrame = ({
  module,
  moduleState,
  moduleLoading,
  selectedAnswer,
  actionButton,
  onBack,
  onSelectLevel,
  onSelectAnswer,
}: ModuleFrameProps) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-4 px-4 sm:px-6 lg:px-8">
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
      </div>

      {moduleState ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Рівень {moduleState.question ? (moduleState.levels?.findIndex(l => l.id === moduleState.question?.levelId) ?? 0) + 1 : moduleState.progress.currentLevelIndex + 1}
            </span>
            <span>Зароблено: {moduleState.progress.pointsEarned}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: moduleState.totalLevels }, (_, index) => {
              const levelId = moduleState.levels?.[index]?.id || `level-${index}`;
              const isCompleted = moduleState.progress.completedLevelIds.some(
                (id) => id === levelId
              );
              const isCurrent = index === moduleState.progress.currentLevelIndex
              const isClickable = isCompleted || isCurrent;
              
              return (
                <button
                  key={`level-${index + 1}`}
                  type="button"
                  onClick={() => isClickable && onSelectLevel(levelId)}
                  disabled={!isClickable || moduleLoading}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 cursor-pointer'
                      : isCompleted
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 cursor-pointer hover:bg-emerald-500/20'
                        : 'border-slate-200 bg-white text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>

          {moduleState.question ? (
            <div className="mx-auto mt-4 max-w-2xl space-y-4">
              <p className="text-base font-semibold text-slate-900">
                {moduleState.question.question}
              </p>
              <div className="grid gap-3">
                {moduleState.question.options.map((option, index) => {
                  return (
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
                        disabled={moduleLoading}
                        className="h-4 w-4"
                      />
                      {option}
                    </label>
                  )
                })}
              </div>
              {actionButton && (
                <button
                  type="button"
                  disabled={actionButton.disabled || moduleLoading}
                  onClick={actionButton.onClick}
                  className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionButton.loading ? 'Перевіряємо...' : actionButton.label}
                </button>
              )}
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-600">
              Обери рівень для повторного проходження.
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Запусти модуль, щоб побачити контент.
        </div>
      )}
      </div>
    </div>
  )
}
