import type { Definition } from './index'

export const port: Definition = {
  set(port) {
    if (port != null && typeof port === 'object' && port.id) {
      return port.id as string
    }
    return port as string
  },
}
