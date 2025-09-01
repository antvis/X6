import { CssLoader, disposable } from '../common'
import { Config } from '../config'
import { content } from '../style/raw'
import { Base } from './base'

export class CSSManager extends Base {
  protected init() {
    if (Config.autoInsertCSS) {
      CssLoader.ensure('core', content)
    }
  }

  @disposable()
  dispose() {
    CssLoader.clean('core')
  }
}
