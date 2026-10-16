# Video promocional de Simple Collage

Anuncio de 26 s hecho con [Remotion](https://www.remotion.dev/) (React + CSS → MP4).

- `Promo`: 1080 × 1350 (4:5), para el feed de Facebook e Instagram.
- `PromoStory`: 1080 × 1920 (9:16), para Reels e Historias.

El mensaje va en texto grande en pantalla, porque la mayoría ve los anuncios sin sonido.

## Comandos

```bash
npm install
npm run studio        # vista previa en http://localhost:3457
npm run render        # out/simple-collage-4x5.mp4
npm run render:story  # out/simple-collage-9x16.mp4
```

Usa el Chrome instalado (`C:/Program Files/Google/Chrome/Application/chrome.exe`). Si está en otra ruta, define `REMOTION_BROWSER`.

## Cambiar contenido

- **Dominio** que aparece al final: prop `siteUrl` en `src/Root.tsx`.
- **Música**: reemplaza `public/music.wav` (26 s, 120 BPM para que los cortes caigan en el ritmo) y vuelve a renderizar. La actual se genera con `node scripts/make-music.mjs` y no tiene derechos de autor.
- **Fotos de muestra**: `node scripts/make-photos.mjs` (ilustraciones propias, sin derechos de terceros).
- **Revisar cuadros sueltos**: `node scripts/stills.mjs Promo 40 300 700`.

Las escenas están en `src/scenes/` y los tiempos en `src/Promo.tsx` (60 frames = 1 compás de la música).

Remotion es gratis para personas y empresas de hasta 3 empleados; para empresas más grandes requiere licencia.
