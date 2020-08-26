import { Node, Markup } from '@antv/x6'
import { Definition } from './registry'

export class ReactShape<
  Properties extends ReactShape.Properties = ReactShape.Properties
> extends Node<Properties> {
  get component() {
    return this.getComponent()
  }

  set component(val: ReactShape.Properties['component']) {
    this.setComponent(val)
  }

  getComponent(): ReactShape.Properties['component'] {
    return this.store.get('component')
  }

  setComponent(
    component: ReactShape.Properties['component'],
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

export namespace ReactShape {
  export interface Properties extends Node.Properties {
    component?: Definition | string
  }
}

export namespace ReactShape {
  ReactShape.config({
    view: 'react-shape-view',
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

  Node.registry.register('react-shape', ReactShape, true)
}
