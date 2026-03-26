interface CompletionScreenProps {
  brandName: string
}

export function CompletionScreen({ brandName }: CompletionScreenProps) {
  return (
    <div className="animate-fade-in text-center space-y-6">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-montserrat">
          Diagnóstico concluído!
        </h2>
        <p className="text-gray-300 font-inter text-sm sm:text-base">
          Estamos preparando sua análise personalizada...
        </p>
        <p className="text-gray-400 font-inter text-xs">
          Você será redirecionada em instantes.
        </p>
      </div>

      {/* Loading spinner */}
      <div className="flex justify-center pt-2">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>

      <p className="text-gray-500 text-xs font-inter">
        {brandName}
      </p>
    </div>
  )
}
