import { UnitNumber } from '../../struct/unit-number'
import { AttributesBase } from '../../dom/attributes'

export class AttrOverride extends AttributesBase {
  attr(attr: any, value: any) {
    if (attr === 'leading') {
      return this.leading(value)
    }

    const ret = super.attr(attr, value)

    if (attr === 'font-size' || attr === 'x') {
      this.rebuild()
    }

    return ret
  }
}

export interface AttrOverride extends AttrOverride.Depends {}

export namespace AttrOverride {
  export interface Depends {
    leading(): number
    leading(value: UnitNumber.Raw): this
    rebuild(rebuilding?: boolean): this
  }
}
