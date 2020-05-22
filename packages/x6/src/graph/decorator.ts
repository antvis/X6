import { Graph } from './graph'

export namespace Decorator {
  export function checkScroller(err?: boolean, warning?: boolean) {
    return (
      target: Graph,
      methodName: string,
      descriptor: PropertyDescriptor,
    ) => {
      const raw = descriptor.value

      descriptor.value = function (this: Graph, ...args: any[]) {
        const scroller = this.scroller.widget
        if (scroller == null) {
          const msg = `Shoule enable scroller to use method '${methodName}'`
          if (err !== false) {
            console.error(msg)
            throw new Error(msg)
          }
          if (warning !== false) {
            console.warn(msg)
          }
          return this
        }
        return raw.call(this, ...args)
      }
    }
  }
}
