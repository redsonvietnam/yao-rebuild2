import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000
const isDev = process.env.NODE_ENV !== 'production'

app.use(express.json())

// ─── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// ─── Dev: Vite middleware ────────────────────────────────────────────────────
if (isDev) {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })
  app.use(vite.middlewares)
} else {
  // ─── Prod: serve built files ───────────────────────────────────────────────
  const distPath = path.resolve(__dirname, 'dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`[Yao Editor] Server running at http://localhost:${PORT}`)
  console.log(`[Yao Editor] Mode: ${isDev ? 'development' : 'production'}`)
})
