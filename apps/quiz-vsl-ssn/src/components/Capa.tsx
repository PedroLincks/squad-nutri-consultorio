import { capa } from '../data/content'
import { Highlight } from './Highlight'

export function Capa({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in flex flex-col items-center gap-6 text-center">
      <div className="w-full rounded-lg bg-brand-pink px-4 py-3 text-sm font-bold tracking-wide text-brand-red">
        {capa.tag}
      </div>

      <h1 className="font-montserrat text-[17px] font-bold leading-snug text-gray-900 sm:text-[22px] sm:leading-snug">
        <Highlight text={capa.headline} />
      </h1>

      {capa.imagem ? (
        <img src={capa.imagem} alt="" width={1080} height={900} onClick={onStart} className="mx-auto h-auto w-full cursor-pointer sm:max-w-md" />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-400">
          [IMAGEM]
        </div>
      )}

      <button onClick={onStart} className="btn-cta">
        {capa.botao}
      </button>
    </div>
  )
}
