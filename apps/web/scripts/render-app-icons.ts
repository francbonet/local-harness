/**
 * Render the install icons of the Web application from the Nautilus favicon.
 *
 * A browser installs a Web App only with a raster 192px and a 512px icon, masks
 * the icon it puts on the home screen, and has no manifest support for iOS,
 * which reads `apple-touch-icon` instead. The favicon draws the spiral on a
 * round disc with transparent corners, which a launcher would fill with its own
 * background. This script replaces the disc with a full-bleed square of the
 * same color and rasterizes the result into the committed PNGs under `public/`.
 * The spiral stays within 0.35 of the icon edge from the centre, inside the
 * safe zone a platform mask may crop, so every variant shares one artwork.
 *
 * The committed PNGs are the output; rerun
 * `pnpm --filter @deepseek-ai/dsh-web-frontend run render:app-icons` after the
 * favicon artwork changes.
 * @module render-app-icons
 */

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Vector source shared with the browser tab; 100 units square. */
export const TILE_SOURCE = fileURLToPath(new URL('../public/favicon.svg', import.meta.url))

/** Directory the generated PNGs are committed to. */
export const ICON_OUTPUT_DIRECTORY = fileURLToPath(new URL('../public/', import.meta.url))

/** Artwork edge in source units; every render density is expressed against it. */
const ARTWORK_EDGE = 100

/** Density at which the source's own 1:1 scale renders. */
const SOURCE_DENSITY = 72

/** Samples per output pixel along each axis before reduction. */
const RENDER_SCALE = 4

/** Radius a platform mask is guaranteed to show, as a fraction of the icon edge. */
export const MASKABLE_SAFE_RADIUS_RATIO = 0.4

/** The favicon's round background, replaced because a launcher icon needs opaque corners. */
const LOGO_DISC = '<circle cx="50" cy="50" r="48" fill="#0A0E17"/>'

/** Full-bleed background carrying the disc's color. */
const TILE_FILL = `<rect width="${String(ARTWORK_EDGE)}" height="${String(ARTWORK_EDGE)}" fill="#0A0E17"/>`

/** One committed install icon: the manifest or link member it serves and its edge in pixels. */
export interface AppIconVariant {
  /** File name inside `public/`. */
  readonly file: string
  /** Square edge in pixels. */
  readonly size: number
}

/**
 * Install icons the Web application ships. Chrome requires the 192px and 512px
 * raster pair to offer installation, prefers a maskable icon for the home
 * screen, and iOS reads the touch icon alone.
 */
export const APP_ICON_VARIANTS: readonly AppIconVariant[] = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

/**
 * Rewrite the favicon so the icon canvas is fully opaque.
 * @param source - complete `favicon.svg` document.
 * @returns an SVG document whose background reaches every corner.
 */
export function tileDocument(source: string): string {
  if (!source.includes(LOGO_DISC)) throw new Error('app icons: the favicon has no logo disc')
  return source.trim().replace(LOGO_DISC, TILE_FILL)
}

/**
 * Rasterize one rewritten document at a square edge.
 * @param document - output of {@link tileDocument}.
 * @param size - square edge in pixels.
 * @returns the PNG bytes.
 */
async function renderPng(document: string, size: number): Promise<Buffer> {
  const { default: sharp } = await import('sharp')
  const density = SOURCE_DENSITY * size * RENDER_SCALE / ARTWORK_EDGE
  // A separate raster prevents SVG resize optimizations from bypassing the downsampling step.
  const raster = await sharp(Buffer.from(document), { density })
    .png()
    .toBuffer()
  return sharp(raster)
    .resize(size, size, { kernel: 'lanczos3' })
    .png()
    .toBuffer()
}

/**
 * Render every install icon from the favicon source.
 * @param source - complete `favicon.svg` document.
 * @returns one PNG per {@link APP_ICON_VARIANTS} entry, in declaration order.
 */
export async function renderAppIcons(source: string): Promise<readonly { variant: AppIconVariant; png: Buffer }[]> {
  const document = tileDocument(source)
  return Promise.all(APP_ICON_VARIANTS.map(async variant => ({
    variant,
    png: await renderPng(document, variant.size),
  })))
}

async function main(): Promise<void> {
  const icons = await renderAppIcons(await readFile(TILE_SOURCE, 'utf8'))
  await Promise.all(icons.map(async ({ variant, png }) => {
    await writeFile(resolve(ICON_OUTPUT_DIRECTORY, variant.file), png)
  }))
  console.info(`app icons: wrote ${icons.map(icon => icon.variant.file).join(', ')} to ${ICON_OUTPUT_DIRECTORY}`)
}

if (process.argv[1] !== undefined && import.meta.filename === resolve(process.argv[1])) await main()
