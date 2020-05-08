import { Registry } from './registry'
import { CellView } from '../core'
import { NodeView } from '../core/node-view'
import { EdgeView } from '../core/edge-view'

export const ViewRegistry = Registry.create<ViewRegistry.ViewClass>({
  type: 'view',
})

export namespace ViewRegistry {
  export type ViewClass = new (...args: any[]) => CellView
}

ViewRegistry.register('node', NodeView, true)
ViewRegistry.register('edge', EdgeView, true)
