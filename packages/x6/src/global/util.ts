import { KeyValue } from '../types'
import { snapToGrid as snap } from '../geometry/util'
import { normalize } from '../registry/marker/util'
import { Cell } from '../model/cell'
import { Node } from '../model/node'
import { Edge } from '../model/edge'
import { Config } from './config'

export namespace Util {
  export const snapToGrid = snap
  export const normalizeMarker = normalize

  export function prefix(suffix: string) {
    return `${Config.prefixCls}-${suffix}`
  }
}

export namespace Util {
  export interface TreeItem extends KeyValue {
    name: string
  }

  export interface MakeTreeOptions {
    children?: string | ((parent: TreeItem) => TreeItem[])
    createNode: (metadata: TreeItem) => Node
    createEdge: (parent: Node, child: Node) => Edge
  }

  export function makeTree(
    parent: TreeItem,
    options: MakeTreeOptions,
    parentNode: Node,
    collector: Cell[] = [],
  ) {
    const children =
      typeof options.children === 'function'
        ? options.children(parent)
        : parent[options.children || 'children']

    if (!parentNode) {
      parentNode = options.createNode(parent) // eslint-disable-line
      collector.push(parentNode)
    }

    if (Array.isArray(children)) {
      children.forEach((child: TreeItem) => {
        const node = options.createNode(child)
        const edge = options.createEdge(parentNode, node)
        collector.push(node, edge)
        this.makeTree(child, options, node, collector)
      })
    }

    return collector
  }
}
