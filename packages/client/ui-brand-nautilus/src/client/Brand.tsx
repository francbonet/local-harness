import type { HeroBrandMarkOwnerProps } from '@deepseek-ai/dsh-client-ui-conversation/client'

/** Product name; a proper noun rendered unchanged in every locale. */
export const NAUTILUS_NAME = 'Nautilus'

/**
 * Render the Nautilus mark at the size its host surface requests. The artwork
 * keeps fixed colors because its own disc supplies the contrast in both palettes.
 * @param props - Host-supplied mark presentation.
 * @returns the Nautilus spiral on its dark disc.
 */
export function NautilusMark({ size, className }: HeroBrandMarkOwnerProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="#0A0E17" />
      <path
        d="M 50,22 C 68,22 82,36 82,54 C 82,70 68,82 50,82 C 34,82 24,70 24,56 C 24,44 34,34 46,34 C 54,34 60,40 60,48 C 60,54 55,58 50,58 C 45,58 42,55 42,50"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="50" r="3.5" fill="#EC4899" />
    </svg>
  )
}

/**
 * Render the product name in the sidebar's brand typography.
 * @returns the Nautilus name.
 */
export function NautilusName() {
  return <span>{NAUTILUS_NAME}</span>
}
