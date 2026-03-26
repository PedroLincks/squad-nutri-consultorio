interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full flex items-center justify-between relative px-2" style={{ height: '48px' }}>
      {/* Segmented connecting lines behind dots */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 -z-10 mx-6 flex">
        {Array.from({ length: totalSteps - 1 }, (_, i) => {
          const segmentIndex = i + 1
          // Segment between step i+1 and step i+2
          // Completed: segment before current step (fully done)
          // Active: segment leading INTO the current step
          const isCompleted = segmentIndex < currentStep - 1
          const isActive = segmentIndex === currentStep - 1

          let bg = 'bg-white/5'
          let shadow = ''

          if (isCompleted) {
            bg = 'bg-[#c9a96e]'
            shadow = 'shadow-[0_0_10px_rgba(201,169,110,0.6)]'
          } else if (isActive) {
            bg = 'bg-[#c8874a]'
            shadow = 'shadow-[0_0_10px_rgba(200,135,74,0.6)]'
          }

          return (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-700 ease-in-out ${bg} ${shadow}`}
            />
          )
        })}
      </div>

      {/* Step dots */}
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isCurrent = stepNum === currentStep

        let dotStyle = 'bg-[#1e2a4a] text-white/30 border border-white/10'
        let glowStyle = {}

        if (isCompleted) {
          dotStyle = 'bg-[#c9a96e] text-[#0a1233]'
          glowStyle = { boxShadow: '0 0 12px rgba(201,169,110,0.5)' }
        } else if (isCurrent) {
          dotStyle = 'bg-[#c8874a] text-white'
          glowStyle = { boxShadow: '0 0 16px rgba(200,135,74,0.6)' }
        }

        return (
          <div
            key={stepNum}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all duration-500 ${dotStyle}`}
            style={glowStyle}
          >
            {isCompleted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              stepNum
            )}
          </div>
        )
      })}
    </div>
  )
}
