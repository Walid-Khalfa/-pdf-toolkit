interface ProgressBarProps {
  label?: string
}

export default function ProgressBar({ label = 'Processing…' }: ProgressBarProps) {
  return (
    <div className="w-full">
      <p className="text-sm text-gray-600 mb-2 text-center">{label}</p>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary-600 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
      </div>
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); width: 60%; }
          50% { width: 80%; }
          100% { transform: translateX(200%); width: 60%; }
        }
      `}</style>
    </div>
  )
}
