/* eslint-disable no-underscore-dangle */
let _IS_MAC = false
let _IS_IOS = false
let _IS_WINDOWS = false
let _IS_IE = false
let _IS_IE11 = false
let _IS_EDGE = false
let _IS_NETSCAPE = false
let _IS_CHROME_APP = false
let _IS_CHROME = false
let _IS_OPERA = false
let _IS_FIREFOX = false
let _IS_SAFARI = false
let _SUPPORT_TOUCH = false
let _SUPPORT_POINTER = false
let _SUPPORT_PASSIVE = false
let _NO_FOREIGNOBJECT = false

if (typeof navigator === 'object') {
  const ua = navigator.userAgent
  _IS_MAC = ua.indexOf('Macintosh') >= 0
  _IS_IOS = !!ua.match(/(iPad|iPhone|iPod)/g)
  _IS_WINDOWS = ua.indexOf('Windows') >= 0

  _IS_IE = ua.indexOf('MSIE') >= 0
  _IS_IE11 = !!ua.match(/Trident\/7\./)
  _IS_EDGE = !!ua.match(/Edge\//)

  _IS_NETSCAPE =
    ua.indexOf('Mozilla/') >= 0 &&
    ua.indexOf('MSIE') < 0 &&
    ua.indexOf('Edge/') < 0

  _IS_CHROME = ua.indexOf('Chrome/') >= 0 && ua.indexOf('Edge/') < 0
  _IS_OPERA = ua.indexOf('Opera/') >= 0 || ua.indexOf('OPR/') >= 0
  _IS_FIREFOX = ua.indexOf('Firefox/') >= 0
  _IS_SAFARI =
    ua.indexOf('AppleWebKit/') >= 0 &&
    ua.indexOf('Chrome/') < 0 &&
    ua.indexOf('Edge/') < 0

  if (typeof document === 'object') {
    _NO_FOREIGNOBJECT =
      !document.createElementNS ||
      `${document.createElementNS(
        'http://www.w3.org/2000/svg',
        'foreignObject',
      )}` !== '[object SVGForeignObjectElement]' ||
      ua.indexOf('Opera/') >= 0
  }
}

if (typeof window === 'object') {
  _IS_CHROME_APP =
    (window as any).chrome != null &&
    (window as any).chrome.app != null &&
    (window as any).chrome.app.runtime != null
  _SUPPORT_POINTER = (window as any).PointerEvent != null && !_IS_MAC
}

if (typeof document === 'object') {
  _SUPPORT_TOUCH = 'ontouchstart' in document.documentElement

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        _SUPPORT_PASSIVE = true
      },
    })
    const div = document.createElement('div')
    if (div.addEventListener) {
      div.addEventListener('click', () => {}, options)
    }
  } catch (err) {
    // pass
  }
}
export namespace Platform {
  export const IS_MAC = _IS_MAC
  export const IS_IOS = _IS_IOS
  export const IS_WINDOWS = _IS_WINDOWS

  export const IS_IE = _IS_IE
  export const IS_IE11 = _IS_IE11
  export const IS_EDGE = _IS_EDGE

  /**
   * A flag indicating whether the browser is Netscape (including Firefox).
   */
  export const IS_NETSCAPE = _IS_NETSCAPE

  /**
   * A flag indicating whether the the this is running inside a Chrome App.
   */
  export const IS_CHROME_APP = _IS_CHROME_APP

  export const IS_CHROME = _IS_CHROME
  export const IS_OPERA = _IS_OPERA
  export const IS_FIREFOX = _IS_FIREFOX
  export const IS_SAFARI = _IS_SAFARI

  /**
   * A flag indicating whether this device supports touchstart/-move/-end
   * events (Apple iOS, Android, Chromebook and Chrome Browser on touch-enabled
   * devices).
   */
  export const SUPPORT_TOUCH = _SUPPORT_TOUCH

  /**
   * A flag indicating whether this device supports Microsoft pointer events.
   */
  export const SUPPORT_POINTER = _SUPPORT_POINTER

  export const SUPPORT_PASSIVE = _SUPPORT_PASSIVE

  /**
   * A flag indicating whether foreignObject support is not available. This
   * is the case for Opera, older SVG-based browsers and all versions of IE.
   */
  export const NO_FOREIGNOBJECT = _NO_FOREIGNOBJECT

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
