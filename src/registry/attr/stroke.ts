import { ObjectExt } from '../../common'
import type { EdgeView } from '../../view/edge'
import type { AttrDefinition } from './index'

export const stroke: AttrDefinition = {
  qualify: ObjectExt.isPlainObject,
  set(stroke: any, { view }) {
    const cell = view.cell
    const options = { ...stroke }

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
