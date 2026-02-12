import type { ModuleSummary } from '../types'

type ModuleListProps = {
  modules: ModuleSummary[]
  loading: boolean
  error: string
  onSelect: (module: ModuleSummary) => void
}

export const ModuleList = ({ modules, loading, error, onSelect }: ModuleListProps) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Доступні модулі
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">
          Обери гру, щоб почати
        </h2>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Завантажуємо список ігор...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <div
              key={module.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Модуль
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {module.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Рівнів: {module.levelsCount} · Балів за рівень: {module.pointsPerLevel}
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onSelect(module)}
                  className="w-full rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Відкрити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
