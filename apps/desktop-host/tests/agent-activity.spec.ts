import { Context } from '@deepseek-ai/cordis'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { SessionId } from '@deepseek-ai/dsh-session/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installAgentActivityPublisher } from '../src/agent-activity.ts'

type AgentState = Pick<Agent, 'id' | 'status'>

let ctx: Context
let published: boolean[]
const agents: AgentState[] = []

function agent(id: string, status: 'idle' | 'running' = 'idle'): Agent {
  const state: AgentState = { id: SessionId(id), status }
  agents.push(state)
  return state as Agent
}

function setStatus(subject: Agent, status: 'idle' | 'running'): void {
  ctx.emit('agent/status', { agent: subject, status })
}

beforeEach(() => {
  agents.length = 0
  published = []
  ctx = new Context()
})

afterEach(async () => { await ctx.fiber.dispose() })

/**
 * Install against a roster double and await the asynchronous `agents` injection's first publication.
 * @returns The plugin fiber providing the roster; disposing it removes the service.
 */
async function install(): Promise<{ dispose(): Promise<unknown> }> {
  installAgentActivityPublisher(ctx, (active) => { published.push(active) })
  // A narrow roster double exercises the publisher against a real Cordis service lifecycle.
  const provider = await ctx.plugin((scope: Context) => { scope.provide('agents', { list: () => agents } as never) })
  await vi.waitFor(() => { expect(published).not.toHaveLength(0) })
  return provider
}

describe('Desktop Host agent activity', () => {
  it('publishes the idle state once, then each change of whether any agent runs', async () => {
    const first = agent('first')
    const second = agent('second')
    await install()
    expect(published).toEqual([false])
    setStatus(first, 'running')
    setStatus(second, 'running')
    setStatus(first, 'idle')
    expect(published).toEqual([false, true])
    setStatus(second, 'idle')
    setStatus(second, 'idle')
    expect(published).toEqual([false, true, false])
  })

  it('starts from the running agents already in the roster', async () => {
    const busy = agent('busy', 'running')
    await install()
    expect(published).toEqual([true])
    setStatus(busy, 'idle')
    expect(published).toEqual([true, false])
  })

  it('stops counting a running agent that is disposed', async () => {
    const busy = agent('busy', 'running')
    await install()
    ctx.emit('agent/disposed', { agent: busy })
    expect(published).toEqual([true, false])
  })

  it('publishes false when the agents service leaves while an agent runs, then stops listening', async () => {
    const busy = agent('busy')
    const provider = await install()
    setStatus(busy, 'running')
    await provider.dispose()
    await vi.waitFor(() => { expect(published).toEqual([false, true, false]) })
    setStatus(busy, 'running')
    expect(published).toEqual([false, true, false])
  })
})
