// Renderiza cuadros sueltos para revisar el video: node scripts/stills.mjs Promo 40 120 ...
import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import path from 'node:path'

const [id = 'Promo', ...frames] = process.argv.slice(2)
const browserExecutable = process.env.REMOTION_BROWSER ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') })
const composition = await selectComposition({ serveUrl, id, browserExecutable })
for (const f of frames.map(Number)) {
  await renderStill({ composition, serveUrl, frame: f, output: path.resolve(`out/${id}-${String(f).padStart(3, '0')}.png`), browserExecutable, scale: 0.5 })
  console.log('frame', f)
}
