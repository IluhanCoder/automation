import { useEffect, useState } from 'react'

import { api } from '../api'
import type { ModuleSummary } from '../types'

export const useModules = (enabled: boolean) => {
  const [modules, setModules] = useState<ModuleSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadModules = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = await api.listModules()
      setModules(payload.modules ?? [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не вдалося завантажити модулі.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) return
    loadModules()
  }, [enabled])

  return { modules, loading, error, reload: loadModules }
}
