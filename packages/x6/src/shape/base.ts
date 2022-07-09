import { Node } from '../model/node'
import { ObjectExt } from '../util'

export class Base<
  Properties extends Node.Properties = Node.Properties,
> extends Node<Properties> {
  get label() {
    return this.getLabel()
  }

  set label(val: string | undefined | null) {
    this.setLabel(val)
  }

  getLabel() {
    return this.getAttrByPath<string>('text/text')
  }

  setLabel(label?: string | null, options?: Node.SetOptions) {
    if (label == null) {
      this.removeLabel()
    } else {
      this.setAttrByPath('text/text', label, options)
    }

    return this
  }

  removeLabel() {
    this.removeAttrByPath('text/text')
    return this
  }
}

export namespace Base {
  export const bodyAttr = {
    fill: '#ffffff',
    stroke: '#333333',
    strokeWidth: 2,
  }

  export const labelAttr = {
    fontSize: 14,
    fill: '#000000',
    refX: 0.5,
    refY: 0.5,
    textAnchor: 'middle',
    textVerticalAnchor: 'middle',
    fontFamily: 'Arial, helvetica, sans-serif',
  }

  Base.config({
    attrs: { text: { ...labelAttr } },
    propHooks(metadata) {
      const { label, ...others } = metadata
      if (label) {
        ObjectExt.setByPath(others, 'attrs/text/text', label)
      }
      return others
    },
    visible: true,
  })
}
