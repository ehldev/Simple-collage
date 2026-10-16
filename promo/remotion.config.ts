import { Config } from '@remotion/cli/config'

// Usa el Chrome instalado en lugar de descargar uno.
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe')
Config.setVideoImageFormat('jpeg')
Config.setJpegQuality(92)
Config.setCodec('h264')
Config.setCrf(18)
