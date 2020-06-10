import { Graph, Node, Dom } from '@antv/x6'

export class ReactShape<
  Properties extends Node.Properties = Node.Properties
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
    this.store.set('component', component, options)
    return this
  }
}

export namespace ReactShape {
  export interface Properties extends Node.Properties {
    component?:
      | ((this: Graph, node: Node) => React.ReactElement | null | undefined)
      | React.ReactElement
      | null
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
        tagName: 'foreignObject',
        selector: 'fo',
        children: [
          {
            ns: Dom.ns.xhtml,
            tagName: 'body',
            selector: 'foBody',
            attrs: {
              xmlns: Dom.ns.xhtml,
            },
            children: [
              {
                tagName: 'div',
                selector: 'container',
                style: {
                  width: '100%',
                  height: '100%',
                },
              },
            ],
          },
        ],
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

  Node.registry.register('react-shape', ReactShape)
}
