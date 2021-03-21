const ua = navigator.userAgent

export namespace Platform {
  export const IS_MAC = navigator.appVersion.indexOf('Mac') > 0
  export const IS_IOS = !!ua.match(/(iPad|iPhone|iPod)/g)
  export const IS_WINDOWS = navigator.appVersion.indexOf('Win') > 0

  export const IS_IE = ua.indexOf('MSIE') >= 0
  export const IS_IE11 = !!ua.match(/Trident\/7\./)
  export const IS_EDGE = !!ua.match(/Edge\//)

  /**
   * A flag indicating whether the browser is Netscape (including Firefox).
   */
  export const IS_NETSCAPE =
    ua.indexOf('Mozilla/') >= 0 &&
    ua.indexOf('MSIE') < 0 &&
    ua.indexOf('Edge/') < 0

  /**
   * A flag indicating whether the the this is running inside a Chrome App.
   */
  export const IS_CHROME_APP =
    (window as any).chrome != null &&
    (window as any).chrome.app != null &&
    (window as any).chrome.app.runtime != null

  export const IS_CHROME = ua.indexOf('Chrome/') >= 0 && ua.indexOf('Edge/') < 0
  export const IS_OPERA = ua.indexOf('Opera/') >= 0 || ua.indexOf('OPR/') >= 0
  export const IS_FIREFOX = ua.indexOf('Firefox/') >= 0
  export const IS_SAFARI =
    ua.indexOf('AppleWebKit/') >= 0 &&
    ua.indexOf('Chrome/') < 0 &&
    ua.indexOf('Edge/') < 0

  /**
   * A flag indicating whether this device supports touchstart/-move/-end
   * events (Apple iOS, Android, Chromebook and Chrome Browser on touch-enabled
   * devices).
   */
  export const SUPPORT_TOUCH = 'ontouchstart' in document.documentElement

  /**
   * A flag indicating whether this device supports Microsoft pointer events.
   */
  export const SUPPORT_POINTER = (window as any).PointerEvent != null && !IS_MAC

  export let SUPPORT_PASSIVE = false // eslint-disable-line import/no-mutable-exports

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        SUPPORT_PASSIVE = true
      },
    })
    const div = document.createElement('div')
    if (div.addEventListener) {
      div.addEventListener('click', () => {}, options)
    }
  } catch (err) {
    // pass
  }

  /**
   * A flag indicating whether foreignObject support is not available. This
   * is the case for Opera, older SVG-based browsers and all versions of IE.
   */
  export const NO_FOREIGNOBJECT =
    !document.createElementNS ||
    `${document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    )}` !== '[object SVGForeignObjectElement]' ||
    ua.indexOf('Opera/') >= 0

  export const SUPPORT_FOREIGNOBJECT = !NO_FOREIGNOBJECT
}

export namespace Platform {
  export function getHMRStatus() {
    const mod = window.module as any
    if (mod != null && mod.hot != null && mod.hot.status != null) {
      return mod.hot.status()
    }
    return 'unkonwn'
  }

  export function isApplyingHMR() {
    return getHMRStatus() === 'apply'
  }

  // This function checks if the specified event is supported by the browser.
  // Source: http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
  const TAGNAMES: { [event: string]: string } = {
    select: 'input',
    change: 'input',
    submit: 'form',
    reset: 'form',
    error: 'img',
    load: 'img',
    abort: 'img',
  }

  export function isEventSupported(event: string) {
    const elem = document.createElement(TAGNAMES[event] || 'div')
    const eventName = `on${event}`
    let isSupported = eventName in elem
    if (!isSupported) {
      elem.setAttribute(eventName, 'return;')
      isSupported = typeof (elem as any)[eventName] === 'function'
    }
    return isSupported
  }
}
