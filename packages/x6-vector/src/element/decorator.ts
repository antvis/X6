import type { VectorElement } from './element'

export namespace Decorator {
  export function checkDefs<TSVGElement extends SVGElement>(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) {
    const raw = descriptor.value
    descriptor.value = function (
      this: VectorElement<TSVGElement>,
      ...args: any[]
    ) {
      const defs = this.defs()
      if (defs == null) {
        throw new Error(
          'Can not get or create SVGDefsElement in the current document tree. ' +
            'Please ensure that the current element is attached into any SVG context.',
        )
      }
      return raw.call(this, ...args)
    }
  }
}
