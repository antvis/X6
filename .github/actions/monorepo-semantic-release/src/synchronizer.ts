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
    const ee = new EventEmitter()
    const todo = () => packages.filter((p) => p.result == null)

    // Emitter with memo: next subscribers will receive promises from the past if exists.
    const store: {
      evt: { [key: string]: any }
      subscr: { [key: string]: any }
    } = {
      evt: {},
      subscr: {},
    }

    const emit = (probe: string, pkg?: Package) => {
      const name = getEventName(probe, pkg)
      debug('ready: %s', name)
      return store.evt[name] || (store.evt[name] = ee.emit(name))
    }

    const once = (probe: string, pkg?: Package) => {
      const name = getEventName(probe, pkg)
      return (
        store.evt[name] ||
        store.subscr[name] ||
        (store.subscr[name] = ee.once(name))
      )
    }

    const waitFor = (probe: string, pkg: Package) => {
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
          .every((p) => p.hasOwnProperty(probe))
      ) {
        debug('ready: %s', probe)
        emit(probe)
      }

      return promise
    }

    const lucky: { [key: string]: any } = {}

    // Only the first lucky package passes the probe.
    const getLucky = (probe: string, pkg: Package) => {
      if (lucky[probe]) {
        return
      }
      const name = getEventName(probe, pkg)
      debug('lucky: %s', name)
      lucky[probe] = emit(probe, pkg)
    }

    return {
      ee,
      emit,
      once,
      todo,
      waitFor,
      waitForAll,
      getLucky,
    }
  }
}
