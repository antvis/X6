import { getVendorPrefix } from './getVendorPrefix'
import { hasCSSTransforms, hasCSS3DTransforms } from './browserSupport'

const transform = getVendorPrefix('transform')
const backfaceVisibility = getVendorPrefix('backfaceVisibility')

export const translate = (() => {
  if (hasCSSTransforms()) {
    const ua = window ? window.navigator.userAgent : ''
    const isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua)

    // It appears that Safari messes up the composition order
    // of GPU-accelerated layers
    // (see bug https://bugs.webkit.org/show_bug.cgi?id=61824).
    // Use 2D translation instead.
    if (!isSafari && hasCSS3DTransforms()) {
      return (style: CSSStyleDeclaration, x: number, y: number) => {
        style[transform as any] = `translate3d(${x}px,${y}px,0)`
        style[backfaceVisibility as any] = 'hidden'
      }
    }

    return (style: CSSStyleDeclaration, x: number, y: number) => {
      style[transform as any] = `translate(${x}px,${y}px)`
    }
  }

  return (style: CSSStyleDeclaration, x: number, y: number) => {
    style.left = `${x}px`
    style.top = `${y}px`
  }
})()
