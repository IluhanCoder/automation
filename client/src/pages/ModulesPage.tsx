import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { useModules } from '../framework/hooks/useModules'
import { ModuleList } from '../framework/components/ModuleList'
import { Header } from '../framework/components/Header'
import type { Student } from '../framework/types'

interface ModulesPageProps {
  student: Student | null
  onLogout: () => void
}

export function ModulesPage({ student, onLogout }: ModulesPageProps) {
  const navigate = useNavigate()
  const { modules, loading, error } = useModules(Boolean(student))

  const handleSelectModule = (moduleId: string) => {
    navigate(`/modules/${moduleId}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header student={student} onLogout={onLogout} />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              School Code Arena
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Навчальні модулі
            </h1>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-slate-600">Завантаження...</div>
          ) : (
            <ModuleList modules={modules} loading={loading} onSelect={(module) => handleSelectModule(module.id)} />
          )}
        </div>
      </div>
    </div>
  )
}
