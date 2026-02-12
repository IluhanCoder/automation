import { useNavigate } from 'react-router-dom'
import type { Student } from '../types'

interface HeaderProps {
  student: Student | null
  onLogout: () => void
}

export function Header({ student, onLogout }: HeaderProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('student')
    onLogout()
    navigate('/auth')
  }

  const handleGoToModules = () => {
    navigate('/modules')
  }

  const handleGoToLeaderboard = () => {
    navigate('/leaderboard')
  }

  return (
    <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={handleGoToModules}
            className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            Модулі
          </button>
          <button
            onClick={handleGoToLeaderboard}
            className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            Топ-чарт
          </button>
          {student && (
            <span className="text-sm text-slate-600">
              Балів: {student.points}
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
        >
          Вийти
        </button>
      </div>
    </div>
  )
}
