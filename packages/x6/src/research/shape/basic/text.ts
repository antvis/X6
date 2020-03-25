import { NodeView } from '../../core/node-view'
import { NodeRegistry, ViewRegistry } from '../../registry'
import { getMarkup, getName, rootAttr } from './util'

const registryName = getName('text')

export const Text = NodeRegistry.register(registryName, {
  view: registryName,
  markup: getMarkup('text', true),
  attrs: {
    ...rootAttr,
    text: {
      fontSize: 18,
      fill: '#000000',
    },
  },
})

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

ViewRegistry.register(registryName, TextView)
