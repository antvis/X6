export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const canUseWorkers = typeof Worker !== 'undefined'
export const canUseEventListeners =
  canUseDOM && !!(window.addEventListener || (window as any).attachEvent)
export const canUseViewport = canUseDOM && !!window.screen
export const isInWorker = !canUseDOM

export const isBrowser = typeof window !== 'undefined' && window
export const safeWindow = <T>(fn: (win: Window) => T): T | undefined => {
  if (isBrowser) return fn(window)
  return undefined
}
export const safeDocument = <T>(fn: (doc: Document) => T): T | undefined => {
  if (isBrowser) return fn(document)
  return undefined
}
