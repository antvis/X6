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

export function getEntity<T>(
  registry: { [name: string]: T },
  name: string,
): T | null {
  const ret = registry[name]
  return typeof ret === 'function' ? ret : null
}

export function registerEntity<T>(
  registry: { [name: string]: T },
  name: string,
  entity: T,
  force: boolean,
  onError: () => void,
) {
  if (registry[name] && !force && !isApplyingHMR()) {
    onError()
  }
  registry[name] = entity
}

export class Registry<T extends Function> {
  protected readonly registry: KeyValue<T> = {}

  protected onError() {
    return this
  }

  register(name: string, entity: T, force: boolean = false) {
    if (this.registry[name] && !force && !isApplyingHMR()) {
      return this.onError()
    }
    this.registry[name] = entity
    return this
  }

  get(name: string) {
    const ret = this.registry[name]
    return typeof ret === 'function' ? ret : null
  }

  getNames() {
    return Object.keys(this.registry)
  }
}
