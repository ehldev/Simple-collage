// Genera los PNG de public/ (favicon, apple-touch-icon e imagen Open Graph).
// Uso: node scripts/make-icons.mjs
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'

const out = new URL('../public/', import.meta.url)
const logo = await readFile(new URL('favicon.svg', out))

await sharp(logo, { density: 300 }).resize(32, 32).png().toFile(new URL('favicon-32.png', out).pathname.slice(1))

const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#EEF1F6"/>
  <g transform="translate(30 30) scale(3.75)">
    <rect x="1" y="1" width="17" height="30" rx="5" fill="#FF4D6D"/>
    <rect x="20" y="1" width="11" height="14" rx="4" fill="#FFC93C"/>
    <rect x="20" y="17" width="11" height="14" rx="4" fill="#16213E"/>
  </g>
</svg>`
await sharp(Buffer.from(touch)).png().toFile(new URL('apple-touch-icon.png', out).pathname.slice(1))

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFB3A1"/><stop offset="0.5" stop-color="#FF6F7F"/><stop offset="1" stop-color="#6E4C9A"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#A9C9F5"/><stop offset="0.52" stop-color="#A9C9F5"/>
      <stop offset="0.53" stop-color="#3D6CC2"/><stop offset="1" stop-color="#1E3E80"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#EEF1F6"/>
  <g transform="translate(72 0)">
    <rect x="0" y="150" width="56" height="100" rx="16" fill="#FF4D6D"/>
    <rect x="64" y="150" width="38" height="46" rx="12" fill="#FFC93C"/>
    <rect x="64" y="204" width="38" height="46" rx="12" fill="#16213E"/>
    <text x="0" y="350" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="84" fill="#16213E" letter-spacing="-3">Simple Collage</text>
    <text x="0" y="420" font-family="Segoe UI, Arial, sans-serif" font-weight="500" font-size="36" fill="#4A5675">Crea collages de fotos gratis.</text>
    <text x="0" y="468" font-family="Segoe UI, Arial, sans-serif" font-weight="500" font-size="36" fill="#4A5675">Sin registro, sin subir tus fotos.</text>
  </g>
  <g transform="translate(700 60)">
    <rect x="0" y="0" width="250" height="300" rx="22" fill="url(#sunset)"/>
    <circle cx="125" cy="230" r="34" fill="#FFE29A"/>
    <rect x="266" y="0" width="164" height="142" rx="22" fill="#FFC93C"/>
    <rect x="266" y="158" width="164" height="142" rx="22" fill="#16213E"/>
    <rect x="0" y="316" width="164" height="194" rx="22" fill="url(#sea)"/>
    <rect x="180" y="316" width="250" height="194" rx="22" fill="#FF4D6D"/>
  </g>
</svg>`
await sharp(Buffer.from(og)).png().toFile(new URL('og-image.png', out).pathname.slice(1))

console.log('ok')
