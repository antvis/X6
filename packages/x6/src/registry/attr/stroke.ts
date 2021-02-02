import { ObjectExt } from '../../util'
import { DefsManager } from '../../graph/defs'
import { EdgeView } from '../../view/edge'
import { Attr } from './index'

export const stroke: Attr.Definition = {
  qualify: ObjectExt.isPlainObject,
  set(stroke: any, { view }) {
    const cell = view.cell
    const options = { ...stroke } as DefsManager.GradientOptions

    if (cell.isEdge() && options.type === 'linearGradient') {
      const edgeView = view as EdgeView
      const source = edgeView.sourcePoint
      const target = edgeView.targetPoint

      options.id = `gradient-${options.type}-${cell.id}`
      options.attrs = {
        ...options.attrs,
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
        gradientUnits: 'userSpaceOnUse',
      }

      view.graph.defs.remove(options.id)
    }

    return `url(#${view.graph.defineGradient(options)})`
  },
}
