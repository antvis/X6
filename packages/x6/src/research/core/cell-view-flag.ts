import { CellView } from './cell-view'
import { KeyValue } from '../../types'

export class CellViewFlag {
  protected flags: { [name: string]: number }
  protected attrs: { [attr: string]: number }
  protected bootstrap: CellViewFlag.Actions

  protected get cell() {
    return this.view.cell
  }

  constructor(
    protected view: CellView,
    actions: KeyValue<CellViewFlag.Actions>,
    bootstrap: CellViewFlag.Actions = [],
  ) {
    const flags: { [name: string]: number } = {}
    const attrs: { [attr: string]: number } = {}

    let shift = 0
    Object.keys(actions).forEach(attr => {
      let labels = actions[attr]
      if (!Array.isArray(labels)) {
        labels = [labels]
      }

      labels.forEach(label => {
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

    labels.forEach(label => {
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

  getFlag(label: CellViewFlag.Actions) {
    const flags = this.flags
    if (flags == null) {
      return 0
    }

    if (Array.isArray(label)) {
      return label.reduce((memo, key) => memo | flags[key], 0)
    }

    return flags[label] | 0
  }

  hasFlag(flag: number, label: CellViewFlag.Actions) {
    return flag & this.getFlag(label)
  }

  removeFlag(flag: number, label: CellViewFlag.Actions) {
    return flag ^ (flag & this.getFlag(label))
  }

  getBootstrapFlag() {
    return this.getFlag(this.bootstrap)
  }

  getChangeFlag() {
    let flag = 0

    if (!this.attrs) {
      return flag
    }

    Object.keys(this.attrs).forEach(attr => {
      if (this.cell.store.hasChanged(attr)) {
        flag |= this.attrs[attr]
      }
    })

    return flag
  }
}

export namespace CellViewFlag {
  export type Action =
    | 'render'
    | 'update'
    | 'resize'
    | 'rotate'
    | 'translate'
    | 'ports'
    | 'tools'

  export type Actions = Action | Action[]
}
