# Simple Collage

Creador de collages de fotos gratis que funciona en el navegador. Las fotos nunca se suben a un servidor: todo se procesa y se exporta en el dispositivo del usuario.

Hecho con Nuxt 4 (Vue 3), Tailwind CSS 4 y `@nuxtjs/i18n` (español, inglés y portugués).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
```

Requiere Node.js 22.21+ o 24.11+.

## Producción (sitio estático)

```bash
NUXT_PUBLIC_SITE_URL=https://tu-dominio.com npm run generate
```

El resultado queda en `.output/public` y se puede publicar en cualquier hosting estático (Vercel, Netlify, Cloudflare Pages…). La URL del sitio es necesaria para el sitemap, el canonical y los `hreflang`.

Variables de entorno (ver `.env.example`):

| Variable | Uso |
|---|---|
| `NUXT_PUBLIC_SITE_URL` | Dominio público del sitio |
| `NUXT_PUBLIC_CONTACT_EMAIL` | Correo que se muestra en la página de contacto |
| `NUXT_PUBLIC_PLAUSIBLE_SCRIPT` | Script de Plausible (estadísticas sin cookies) |
| `NUXT_PUBLIC_GA_ID` | Google Analytics 4 |
| `NUXT_PUBLIC_META_PIXEL_ID` | Meta Pixel |

Cómo crear las cuentas de medición y qué eventos se envían: [docs/analitica.md](docs/analitica.md).

## Estructura

| Ruta | Contenido |
|---|---|
| `app/utils/layouts.ts` | Plantillas (celdas en coordenadas 0..1) y formatos |
| `app/utils/render.ts` | Motor de dibujo en canvas, compartido por la vista previa y la exportación |
| `app/composables/useCollageEditor.ts` | Estado del editor, deshacer/rehacer y autoguardado |
| `app/components/editor/` | Interfaz del editor |
| `app/data/landings.ts` | Contenido de las landing pages de SEO, por idioma |
| `app/data/legal.ts` | Privacidad, términos, acerca de y contacto |
| `i18n/locales/` | Textos de la interfaz |

Para regenerar el favicon y la imagen Open Graph: `node scripts/make-icons.mjs`.

El código original en Vue 2 está en `legacy/`.
