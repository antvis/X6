const ua = navigator.userAgent

export namespace detector {
  /**
   * A flag indicating whether the platform is Windiws.
   */
  export const IS_WINDOWS = navigator.appVersion.indexOf('Win') > 0

  /**
   * A flag indicating whether the platform is Mac.
   */
  export const IS_MAC = navigator.appVersion.indexOf('Mac') > 0

  /**
   * A flag indicating whether the platform is iPad, iPhone or iPod.
   */
  export const IS_IOS = ua.match(/(iPad|iPhone|iPod)/g) ? true : false

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
   * A flag indicating whether the the current browser is Opera.
   */
  export const IS_OPERA = ua.indexOf('Opera/') >= 0 || ua.indexOf('OPR/') >= 0

  /**
   * A flag indicating whether the the current browser is Safari.
   */
  export const IS_SAFARI =
    ua.indexOf('AppleWebKit/') >= 0 &&
    ua.indexOf('Chrome/') < 0 &&
    ua.indexOf('Edge/') < 0

  /**
   * A flag indicating whether the the current browser is Google Chrome.
   */
  export const IS_CHROME = ua.indexOf('Chrome/') >= 0 && ua.indexOf('Edge/') < 0

  /**
   * A flag indicating whether the the this is running inside a Chrome App.
   */
  export const IS_CHROME_APP =
    (window as any).chrome != null &&
    (window as any).chrome.app != null &&
    (window as any).chrome.app.runtime != null

  /**
   * A flag indicating whether the the current browser is Firefox.
   */
  export const IS_FIREFOX = ua.indexOf('Firefox/') >= 0

  /**
   * A flag indicating whether `-moz-transform` is available as a CSS style.
   * This is the case for all Firefox-based browsers newer than or equal 3,
   * such as Camino, Iceweasel, Seamonkey and Iceape.
   */
  export const IS_MT =
    (ua.indexOf('Firefox/') >= 0 &&
      ua.indexOf('Firefox/1.') < 0 &&
      ua.indexOf('Firefox/2.') < 0) ||
    (ua.indexOf('Iceweasel/') >= 0 &&
      ua.indexOf('Iceweasel/1.') < 0 &&
      ua.indexOf('Iceweasel/2.') < 0) ||
    (ua.indexOf('SeaMonkey/') >= 0 && ua.indexOf('SeaMonkey/1.') < 0) ||
    (ua.indexOf('Iceape/') >= 0 && ua.indexOf('Iceape/1.') < 0)

  /**
   * A flag indicating whether `-o-transform` is available as a CSS style,
   * ie for Opera browsers based on a Presto engine with version 2.5 or later.
   */
  export const IS_OT =
    ua.indexOf('Presto/') >= 0 &&
    ua.indexOf('Presto/2.4.') < 0 &&
    ua.indexOf('Presto/2.3.') < 0 &&
    ua.indexOf('Presto/2.2.') < 0 &&
    ua.indexOf('Presto/2.1.') < 0 &&
    ua.indexOf('Presto/2.0.') < 0 &&
    ua.indexOf('Presto/1.') < 0

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

  export let SUPPORT_PASSIVE = false

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        SUPPORT_PASSIVE = true
      },
    })
    const div = document.createElement('div')
    div.addEventListener('click', () => {}, options)
  } catch (err) {}

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
}
