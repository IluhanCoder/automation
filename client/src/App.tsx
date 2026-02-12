import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthPage } from './pages/AuthPage'
import { ModulesPage } from './pages/ModulesPage'
import { GamePage } from './pages/GamePage'
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
            student ? <Navigate to="/modules" replace /> : <AuthPage />
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
