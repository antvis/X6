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
): T | null {
  const ret = registry[name]
  return typeof ret === 'function' ? ret : null
}

function extendStatics(d: any, b: any) {
  const extendStaticsInner =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function(d, b) {
        d.__proto__ = b
      }) ||
    function(d, b) {
      for (const p in b) {
        if (b.hasOwnProperty(p)) {
          d[p] = (b as any)[p]
        }
      }
    }
  return extendStaticsInner(d, b)
}

export function extend(d: any, b: any) {
  extendStatics(d, b)
  // tslint:disable-next-line
  function C() {
    this.constructor = d
  }
  d.prototype =
    b === null
      ? Object.create(b)
      : ((C.prototype = b.prototype), new (C as any)())
}
