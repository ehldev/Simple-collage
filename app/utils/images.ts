/** Lado máximo con el que guardamos cada foto: suficiente para exportar en 4K sin agotar memoria en móviles. */
const MAX_SIDE = 3200

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/bmp']

export class UnsupportedImageError extends Error {
  constructor(public fileName: string, public reason: 'heic' | 'type' | 'decode') {
    super(reason)
  }
}

export interface LoadedImage {
  bitmap: ImageBitmap
  blob: Blob
  width: number
  height: number
}

function isHeic(file: File) {
  return /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name)
}

/**
 * Decodifica la foto respetando la orientación EXIF y la reduce si es enorme.
 * Nada sale del dispositivo: todo ocurre en el navegador.
 */
export async function loadImageFile(file: Blob & { name?: string }): Promise<LoadedImage> {
  const name = file.name ?? 'image'
  if (file instanceof File && isHeic(file)) throw new UnsupportedImageError(name, 'heic')
  if (file.type && !ACCEPTED_TYPES.includes(file.type)) throw new UnsupportedImageError(name, 'type')

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  }
  catch {
    throw new UnsupportedImageError(name, 'decode')
  }

  const longSide = Math.max(bitmap.width, bitmap.height)
  if (longSide <= MAX_SIDE) {
    return { bitmap, blob: file, width: bitmap.width, height: bitmap.height }
  }

  const scale = MAX_SIDE / longSide
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const keepAlpha = file.type === 'image/png' || file.type === 'image/webp'
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob'))), keepAlpha ? 'image/png' : 'image/jpeg', 0.92)
  })
  const resized = await createImageBitmap(blob)
  return { bitmap: resized, blob, width, height }
}

/** Miniatura ligera (para la bandeja de fotos y la vista previa de filtros). */
export async function makeThumb(source: ImageBitmap, size = 240): Promise<string> {
  const scale = Math.min(1, size / Math.min(source.width, source.height))
  const width = Math.max(1, Math.round(source.width * scale))
  const height = Math.max(1, Math.round(source.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(source, 0, 0, width, height)
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8))
  return blob ? URL.createObjectURL(blob) : canvas.toDataURL('image/jpeg', 0.8)
}
