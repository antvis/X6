import { Attributes } from './attributes'

export abstract class AttributesBase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attr(k?: any, v?: any) {
    return Attributes.prototype.attr.call(this, k, v)
  }
}
