import { AttributesBase } from '../../dom/attributes'

export class AttrOverride extends AttributesBase {
  attr(attr: any, value: any) {
    return super.attr(attr === 'transform' ? 'patternTransform' : attr, value)
  }
}
