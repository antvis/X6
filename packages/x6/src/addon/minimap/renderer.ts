import { State } from '../../core/state'
import { Renderer } from '../../core/renderer'

export class MiniMapRenderder extends Renderer {
  configShape(state: State) {
    if (state.shape != null) {
      state.shape.facade = true
    }
    super.configShape(state)
  }
}
