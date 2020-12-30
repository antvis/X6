export default function addEventListener<K extends keyof DocumentEventMap>(
  target: HTMLDivElement | EventTarget | HTMLDocument | HTMLElement,
  eventType: K,
  callback: EventListener,
  option?: boolean | AddEventListenerOptions,
) {
  let useCapture = false
  // babel会处理ie下 target.attachEvent
  if (target.addEventListener) {
    if (typeof option === 'boolean') {
      useCapture = option
    } else if (typeof option === 'object') {
      useCapture = option.capture || false
    }
    target.addEventListener(eventType, callback, option)
  }
  return {
    remove: () => {
      target.removeEventListener(eventType, callback, useCapture)
    },
  }
}
