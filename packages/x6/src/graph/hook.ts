import { FunctionExt } from '../util'
import { CellView, EdgeView } from '../view'
import { Edge } from '../model'
import { Graph } from './graph'
import { Base } from './base'
import { Renderer } from './renderer'

namespace Decorator {
  export function hook(ignoreNullResult?: boolean, hookName?: string | null) {
    return (
      target: Hook,
      methodName: string,
      descriptor: PropertyDescriptor,
    ) => {
      const raw = descriptor.value
      const name = hookName || methodName

      descriptor.value = function (this: Hook, ...args: any[]) {
        const hook = (this.options as any)[name]
        if (hook != null) {
          this.getNativeValue = raw.bind(this, ...args)
          const ret = FunctionExt.call(hook, this.graph, ...args)
          delete this.getNativeValue
          if (ret != null || ignoreNullResult === true) {
            return ret
          }
        }

        return raw.call(this, ...args)
      }
    }
  }

  export function after(hookName?: string | null) {
    return (
      target: Hook,
      methodName: string,
      descriptor: PropertyDescriptor,
    ) => {
      const raw = descriptor.value
      const name = hookName || methodName

      descriptor.value = function (this: Hook, ...args: any[]) {
        let ret = raw.call(this, ...args)
        const hook = (this.options as any)[name]
        if (hook != null) {
          ret = FunctionExt.call(hook, this.graph, ...args) && ret
        }
        return ret
      }
    }
  }
}

export class Hook extends Base implements Hook.IHook {
  /**
   * Get the native value of hooked method.
   */
  public getNativeValue: <T>() => T | null

  validateEdge(edge: Edge) {
    const options = this.options.connecting

    if (!options.multi) {
      const source = edge.getSource() as Edge.TerminalCellData
      const target = edge.getTarget() as Edge.TerminalCellData

      if (source.cell && target.cell) {
        const sourceCell = edge.getSourceCell()
        if (sourceCell) {
          const connectedEdges = this.model.getConnectedEdges(sourceCell, {
            outgoing: true,
          })

          const sameEdges = connectedEdges.filter((link) => {
            const s = link.getSource() as Edge.TerminalCellData
            const t = link.getTarget() as Edge.TerminalCellData
            return (
              s &&
              s.cell === source.cell &&
              (!s.port || s.port === source.port) &&
              t &&
              t.cell === target.cell &&
              (!t.port || t.port === target.port)
            )
          })

          if (sameEdges.length > 1) {
            return false
          }
        }
      }
    }

    if (!options.dangling) {
      const sourceId = edge.getSourceCellId()
      const targetId = edge.getTargetCellId()
      if (!(sourceId && targetId)) {
        return false
      }
    }

    const validate = this.options.connecting.validateEdge
    if (validate) {
      return validate.call(this.graph, edge)
    }

    return true
  }

  validateMagnet(
    cellView: CellView,
    magnet: Element,
    e: JQuery.MouseDownEvent,
  ) {
    if (magnet.getAttribute('magnet') !== 'passive') {
      const validate = this.options.connecting.validateMagnet
      if (validate) {
        return validate.call(this.graph, cellView, magnet, e)
      }
      return true
    }
    return false
  }

  getDefaultEdge(cellView: CellView, magnet: Element) {
    const create = this.options.connecting.createEdge
    let edge: Edge | undefined
    if (create) {
      edge = create.call(this.graph, cellView, magnet)
    }
    if (edge == null) {
      edge = new Edge()
    }
    return edge!
  }

  validateConnection(
    sourceView: CellView | null | undefined,
    sourceMagnet: Element | null | undefined,
    targetView: CellView | null | undefined,
    targetMagnet: Element | null | undefined,
    terminalType: Edge.TerminalType,
    edgeView?: EdgeView,
  ) {
    const validate = this.options.connecting.validateConnection
    return validate
      ? validate.call(
          this.graph,
          sourceView,
          sourceMagnet,
          targetView,
          targetMagnet,
          terminalType,
          edgeView,
        )
      : true
  }

  @Decorator.after()
  onViewUpdated(view: CellView, flag: number, options: any) {
    if (flag & Renderer.FLAG_INSERT || options.mounting) {
      return
    }
    this.graph.renderer.requestConnectedEdgesUpdate(view, options)
  }

  @Decorator.after()
  onViewPostponed(view: CellView, flag: number) {
    return this.graph.renderer.forcePostponedViewUpdate(view, flag)
  }
}

export namespace Hook {
  export interface IHook {
    onViewUpdated: (
      this: Graph,
      view: CellView,
      flag: number,
      options: any,
    ) => void

    onViewPostponed: (
      this: Graph,
      view: CellView,
      flag: number,
      graph: Graph,
    ) => boolean
  }
}
