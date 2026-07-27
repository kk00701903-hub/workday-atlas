import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// GitHub Pages는 라우트가 없으면 404.html을 보여줍니다.
// React Router(경로 기반)가 동작하도록 index.html을 404.html로 복사합니다.
const distDir = 'dist'
const indexPath = join(distDir, 'index.html')
const notFoundPath = join(distDir, '404.html')

if (!existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath} (did you run vite build?)`)
}

copyFileSync(indexPath, notFoundPath)
console.log('Copied dist/index.html -> dist/404.html')

