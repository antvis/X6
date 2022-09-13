import { CssLoader } from '@antv/x6-common'
import { Config } from '../config'
import { content } from '../style/raw'
import { Base } from './base'

export class CSSManager extends Base {
  protected init() {
    if (Config.autoInsertCSS) {
      CssLoader.ensure('core', content)
    }
  }

  @CSSManager.dispose()
  dispose() {
    CssLoader.clean('core')
  }
}
