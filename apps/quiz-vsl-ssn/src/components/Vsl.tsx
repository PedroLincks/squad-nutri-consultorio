import { useEffect } from 'react'
import { vsl } from '../data/content'

/** Embed do vTurb, igual ao código fornecido pela plataforma. */
const playerHtml = `<vturb-smartplayer id="${vsl.vturb.elementId}" style="display: block; margin: 0 auto; width: 100%; "></vturb-smartplayer>`

export function Vsl() {
  useEffect(() => {
    if (document.querySelector(`script[src="${vsl.vturb.scriptUrl}"]`)) return
    const s = document.createElement('script')
    s.src = vsl.vturb.scriptUrl
    s.async = true
    document.head.appendChild(s)
  }, [])

  return (
    <div className="animate-fade-in">
      <div dangerouslySetInnerHTML={{ __html: playerHtml }} />
    </div>
  )
}
