import { Registry } from './util'
import { NodeView } from '../core/node-view'
import { EdgeView } from '../core/edge-view'
import { CellView } from '../core'

// tslint:disable-next-line
export const ViewRegistry = new Registry<ViewRegistry.ViewClass>({
  onError(name) {
    throw new Error(`View with name "${name}" already registered.`)
  },
})

export namespace ViewRegistry {
  export type ViewClass = new (...args: any[]) => CellView
}

ViewRegistry.register('node', NodeView, true)
ViewRegistry.register('edge', EdgeView, true)
