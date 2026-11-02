/** Nautilus occupants for the generic browser-brand slots and its palette layer. */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-theme/client'
import { NautilusMark, NautilusName } from './Brand.tsx'
import { NAUTILUS_PALETTE } from './palette.ts'

/** Required services: the UI slot registry and the theme token layers. */
export const inject = ['slots', 'theme']

/**
 * Stack the palette layer, fill the sidebar slots as one declaration-aware
 * registration set, and fill the conversation hero independently. Disposal
 * removes the layer and every occupant.
 * @param ctx - Client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.theme.overrideTokens('ui-brand-nautilus', NAUTILUS_PALETTE))
  ctx.slots.inject('sidebar.brand.mark', () =>
    ctx.slots.inject('sidebar.brand.name', function* () {
      yield ctx.slots.register({ name: 'sidebar.brand.mark' }, NautilusMark)
      yield ctx.slots.register({ name: 'sidebar.brand.name' }, NautilusName)
    }))
  ctx.slots.inject('conversation.hero.brand.mark', () =>
    ctx.slots.register({ name: 'conversation.hero.brand.mark' }, NautilusMark))
}
