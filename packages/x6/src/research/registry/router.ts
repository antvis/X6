import { KeyValue } from '../../types'
import { Router } from '../router'
import { registerEntity, getEntity } from './util'

export namespace RouterRegistry {
  const routers: { [name: string]: Router.Definition<any> } = {}

  export function register<T extends Router.NativeNames>(
    name: T,
    fn: Router.Definition<Router.OptionsMap[T]>,
    force?: boolean,
  ): void
  export function register<T extends KeyValue = KeyValue>(
    name: string,
    fn: Router.Definition<T>,
    force?: boolean,
  ): void
  export function register<T>(
    name: string,
    fn: Router.Definition<T>,
    force: boolean = false,
  ) {
    registerEntity(routers, name, fn, force, () => {
      throw new Error(`Router with name '${name}' already registered.`)
    })
  }

  export function get<T extends Router.NativeNames>(
    name: T,
  ): Router.Definition<Router.OptionsMap[T]>
  export function get<T extends KeyValue = KeyValue>(
    name: string,
  ): Router.Definition<T> | null
  export function get(name: string) {
    return getEntity(routers, name)
  }

  export function getNames() {
    return Object.keys(routers)
  }
}

// Regiter native routers
// ----
Object.keys(Router).forEach(key => {
  const name = key as Router.NativeNames
  const fn = Router[name]
  if (typeof fn === 'function') {
    RouterRegistry.register(name, fn, true)
  }
})
