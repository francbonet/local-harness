/** Committed install icon dimensions and the generator's opaque tile rewrite. */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  APP_ICON_VARIANTS, ICON_OUTPUT_DIRECTORY, TILE_SOURCE, tileDocument,
} from '../scripts/render-app-icons.ts'
import { pngSize } from './png-size.ts'

describe('web install icons', () => {
  it('ships every declared variant at its declared edge', async () => {
    for (const variant of APP_ICON_VARIANTS) {
      expect(pngSize(await readFile(join(ICON_OUTPUT_DIRECTORY, variant.file))))
        .toEqual([variant.size, variant.size])
    }
  })

  it('replaces the favicon disc with a full-bleed tile and keeps the artwork', async () => {
    const source = await readFile(TILE_SOURCE, 'utf8')
    const tile = tileDocument(source)
    expect(tile).toContain('<rect width="100" height="100" fill="#0A0E17"/>')
    expect(tile).not.toContain('r="48"')
    expect(tile).toContain(source.match(/<path\b[^>]*>/u)![0])
  })

  it('rejects non-PNG bytes and incomplete image headers', () => {
    expect(() => pngSize(Buffer.from('<svg/>'))).toThrow(/PNG IHDR/)
    expect(() => pngSize(Buffer.alloc(33))).toThrow(/PNG IHDR/)
  })

  it('fails loudly on a source without the disc it replaces', () => {
    expect(() => tileDocument('<svg></svg>')).toThrow(/no logo disc/)
  })
})
