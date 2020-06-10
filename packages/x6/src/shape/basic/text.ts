import { NodeView } from '../../view'
import { getName, createShape } from './util'

const viewName = getName('text')

export class TextView extends NodeView {
  confirmUpdate(flag: number, options: any = {}) {
    let ret = super.confirmUpdate(flag, options)
    if (this.hasAction(ret, 'scale')) {
      this.resize()
      ret = this.removeAction(ret, 'scale')
    }
    return ret
  }
}

TextView.config({
  actions: {
    attrs: ['scale'],
  },
})

NodeView.registry.register(viewName, TextView)

export const Text = createShape(
  'text',
  {
    view: viewName,
    attrs: {
      text: {
        fontSize: 18,
        fill: '#000000',
        stroke: null,
        refX: 0.5,
        refY: 0.5,
      },
    },
  },
  { noText: true },
)
