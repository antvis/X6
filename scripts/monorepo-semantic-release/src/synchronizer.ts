import getDebugger from 'debug'
import identity from 'lodash.identity'
import EventEmitter from 'promise-events'
import { Package } from './types'

/**
 * Cross-packages synchronization context.
 */
export namespace Synchronizer {
  const debug = getDebugger('msr:synchronizer')
  const getEventName = (probe: string, pkg?: Package) =>
    `${probe}${pkg ? `:${pkg.name}` : ''}`

  export function create(packages: Package[]) {
    const events = new EventEmitter()
    const store: {
      evt: { [key: string]: Promise<any> }
      subscr: { [key: string]: Promise<any> }
    } = {
      evt: {},
      subscr: {},
    }

    const todo = () => packages.filter((pkg) => pkg.result == null)

    const emit = (probe: string, pkg?: Package) => {
      const name = getEventName(probe, pkg)
      debug('emit: %s', name)
      if (store.evt[name] == null) {
        store.evt[name] = events.emit(name)
      }
      return store.evt[name]
    }

    const once = (probe: string, pkg?: Package) => {
      const name = getEventName(probe, pkg)
      if (store.evt[name]) {
        return store.evt[name]
      }

      if (store.subscr[name] == null) {
        store.subscr[name] = events.once(name)
      }

      return store.subscr[name]
    }

    const waitFor = (probe: string, pkg: Package): Promise<any> => {
      const name = getEventName(probe, pkg)
      const cache = pkg as any
      return cache[name] || (cache[name] = once(probe, pkg))
    }

    const waitForAll = (
      probe: string,
      filter: (p: Package) => boolean = identity,
    ) => {
      const promise = once(probe)

      if (
        todo()
          .filter(filter)
          // eslint-disable-next-line no-prototype-builtins
          .every((pkg) => pkg.hasOwnProperty(probe))
      ) {
        debug('waitForAll: %s', probe)
        emit(probe)
      }

      return promise
    }

    const lucky: { [key: string]: Promise<any> } = {}

    // Only the first lucky package passes the probe.
    const getLucky = (probe: string, pkg: Package) => {
      if (lucky[probe]) {
        return
      }

      debug('lucky: %s', getEventName(probe, pkg))
      lucky[probe] = emit(probe, pkg)
    }

    return {
      ee: events,
      emit,
      once,
      todo,
      waitFor,
      waitForAll,
      getLucky,
    }
  }
}
