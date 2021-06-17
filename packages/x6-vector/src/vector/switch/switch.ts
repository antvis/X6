import { Container } from '../container/container'
import { SVGSwitchAttributes } from './types'

@Switch.register('Switch')
export class Switch extends Container<SVGSwitchElement> {}

export namespace Switch {
  export function create<Attributes extends SVGSwitchAttributes>(
    attrs?: Attributes | null,
  ) {
    const elem = new Switch()
    if (attrs) {
      elem.attr(attrs)
    }
    return elem
  }
}
