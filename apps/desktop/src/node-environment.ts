/** Electron Node-mode startup, with private shell launchers scoped to package installation. */

import { delimiter } from 'node:path'

/**
 * Select Electron's Node mode and the shell launcher used by package scripts.
 * Electron's Node mode exits at startup on a `NODE_OPTIONS` flag it disallows, and a login
 * shell can export one for unrelated projects, so the child never receives that variable.
 * @param executable - Electron executable running the application.
 * @param bin - Directory containing the node shell launcher.
 * @param environment - Caller environment preserved for plugin execution, except `NODE_OPTIONS`.
 * @returns Environment for a Node-mode child process.
 */
export function desktopNodeEnvironment(executable: string, bin: string | undefined, environment: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const { NODE_OPTIONS: _nodeOptions, ...inherited } = environment
  return {
    ...inherited,
    ELECTRON_RUN_AS_NODE: '1',
    ...(bin === undefined ? {} : { DSH_DESKTOP_NODE_EXECUTABLE: executable, PATH: `${bin}${delimiter}${environment.PATH ?? ''}` }),
  }
}
