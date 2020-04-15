import { KeyValue } from '../../types'

function getHMRStatus() {
  const mod = module as any
  if (mod != null && mod.hot != null && mod.hot.status != null) {
    return mod.hot.status()
  }
  return 'unkonwn'
}

function isApplyingHMR() {
  return getHMRStatus() === 'apply'
}

export class Registry<T, S = never, M = KeyValue<T>> {
  protected readonly registry: KeyValue<T> = {}
  protected readonly options: Registry.Options<T | S>

  constructor(options?: Registry.Options<T | S>) {
    this.options = options || {}
  }

  get names() {
    return Object.keys(this.registry)
  }

  register<K extends keyof M>(name: K, entity: M[K], force?: boolean): T
  register(name: string, entity: T | S, force?: boolean): T
  register(name: string, options: any, force: boolean = false) {
    if (this.registry[name] && !force && !isApplyingHMR()) {
      try {
        // race
        if (this.options.onError) {
          this.options.onError(name)
        }
        throw new Error(`Entity with name '${name}' already registered.`)
      } catch (err) {
        throw err
      }
    }

    const entity = this.options.process
      ? this.options.process.call(this, name, options)
      : options
    this.registry[name] = entity

    return entity
  }

  unregister<K extends keyof M>(name: K): T | null
  unregister(name: string): T | null
  unregister(name: string): T | null {
    const entity = name ? this.registry[name] : null
    delete this.registry[name]
    return entity
  }

  get<K extends keyof M>(name: K): T | null
  get(name: string): T | null
  get(name: string): T | null {
    return name ? this.registry[name] : null
  }
}

export namespace Registry {
  export interface Options<S> {
    process?: <T>(name: string, entity: S) => T
    onError?: (name: string) => void
  }
}
