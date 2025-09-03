import type { AttrDefinition } from './index'

export const port: AttrDefinition = {
  set(port) {
    if (port != null && typeof port === 'object' && port.id) {
      return port.id as string
    }
    return port as string
  },
}
