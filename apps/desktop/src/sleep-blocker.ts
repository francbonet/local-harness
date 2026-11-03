/** Holds off idle system sleep while the Host reports running agents. */

/** The Electron `powerSaveBlocker` members the sleep blocker uses. */
export interface DesktopPowerSaveBlocker {
  /**
   * @param type - Blocker kind; only system suspension is blocked, so the display may still turn off.
   * @returns Blocker id to release.
   */
  start(type: 'prevent-app-suspension'): number
  /**
   * @param id - Blocker id returned by `start`.
   * @returns Whether a blocker was released.
   */
  stop(id: number): boolean
}

/**
 * Create the shell's single agent sleep blocker. Lid close and explicit sleep still suspend the system.
 * @param blocker - Electron's `powerSaveBlocker`.
 * @returns Setter: true holds one `prevent-app-suspension` blocker, false releases it; repeated values do nothing.
 */
export function createAgentSleepBlocker(blocker: DesktopPowerSaveBlocker): (active: boolean) => void {
  let id: number | undefined
  return (active) => {
    if (active && id === undefined) id = blocker.start('prevent-app-suspension')
    else if (!active && id !== undefined) {
      blocker.stop(id)
      id = undefined
    }
  }
}
