/** Nautilus palette layer over the shipped theme tokens. */
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'

/**
 * Navy surfaces for the dark palette, a sky accent for links and active states
 * in both palettes, and a pink focus ring. Light surfaces repeat the shipped
 * values because an override layer must state both palettes; the darker light
 * accents keep text and rings readable on white.
 */
export const NAUTILUS_PALETTE: ThemeTokenOverrides = {
  '--dsw-alias-bg-base': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#0A0E17' },
  '--dsw-alias-bg-document-preview': { light: 'var(--dsw-static-neutral-bluish-100)', dark: '#0A0E17' },
  '--dsw-alias-bg-layer-1': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#141B29' },
  '--dsw-alias-bg-layer-2': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#1A2232' },
  '--dsw-alias-bg-layer-3': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#232D40' },
  '--dsw-alias-bg-module-platform': { light: 'var(--dsw-static-neutral-bluish-60)', dark: '#232D40' },
  '--dsw-specific-sidebar-fill': { light: 'var(--dsw-static-neutral-bluish-50)', dark: '#0E1420' },
  '--dsw-specific-sidebar-nav-item-active-accent': { light: 'var(--dsw-static-deepseek-100)', dark: '#232D40' },
  '--dsw-specific-input-major': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#1A2232' },
  '--dsw-alias-button-elevated-fill': { light: 'var(--dsw-static-neutral-bluish-00)', dark: '#232D40' },
  '--dsw-alias-button-info-fill': { light: '#0369A1', dark: '#0369A1' },
  '--dsw-alias-button-info-hover': { light: '#075985', dark: '#0284C7' },
  '--dsw-alias-link': { light: '#0369A1', dark: '#38BDF8' },
  '--dsw-alias-state-business-primary': { light: '#0369A1', dark: '#38BDF8' },
  '--dsw-alias-brand-primary-new-colorprimary-new-color': { light: '#0369A1', dark: '#38BDF8' },
  '--dsw-focus-ring-color': { light: '#DB2777', dark: '#EC4899' },
}
