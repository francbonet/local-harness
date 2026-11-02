import { delimiter } from 'node:path'
import { expect, it } from 'vitest'
import { desktopNodeEnvironment } from '../src/node-environment.ts'

it('keeps private Desktop launchers out of the Host environment inherited by PTC', () => {
  const environment = { PATH: '/user/bin', HOME: '/user' }
  expect(desktopNodeEnvironment('/desktop/electron', undefined, environment)).toEqual({
    ...environment, ELECTRON_RUN_AS_NODE: '1',
  })
  expect(environment).toEqual({ PATH: '/user/bin', HOME: '/user' })
})

it('drops NODE_OPTIONS because Electron Node mode exits on flags it disallows', () => {
  const environment = { PATH: '/user/bin', NODE_OPTIONS: '--openssl-legacy-provider' }
  expect(desktopNodeEnvironment('/desktop/electron', undefined, environment)).toEqual({
    PATH: '/user/bin', ELECTRON_RUN_AS_NODE: '1',
  })
  expect(environment.NODE_OPTIONS).toBe('--openssl-legacy-provider')
})

it('provides private launchers only to package installation processes', () => {
  expect(desktopNodeEnvironment('/desktop/electron', '/desktop/bin', { PATH: '/user/bin' })).toEqual({
    ELECTRON_RUN_AS_NODE: '1',
    DSH_DESKTOP_NODE_EXECUTABLE: '/desktop/electron',
    PATH: `/desktop/bin${delimiter}/user/bin`,
  })
})
