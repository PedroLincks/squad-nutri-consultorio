import { useEffect } from 'react'
import { vsl } from '../data/content'

/** Embed do vTurb, igual ao código fornecido pela plataforma. */
const playerHtml = `
<vturb-smartplayer id="vid-${vsl.vturb.playerId}" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;">
  <div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 133.33333333333331% 0 0; z-index: 0; background-color: black;"></div>
</vturb-smartplayer>`

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
