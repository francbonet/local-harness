import { describe, expect, it, vi } from 'vitest'
import { createAgentSleepBlocker } from '../src/sleep-blocker.ts'

function blocker() {
  let next = 1
  return { start: vi.fn((_type: 'prevent-app-suspension') => next++), stop: vi.fn((_id: number) => true) }
}

describe('Desktop agent sleep blocker', () => {
  it('holds one system-suspension blocker while active and releases it once', () => {
    const power = blocker()
    const setActive = createAgentSleepBlocker(power)
    setActive(true)
    setActive(true)
    expect(power.start.mock.calls).toEqual([['prevent-app-suspension']])
    setActive(false)
    setActive(false)
    expect(power.stop.mock.calls).toEqual([[1]])
  })

  it('starts a fresh blocker after a release', () => {
    const power = blocker()
    const setActive = createAgentSleepBlocker(power)
    setActive(false)
    expect(power.stop).not.toHaveBeenCalled()
    setActive(true)
    setActive(false)
    setActive(true)
    setActive(false)
    expect(power.start).toHaveBeenCalledTimes(2)
    expect(power.stop.mock.calls).toEqual([[1], [2]])
  })
})
