/* eslint-disable no-bitwise */

import { KeyValue } from '../types'
import { CellView } from './cell'

export class FlagManager {
  protected attrs: { [attr: string]: number }
  protected flags: { [name: string]: number }
  protected bootstrap: FlagManager.Actions

  protected get cell() {
    return this.view.cell
  }

  constructor(
    protected view: CellView,
    actions: KeyValue<FlagManager.Actions>,
    bootstrap: FlagManager.Actions = [],
  ) {
    const flags: { [name: string]: number } = {}
    const attrs: { [attr: string]: number } = {}

    let shift = 0
    Object.keys(actions).forEach((attr) => {
      let labels = actions[attr]
      if (!Array.isArray(labels)) {
        labels = [labels]
      }

      labels.forEach((label) => {
        let flag = flags[label]
        if (!flag) {
          shift += 1
          flag = flags[label] = 1 << shift
        }
        attrs[attr] |= flag
      })
    })

    let labels = bootstrap
    if (!Array.isArray(labels)) {
      labels = [labels]
    }

    labels.forEach((label) => {
      if (!flags[label]) {
        shift += 1
        flags[label] = 1 << shift
      }
    })

    // 26 - 30 are reserved for paper flags
    // 31+ overflows maximal number
    if (shift > 25) {
      throw new Error('Maximum number of flags exceeded.')
    }

    this.flags = flags
    this.attrs = attrs
    this.bootstrap = bootstrap
  }

  getFlag(label: FlagManager.Actions) {
    const flags = this.flags
    if (flags == null) {
      return 0
    }

    if (Array.isArray(label)) {
      return label.reduce((memo, key) => memo | flags[key], 0)
    }

    return flags[label] | 0
  }

  hasAction(flag: number, label: FlagManager.Actions) {
    return flag & this.getFlag(label)
  }

  removeAction(flag: number, label: FlagManager.Actions) {
    return flag ^ (flag & this.getFlag(label))
  }

  getBootstrapFlag() {
    return this.getFlag(this.bootstrap)
  }

  getChangedFlag() {
    let flag = 0

    if (!this.attrs) {
      return flag
    }

    Object.keys(this.attrs).forEach((attr) => {
      if (this.cell.hasChanged(attr)) {
        flag |= this.attrs[attr]
      }
    })

    return flag
  }
}

export namespace FlagManager {
  export type Action =
    | 'render'
    | 'update'
    | 'resize'
    | 'scale'
    | 'rotate'
    | 'translate'
    | 'ports'
    | 'tools'
    | 'source'
    | 'target'
    | 'vertices'
    | 'labels'
    | 'widget' // external edge tools

  export type Actions = Action | Action[]
}
