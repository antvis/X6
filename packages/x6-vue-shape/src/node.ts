import { Node, Markup } from '@antv/x6'
import { Definition } from './registry'

export class VueShape<
  Properties extends VueShape.Properties = VueShape.Properties
> extends Node<Properties> {
  get component() {
    return this.getComponent()
  }

  set component(val: VueShape.Properties['component']) {
    this.setComponent(val)
  }

  getComponent(): VueShape.Properties['component'] {
    return this.store.get('component')
  }

  setComponent(
    component: VueShape.Properties['component'],
    options: Node.SetOptions = {},
  ) {
    if (component == null) {
      this.removeComponent(options)
    } else {
      this.store.set('component', component, options)
    }
    return this
  }

  removeComponent(options: Node.SetOptions = {}) {
    this.store.remove('component', options)
    return this
  }
}

export namespace VueShape {
  export interface Properties extends Node.Properties {
    component?: Definition | string
  }
}

export namespace VueShape {
  VueShape.config({
    view: 'vue-shape-view',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        ...Markup.getForeignObjectMarkup(),
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      body: {
        fill: 'none',
        stroke: 'none',
        refWidth: '100%',
        refHeight: '100%',
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
      },
      label: {
        fontSize: 14,
        fill: '#333',
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
  })

  Node.registry.register('vue-shape', VueShape, true)
}
