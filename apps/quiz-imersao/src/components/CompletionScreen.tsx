interface CompletionScreenProps {
  brandName: string
}

export function CompletionScreen({ brandName }: CompletionScreenProps) {
  return (
    <div className="animate-fade-in text-center space-y-6">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-[#c9a96e]/20 border-2 border-[#c9a96e] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#c9a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-montserrat">
          Anamnese concluída!
        </h2>
        <p className="text-gray-300 font-inter text-sm sm:text-base">
          Você será redirecionada para o grupo exclusivo da imersão...
        </p>
        <p className="text-gray-400 font-inter text-xs">
          Aguarde um instante.
        </p>
      </div>

      {/* Loading spinner */}
      <div className="flex justify-center pt-2">
        <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
      </div>

      <p className="text-gray-500 text-xs font-inter">
        {brandName}
      </p>
    </div>
  )
}
