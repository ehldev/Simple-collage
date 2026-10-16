// Genera las "fotos" ilustradas del video (sin derechos de terceros).
// Uso: node scripts/make-photos.mjs
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../public/photos/', import.meta.url))
await mkdir(dir, { recursive: true })

const W = 1200
const H = 1500

function hills(base, amp, color, seed) {
  let d = `M0 ${H} `
  for (let i = 0; i <= 48; i++) {
    const x = (i / 48) * W
    const y = base - amp * (Math.sin(i * 0.35 + seed) * 0.6 + Math.sin(i * 0.13 + seed * 2) * 0.4)
    d += `L${x.toFixed(1)} ${y.toFixed(1)} `
  }
  return `<path d="${d}L${W} ${H} Z" fill="${color}"/>`
}

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const scenes = {
  sunset: `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2B2D6E"/><stop offset="0.55" stop-color="#E8735A"/><stop offset="1" stop-color="#F9CF86"/>
      </linearGradient>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3B4A7A"/><stop offset="1" stop-color="#121731"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H * 0.62}" fill="url(#sky)"/>
    <circle cx="${W * 0.55}" cy="${H * 0.6}" r="120" fill="#FFE3A3"/>
    <rect y="${H * 0.6}" width="${W}" height="${H * 0.4}" fill="url(#sea)"/>
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${W * 0.55 - 60 - i * 6}" y="${H * 0.62 + i * 26}" width="${120 + i * 12}" height="6" rx="3" fill="#FFD68C" opacity="${0.75 - i * 0.04}"/>`).join('')}
    ${Array.from({ length: 3 }, (_, i) => `<path d="M${200 + i * 70} ${300 + i * 30} q 18 -14 36 0 q 18 -14 36 0" stroke="#2B2D6E" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}`,

  mountain: `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7FB0EA"/><stop offset="1" stop-color="#E6F0FA"/>
      </linearGradient>
      <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4C86C6"/><stop offset="1" stop-color="#22507F"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <path d="M-120 1000 L420 330 L760 760 L960 520 L1320 1000 Z" fill="#6A7BA2"/>
    <path d="M330 440 L420 330 L520 455 L470 430 L420 470 L380 430 Z" fill="#F5F8FC"/>
    <path d="M900 590 L960 520 L1030 610 L985 595 L950 620 Z" fill="#F5F8FC"/>
    ${hills(1010, 40, '#3E6B4A', 1)}
    <rect y="1060" width="${W}" height="440" fill="url(#lake)"/>
    ${hills(1120, 18, '#2C4F36', 4)}
    <rect y="1180" width="${W}" height="320" fill="url(#lake)" opacity="0.85"/>`,

  city: (() => {
    const r = seeded(7)
    let out = `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0E1230"/><stop offset="1" stop-color="#4A2F6B"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <circle cx="930" cy="260" r="70" fill="#F4EBD0"/>`
    for (let i = 0; i < 12; i++) {
      const bw = 130 + r() * 60
      const bx = i * 105 - 40
      const bh = 500 + r() * 650
      out += `<rect x="${bx}" y="${H - bh}" width="${bw}" height="${bh}" fill="${i % 2 ? '#1B2045' : '#262C5A'}"/>`
      for (let wy = H - bh + 30; wy < H - 40; wy += 46) {
        for (let wx = bx + 18; wx < bx + bw - 24; wx += 34) {
          if (r() > 0.55) out += `<rect x="${wx}" y="${wy}" width="16" height="22" rx="2" fill="#FFCF73" opacity="${0.6 + r() * 0.4}"/>`
        }
      }
    }
    return out
  })(),

  field: (() => {
    const r = seeded(3)
    let flowers = ''
    for (let i = 0; i < 140; i++) {
      const x = r() * W
      const y = 1080 + r() * 420
      const s = 6 + r() * 9 + (y - 1080) / 40
      flowers += `<circle cx="${x}" cy="${y}" r="${s}" fill="${['#F6D04D', '#FFFFFF', '#F49AC1'][i % 3]}"/>`
    }
    return `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3F86D6"/><stop offset="1" stop-color="#C4E3FB"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    ${[[260, 260], [820, 400]].map(([cx, cy]) => `<g fill="#FFFFFF" opacity="0.95"><circle cx="${cx}" cy="${cy}" r="70"/><circle cx="${cx + 80}" cy="${cy - 30}" r="85"/><circle cx="${cx + 170}" cy="${cy}" r="65"/><rect x="${cx}" y="${cy}" width="170" height="60"/></g>`).join('')}
    ${hills(930, 50, '#A6CF5E', 2)}
    ${hills(1060, 60, '#6FA33D', 5)}
    ${flowers}`
  })(),

  beach: `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5DB8EE"/><stop offset="1" stop-color="#D9F1FB"/>
      </linearGradient>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1590B8"/><stop offset="1" stop-color="#5FD0D8"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    <circle cx="950" cy="230" r="90" fill="#FFF3B8"/>
    <rect y="640" width="${W}" height="330" fill="url(#sea)"/>
    <path d="M0 930 Q 600 860 1200 990 L1200 1500 L0 1500 Z" fill="#EFD8A8"/>
    <path d="M0 930 Q 300 900 600 915 Q 900 930 1200 990" stroke="#FFFFFF" stroke-width="14" fill="none" opacity="0.8"/>
    <path d="M200 1120 A 200 200 0 0 1 600 1120 Z" fill="#E8505B"/>
    <path d="M266 1120 A 134 200 0 0 1 400 920 A 134 200 0 0 1 534 1120 Z" fill="#FFFFFF" opacity="0.9"/>
    <rect x="394" y="1110" width="12" height="260" fill="#7A5A3A"/>
    <rect x="620" y="1260" width="300" height="70" rx="20" fill="#FFC93C"/>`,

  party: (() => {
    const r = seeded(11)
    let confetti = ''
    for (let i = 0; i < 110; i++) {
      confetti += `<rect x="${r() * W}" y="${r() * H}" width="${14 + r() * 14}" height="${8 + r() * 6}" rx="3" fill="${['#FF4D6D', '#FFC93C', '#8DB0E8', '#7BC8A4', '#FFFFFF'][i % 5]}" transform="rotate(${r() * 180} ${r() * W} ${r() * H})"/>`
    }
    const balloon = (x, y, c) => `<path d="M${x} ${y + 150} q -20 120 10 230" stroke="#FFFFFF" stroke-width="4" fill="none" opacity="0.8"/><ellipse cx="${x}" cy="${y}" rx="110" ry="135" fill="${c}"/><ellipse cx="${x - 40}" cy="${y - 50}" rx="22" ry="38" fill="#FFFFFF" opacity="0.35"/>`
    return `
    <defs>
      <radialGradient id="bg" cx="0.5" cy="0.4" r="0.8">
        <stop offset="0" stop-color="#7A4BC2"/><stop offset="1" stop-color="#2A1C5A"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    ${confetti}
    ${balloon(300, 420, '#FF4D6D')}${balloon(620, 330, '#FFC93C')}${balloon(900, 470, '#8DB0E8')}
    <rect x="330" y="1000" width="540" height="300" rx="30" fill="#F7E1C8"/>
    <rect x="330" y="1000" width="540" height="90" rx="30" fill="#F9A8BA"/>
    ${[430, 600, 770].map(x => `<rect x="${x - 8}" y="900" width="16" height="100" rx="6" fill="#FFFFFF"/><ellipse cx="${x}" cy="885" rx="14" ry="24" fill="#FFC93C"/>`).join('')}`
  })(),
}

for (const [name, body] of Object.entries(scenes)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`
  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(`${dir}${name}.jpg`)
}
console.log('ok', Object.keys(scenes).join(', '))
