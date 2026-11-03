/** Reports whether any agent is running, so the Electron shell can hold off idle system sleep. */

import type { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'

/**
 * Publish whether any agent is `running` (generating, running tools, or waiting for approval) each time
 * that changes. Background jobs and queued messages of an idle agent do not count.
 * @param ctx - Booted Desktop profile context; the publisher lives for each `agents` service lifetime.
 * @param publish - Receives the initial state and every change; receives false when the service is removed
 *   while an agent was running.
 */
export function installAgentActivityPublisher(ctx: Context, publish: (active: boolean) => void): void {
  ctx.inject(['agents'], (agentsCtx) => {
    const running = new Set<Agent>(agentsCtx.agents.list().filter(agent => agent.status === 'running'))
    let published: boolean | undefined
    const update = (): void => {
      const active = running.size > 0
      if (active === published) return
      published = active
      publish(active)
    }
    agentsCtx.on('agent/status', ({ agent, status }) => {
      if (status === 'running') running.add(agent)
      else running.delete(agent)
      update()
    })
    agentsCtx.on('agent/disposed', ({ agent }) => {
      running.delete(agent)
      update()
    })
    agentsCtx.effect(() => () => {
      if (published === true) publish(false)
    })
    update()
  })
}
