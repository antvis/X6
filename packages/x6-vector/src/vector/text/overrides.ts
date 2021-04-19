import { UnitNumber } from '../../struct/unit-number'
import { AttributesBase } from '../../dom/attributes'

export class Overrides extends AttributesBase {
  attr(attr: any, value: any) {
    if (attr === 'leading') {
      if (typeof value === 'undefined') {
        return this.leading()
      }
      this.leading(value)
    }

    const ret = super.attr(attr, value)

    if (typeof value !== 'undefined') {
      if (attr === 'font-size' || attr === 'x') {
        this.rebuild()
      }
    }

    return ret
  }
}

export interface Overrides extends Overrides.Depends {}

export namespace Overrides {
  export interface Depends {
    leading(): number
    leading(value: UnitNumber.Raw): this
    rebuild(rebuilding?: boolean): this
  }
}
