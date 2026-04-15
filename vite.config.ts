import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function parsePort(value: string | undefined, fallback: number) {
  const n = Number.parseInt(value ?? '', 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const devPort = parsePort(env.PORT, 5173)
  const previewPort = env.PREVIEW_PORT
    ? parsePort(env.PREVIEW_PORT, 4173)
    : env.PORT
      ? parsePort(env.PORT, 4173)
      : 4173

  return {
    plugins: [react()],
    server: {
      port: devPort,
    },
    preview: {
      port: previewPort,
    },
  }
})
