import { Node } from '../model/node'
import { ObjectExt } from '../util'

export class Base<
  Properties extends Node.Properties = Node.Properties
> extends Node<Properties> {
  get label() {
    return this.getLabel()
  }

  set label(val: string | undefined | null) {
    this.setPoints(val)
  }

  getLabel() {
    return this.getAttrByPath<string>('text/text')
  }

  setPoints(label?: string | null, options?: Node.SetOptions) {
    if (label == null) {
      this.removePoints()
    } else {
      this.setAttrByPath('text/text', label, options)
    }

    return this
  }

  removePoints() {
    this.removeAttrByPath('text/text')
    return this
  }
}

export namespace Base {
  Base.config({
    attrs: {
      text: {
        fontSize: 14,
        fill: '#000000',
        refX: 0.5,
        refY: 0.5,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontFamily: 'Arial, helvetica, sans-serif',
      },
    },
    propHooks(metadata) {
      const { label, ...others } = metadata
      if (label) {
        ObjectExt.setByPath(others, 'attrs/text/text', label)
      }
      return others
    },
  })
}
