import { ModuleList } from '../components/ModuleList'
import { StudentCard } from '../components/StudentCard'
import type { ModuleSummary, Student } from '../types'

type GameSelectionPageProps = {
  student: Student
  modules: ModuleSummary[]
  loading: boolean
  error: string
  onSelectModule: (module: ModuleSummary) => void
  onLogout: () => void
}

export const GameSelectionPage = ({
  student,
  modules,
  loading,
  error,
  onSelectModule,
  onLogout,
}: GameSelectionPageProps) => {
  return (
    <div className="mt-8 space-y-6">
      <StudentCard student={student} onLogout={onLogout} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ModuleList
          modules={modules}
          loading={loading}
          error={error}
          onSelect={onSelectModule}
        />
      </div>
    </div>
  )
}
