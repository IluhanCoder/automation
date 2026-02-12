import type { ModuleSummary } from '../types'

type ModuleListProps = {
  modules: ModuleSummary[]
  loading: boolean
  onSelect: (module: ModuleSummary) => void
}

export const ModuleList = ({ modules, loading, onSelect }: ModuleListProps) => {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Доступні модулі
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Обери гру, щоб почати
        </h2>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Завантажуємо список ігор...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.id}
              className="group rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 transition hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100"
            >
              <div className="mb-3 inline-block rounded-lg bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700">
                Модуль
              </div>
              <h3 className="mt-3 text-xl font-bold text-slate-900">
                {module.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{module.levelsCount}</span> рівнів · <span className="font-semibold text-slate-900">{module.pointsPerLevel}</span> балів за рівень
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onSelect(module)}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-sm font-bold text-white transition hover:from-indigo-700 hover:to-indigo-600 active:scale-95"
                >
                  Розпочати
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
