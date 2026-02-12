import type { Student } from '../types'

type StudentCardProps = {
  student: Student
  onLogout: () => void
}

export const StudentCard = ({ student, onLogout }: StudentCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Активний учень</p>
          <p className="text-lg font-semibold text-slate-900">
            {student.name} ({student.nickname})
          </p>
          <p className="text-sm text-slate-500">
            Клас: {student.classLevel} · Балів: {student.points}
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Вийти
        </button>
      </div>
    </div>
  )
}
