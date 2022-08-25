import { Platform } from '@antv/x6-common'
import { content } from './style/raw'

export namespace CSSManager {
  let styleElement: HTMLStyleElement | null
  let counter = 0

  export function ensure() {
    counter += 1
    if (counter > 1) return

    if (!Platform.isApplyingHMR()) {
      styleElement = document.createElement('style')
      styleElement.setAttribute('type', 'text/css')
      styleElement.textContent = content

      const head = document.querySelector('head') as HTMLHeadElement
      if (head) {
        head.insertBefore(styleElement, head.firstChild)
      }
    }
  }

  export function clean() {
    counter -= 1
    if (counter > 0) return

    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement)
    }
    styleElement = null
  }
}
