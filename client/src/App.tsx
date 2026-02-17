import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthPage } from './pages/AuthPage'
import { ModulesPage } from './pages/ModulesPage'
import { GamePage } from './pages/GamePage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { HtmlBuilderGame } from './modules/htmlBuilder/HtmlBuilderGame'
import type { Student } from './framework/types'

function AppRoutes() {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore student from localStorage on mount
  useEffect(() => {
    const savedStudent = localStorage.getItem('student')
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent))
      } catch (err) {
        console.error('Failed to restore student:', err)
        localStorage.removeItem('student')
      }
    }
    setLoading(false)
  }, [])

  // Listen to storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const savedStudent = localStorage.getItem('student')
      if (savedStudent) {
        try {
          setStudent(JSON.parse(savedStudent))
        } catch (err) {
          console.error('Failed to restore student:', err)
          setStudent(null)
        }
      } else {
        setStudent(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleStudentUpdate = (updatedStudent: Student) => {
    setStudent(updatedStudent)
    localStorage.setItem('student', JSON.stringify(updatedStudent))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-600">Завантаження...</div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/auth"
          element={
            student ? <Navigate to="/modules" replace /> : <AuthPage onLoginSuccess={setStudent} />
          }
        />
        <Route
          path="/modules"
          element={
            student ? (
              <ModulesPage
                student={student}
                onLogout={() => setStudent(null)}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/modules/:moduleId"
          element={
            student ? (
              <GamePage
                student={student}
                onStudentUpdate={handleStudentUpdate}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/leaderboard"
          element={
            student ? (
              <LeaderboardPage
                student={student}
                onLogout={() => setStudent(null)}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/test-builder"
          element={
            <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', flexShrink: 0 }}>HTML Builder Test</h1>
              <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
                <HtmlBuilderGame 
                  question={{
                    levelId: 1,
                    title: "Створи контейнер",
                    description: "Створи червоний контейнер div",
                    targetHtml: '<div class="red">Це червоний контейнер</div>',
                    rules: ["Використай div з класом red"]
                  }}
                />
              </div>
            </div>
          }
        />
        <Route path="/" element={<Navigate to="/modules" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
