type PointsToastProps = {
  visible: boolean
  message: string
}

export const PointsToast = ({ visible, message }: PointsToastProps) => {
  if (!visible) return null

  return (
    <div className="fixed right-6 top-6 z-50 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
      {message}
    </div>
  )
}
