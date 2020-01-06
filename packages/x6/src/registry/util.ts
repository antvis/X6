import { StringExt } from '../util'

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

export function getEntityFromRegistry<T>(
  registry: { [name: string]: T },
  name: string,
  allowEval: boolean = false,
): T | null {
  let ret = registry[name]
  if (ret == null && allowEval) {
    ret = StringExt.eval(name) as T
  }
  return typeof ret === 'function' ? ret : null
}
