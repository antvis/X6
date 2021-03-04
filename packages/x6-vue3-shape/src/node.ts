import { Node, Markup, ObjectExt } from '@antv/x6'
import { Definition } from './registry'

export class Vue3Shape<
  Properties extends Vue3Shape.Properties = Vue3Shape.Properties
> extends Node {
  get component() {
    return this.getComponent()
  }

  getComponent(): Vue3Shape.Properties['component'] {
    return this.store.get('component')
  }

  setComponent(
    component: Vue3Shape.Properties['component'],
    options: Node.SetOptions,
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

  // static getMarkup: (
  //   useForeignObject: boolean,
  //   primer?: Vue3Shape.Primer,
  // ) => Markup.JSONMarkup[]
}

export namespace Vue3Shape {
  export type Primer =
    | 'rect'
    | 'circle'
    | 'path'
    | 'ellipse'
    | 'polygon'
    | 'polyline'
  export interface Properties extends Node.Properties {
    primer?: Primer
    useForeignObject?: boolean
    component?: Definition | string
  }
}

function getMarkup(
  useForeignObject: boolean,
  primer: Vue3Shape.Primer = 'rect',
) {
  const markup: Markup.JSONMarkup[] = [
    {
      tagName: primer,
      selector: 'body',
    },
  ]

  if (useForeignObject) {
    markup.push(Markup.getForeignObjectMarkup())
  } else {
    markup.push({
      tagName: 'g',
      selector: 'content',
    })
  }

  markup.push({
    tagName: 'text',
    selector: 'label',
  })

  return markup
}

export namespace Vue3Shape {
  Vue3Shape.config<Properties>({
    view: 'vue3-shape-view',
    markup: getMarkup(true),
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
  Node.registry.register('vue3-shape', Vue3Shape, true)
}
