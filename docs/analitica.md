# Medición: Plausible, Google Analytics 4 y Meta Pixel

El sitio ya tiene el código listo. Solo hay que crear las cuentas y poner los IDs en las variables de entorno del hosting (ver `.env.example`). Cada herramienta se activa únicamente si su variable tiene valor.

| Herramienta | Para qué sirve | ¿Necesita permiso de cookies? |
|---|---|---|
| Plausible | Visitas, de dónde llegan y cuántos descargan, en un panel simple | No: no usa cookies, se carga siempre |
| Google Analytics 4 | Análisis detallado y gratuito | Sí: hasta que la persona acepta funciona sin cookies (Consent Mode v2) |
| Meta Pixel | Medir y optimizar los anuncios de Facebook e Instagram | Sí: no se carga hasta que la persona acepta |

Si GA4 o Meta Pixel están activos, aparece el aviso de cookies con «Aceptar» y «Rechazar», y un enlace «Preferencias de cookies» en el pie de página para cambiar la decisión.

## Eventos que envía el sitio

| Acción | Plausible | Google Analytics | Meta Pixel |
|---|---|---|---|
| Añadió fotos al editor | `Add Photos` | `photos_added` | `AddPhotos` |
| Descargó un collage | `Download Collage` | `collage_download` | `CollageDownload` |
| Compartió desde el celular | `Share Collage` | `collage_share` | `CollageShare` |

Datos que acompañan a la descarga: `format` (jpeg/png/webp), `size` (social/hd/max), `layout`, `ratio`, `photos` y `texts`. Nunca se envían fotos ni textos del collage.

Las páginas vistas se envían solas en las tres herramientas, incluida la navegación interna.

---

## 1. Plausible (de pago, desde 9 USD/mes, con 30 días de prueba)

1. Crea una cuenta en plausible.io y agrega tu dominio.
2. En la instalación del sitio, copia la URL del script (`https://plausible.io/js/pa-XXXX.js`) y ponla en `NUXT_PUBLIC_PLAUSIBLE_SCRIPT`.
3. En **Site settings › Goals**, agrega tres objetivos de tipo *Custom event*: `Add Photos`, `Download Collage` y `Share Collage`.
4. Para ver el formato o la plantilla más usados, activa **Custom properties** y agrega `format`, `size`, `layout` y `ratio`.

Si prefieres no pagar Plausible, deja la variable vacía: GA4 cubre lo mismo.

## 2. Google Analytics 4 (gratis)

1. En analytics.google.com crea una **propiedad** y un **flujo de datos web** con tu dominio.
2. Copia el **ID de medición** (`G-…`) en `NUXT_PUBLIC_GA_ID`.
3. Cuando lleguen los primeros eventos (puede tardar hasta 24 h), ve a **Administrar › Eventos** y marca `collage_download` como **evento clave**. Es tu conversión principal.
4. Para ver los parámetros en los informes, crea **dimensiones personalizadas** (Administrar › Definiciones personalizadas) con ámbito *Evento*: `format`, `size`, `layout` y `ratio`.
5. En **Administrar › Recopilación de datos**, revisa que la región de tus visitantes tenga la configuración de consentimiento que necesitas.

## 3. Meta Pixel (gratis)

1. En business.facebook.com › **Administrador de eventos**, crea un **conjunto de datos (píxel)** de tipo web.
2. Copia su ID en `NUXT_PUBLIC_META_PIXEL_ID`.
3. En **Configuración de la empresa › Seguridad de la marca › Dominios**, **verifica tu dominio** (Meta lo pide para optimizar anuncios).
4. Cuando lleguen los primeros eventos, crea una **conversión personalizada** basada en el evento `CollageDownload` (por ejemplo, «Descarga de collage»).
5. En la campaña, elige el objetivo **Ventas** o **Clientes potenciales** y optimiza para esa conversión personalizada. Así Facebook busca personas que de verdad hacen un collage, no solo clics.

## 4. Enlaces de los anuncios

Usa parámetros UTM para distinguir cada anuncio en Plausible y en GA4, por ejemplo:

```
https://tu-dominio.com/collage-para-instagram?utm_source=facebook&utm_medium=paid&utm_campaign=lanzamiento&utm_content=video-4x5
```

Cambia `utm_content` por `video-9x16` en la versión de Reels para comparar cuál funciona mejor.

## Importante para la fase 4 (AdSense)

El aviso de cookies actual es propio y cumple para GA4 y Meta. Para mostrar anuncios de AdSense a visitantes de Europa, Reino Unido o Suiza, Google exige una **plataforma de consentimiento certificada (CMP)**. La opción más simple es la gratuita de Google (**AdSense › Privacidad y mensajes**). Cuando lleguemos a esa fase, conviene reemplazar este aviso por esa CMP para tener uno solo.
