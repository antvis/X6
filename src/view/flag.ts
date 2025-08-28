/* eslint-disable no-bitwise */
import type { KeyValue } from '../common'
import type { CellView } from './cell'

export type FlagManagerAction =
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

export type FlagManagerActions = FlagManagerAction | FlagManagerAction[]

export class FlagManager {
  protected attrs: { [attr: string]: number }
  protected flags: { [name: string]: number }
  protected bootstrap: FlagManagerActions

  protected get cell() {
    return this.view.cell
  }

  constructor(
    protected view: CellView,
    actions: KeyValue<FlagManagerActions>,
    bootstrap: FlagManagerActions = [],
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

  getFlag(label: FlagManagerActions) {
    const flags = this.flags
    if (flags == null) {
      return 0
    }

    if (Array.isArray(label)) {
      return label.reduce((memo, key) => memo | flags[key], 0)
    }

    return flags[label] | 0
  }

  hasAction(flag: number, label: FlagManagerActions) {
    return flag & this.getFlag(label)
  }

  removeAction(flag: number, label: FlagManagerActions) {
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
