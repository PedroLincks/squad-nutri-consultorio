/** Renderiza texto com trechos **destacados** — em vermelho (padrão) ou em negrito. */
export function Highlight({ text, bold = false }: { text: string; bold?: boolean }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={bold ? 'font-extrabold' : 'text-brand-red'}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
