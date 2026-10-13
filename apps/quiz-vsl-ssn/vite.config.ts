import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Em desenvolvimento, serve /api/stats com o mesmo handler da Vercel. */
function apiDev(): Plugin {
  return {
    name: 'api-dev',
    configureServer(server) {
      // Variáveis vazias herdadas do shell não podem esconder as do .env.local
      for (const [k, v] of Object.entries(process.env)) if (v === '') delete process.env[k]
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      server.middlewares.use('/api/stats', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/stats.ts')
          const request = new Request(`http://localhost${req.originalUrl}`, {
            headers: req.headers as Record<string, string>,
          })
          const response: Response = await mod.default(request)
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(await response.text())
        } catch (error) {
          console.error('Error in api-dev:', error)
          res.statusCode = 500
          res.end(JSON.stringify({ erro: String(error) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiDev()],
})
