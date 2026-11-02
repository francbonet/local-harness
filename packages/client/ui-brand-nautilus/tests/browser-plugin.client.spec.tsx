// @vitest-environment jsdom
import { Context } from '@deepseek-ai/cordis'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { SlotRegistry } from '@deepseek-ai/dsh-client-ui-renderer/client'
import { apply, inject } from '../src/client/index.ts'
import { NAUTILUS_NAME, NautilusMark, NautilusName } from '../src/client/Brand.tsx'
import { NAUTILUS_PALETTE } from '../src/client/palette.ts'
import { apply as hostApply } from '../src/index.ts'

afterEach(() => { cleanup() })

const HOLES = [
  'sidebar.brand.mark',
  'sidebar.brand.name',
  'conversation.hero.brand.mark',
] as const

async function bench(declare = true) {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  const removeLayer = vi.fn()
  const overrideTokens = vi.fn(() => removeLayer)
  ctx.provide('theme', { overrideTokens } as never)
  const slots = ctx.get('slots') as SlotRegistry
  const declareHoles = () => slots.register({
    name: 'root',
    children: Object.fromEntries(HOLES.map(name => [name, { kind: 'single', scope: 'root' }])),
  } as never, () => null)
  const disposeHoles = declare ? declareHoles() : undefined
  return { ctx, slots, declareHoles, disposeHoles, overrideTokens, removeLayer }
}

/** WCAG contrast ratio between two `#RRGGBB` colors. */
function contrast(first: string, second: string): number {
  const luminance = (color: string) => {
    const [red, green, blue] = [1, 3, 5]
      .map(start => Number.parseInt(color.slice(start, start + 2), 16) / 255)
      .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4) as [number, number, number]
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue
  }
  const [low, high] = [luminance(first), luminance(second)].sort((a, b) => a - b) as [number, number]
  return (high + 0.05) / (low + 0.05)
}

describe('Nautilus browser-brand plugin', () => {
  it('keeps the host Loader entry inert', () => {
    expect(hostApply).not.toThrow()
  })

  it('declares the services it uses', () => {
    expect(inject).toEqual(['slots', 'theme'])
  })

  it('fills declarations before or after apply and removes every occupant and the palette on teardown', async () => {
    const before = await bench()
    const fiber = before.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(before.overrideTokens).toHaveBeenCalledExactlyOnceWith('ui-brand-nautilus', NAUTILUS_PALETTE)
    for (const hole of HOLES) expect(before.slots.entries(hole)).toHaveLength(1)

    before.disposeHoles?.()
    for (const hole of HOLES) expect(before.slots.entries(hole)).toHaveLength(0)
    before.declareHoles()
    await Promise.resolve()
    for (const hole of HOLES) expect(before.slots.entries(hole)).toHaveLength(1)

    await fiber.dispose()
    for (const hole of HOLES) expect(before.slots.entries(hole)).toHaveLength(0)
    expect(before.removeLayer).toHaveBeenCalledOnce()

    const after = await bench(false)
    await after.ctx.plugin({ inject: [...inject], apply }).await()
    for (const hole of HOLES) expect(after.slots.entries(hole)).toHaveLength(0)
    after.declareHoles()
    await Promise.resolve()
    for (const hole of HOLES) expect(after.slots.entries(hole)).toHaveLength(1)
  })

  it('renders the mark at each requested size and passes the host class through', () => {
    const mark = render(<NautilusMark size={24} />)
    const svg = () => mark.container.querySelector('svg')
    expect(svg()?.getAttribute('viewBox')).toBe('0 0 100 100')
    expect(svg()?.getAttribute('width')).toBe('24')
    mark.rerender(<NautilusMark size={34} className="hero" />)
    expect(svg()?.getAttribute('height')).toBe('34')
    expect(svg()?.getAttribute('class')).toBe('hero')
  })

  it('renders the product name', () => {
    expect(render(<NautilusName />).container.textContent).toBe(NAUTILUS_NAME)
  })

  it('keeps links readable and focus rings visible on the base surface of each palette', () => {
    const link = NAUTILUS_PALETTE['--dsw-alias-link']!
    const ring = NAUTILUS_PALETTE['--dsw-focus-ring-color']!
    const darkBase = NAUTILUS_PALETTE['--dsw-alias-bg-base']!.dark
    expect(contrast(link.dark, darkBase)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(link.light, '#FFFFFF')).toBeGreaterThanOrEqual(4.5)
    expect(contrast(ring.dark, darkBase)).toBeGreaterThanOrEqual(3)
    expect(contrast(ring.light, '#FFFFFF')).toBeGreaterThanOrEqual(3)
  })

  it('keeps the white send arrow readable on the info button in each palette', () => {
    for (const token of ['--dsw-alias-button-info-fill', '--dsw-alias-button-info-hover']) {
      const { light, dark } = NAUTILUS_PALETTE[token]!
      expect(contrast(light, '#FFFFFF'), token).toBeGreaterThanOrEqual(3)
      expect(contrast(dark, '#FFFFFF'), token).toBeGreaterThanOrEqual(3)
    }
  })
})
