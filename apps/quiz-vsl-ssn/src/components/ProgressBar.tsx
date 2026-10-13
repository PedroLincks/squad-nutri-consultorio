/** Barra fina no topo, igual ao quiz-wn. */
export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-pink">
      <div className="h-full rounded-full bg-brand-red transition-all duration-500 ease-out" style={{ width: `${percent}%` }} />
    </div>
  )
}
