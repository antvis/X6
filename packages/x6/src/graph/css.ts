import { Config } from '../global/config'
import { content } from '../style/raw'
import { Base } from './base'
import { Platform } from '../util'

export class CSSManager extends Base {
  protected init() {
    if (Config.autoInsertCSS) {
      CSSManager.ensure()
    }
  }
}

export namespace CSSManager {
  let styleElement: HTMLStyleElement

  export function ensure() {
    if (styleElement == null && !Platform.isApplyingHMR()) {
      styleElement = document.createElement('style')
      styleElement.setAttribute('type', 'text/css')
      styleElement.textContent = content

      const head = document.querySelector('head') as HTMLHeadElement
      if (head) {
        head.insertBefore(styleElement, head.firstChild)
      }

      window.addEventListener('unload', () => {
        if (styleElement && styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement)
        }
      })
    }
  }
}
