import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { api } from '../framework/api'
import { Header } from '../framework/components/Header'
import type { Student } from '../framework/types'

interface LeaderboardEntry {
  rank: number
  id: string
  name: string
  nickname: string
  classLevel: number
  points: number
}

interface LeaderboardPageProps {
  student: Student | null
  onLogout: () => void
}

export function LeaderboardPage({ student, onLogout }: LeaderboardPageProps) {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState(student?.classLevel || 1)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (!student) {
    navigate('/auth')
    return null
  }

  // Load leaderboard when class changes
  useEffect(() => {
    loadLeaderboard()
  }, [selectedClass])

  const loadLeaderboard = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.getLeaderboard(selectedClass)
      setLeaderboard(response.leaderboard)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не вдалось завантажити топ-чарт.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header student={student} onLogout={onLogout} />
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Класи
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Топ-чарт учнів
            </h1>
          </div>

          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((classNum) => (
              <button
                key={classNum}
                onClick={() => setSelectedClass(classNum)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition ${
                  selectedClass === classNum
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {classNum} клас
              </button>
            ))}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-slate-600">Завантаження...</div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                        Позиція
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                        Ім'я
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                        Нікнейм
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        Балів
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                          Немає даних для цього класу
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((entry) => (
                        <tr
                          key={entry.id}
                          className={`border-b border-slate-100 transition hover:bg-slate-50 ${
                            entry.id === student.id ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                                  entry.rank === 1
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : entry.rank === 2
                                      ? 'bg-slate-300 text-slate-700'
                                      : entry.rank === 3
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {entry.rank}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-slate-900">
                              {entry.name}
                              {entry.id === student.id && (
                                <span className="ml-2 text-xs font-semibold text-indigo-600">
                                  (Ви)
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {entry.nickname}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-slate-900">
                              {entry.points}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
