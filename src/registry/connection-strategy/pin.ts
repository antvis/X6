import { Point, type PointLike } from '../../geometry'
import type { Edge, Node, TerminalCellData } from '../../model'
import type { EdgeView, NodeView } from '../../view'
import type { ConnectionStrategyDefinition } from './index'

export function toPercentage(value: number, max: number) {
  if (max === 0) {
    return '0%'
  }

  return `${Math.round((value / max) * 100)}%`
}

export function pin(relative: boolean) {
  const strategy = (terminal, view, magnet, coords) => {
    return view.isEdgeElement(magnet)
      ? pinEdgeTerminal(relative, terminal, view as EdgeView, magnet, coords)
      : pinNodeTerminal(relative, terminal, view as NodeView, magnet, coords)
  }

  return strategy
}

export function pinNodeTerminal(
  relative: boolean,
  data: TerminalCellData,
  view: NodeView,
  magnet: Element,
  coords: PointLike,
) {
  const node = view.cell as Node
  const angle = node.getAngle()
  const bbox = view.getUnrotatedBBoxOfElement(magnet as SVGElement)
  const center = node.getBBox().getCenter()
  const pos = Point.create(coords).rotate(angle, center)

  let dx: number | string = pos.x - bbox.x
  let dy: number | string = pos.y - bbox.y

  if (relative) {
    dx = toPercentage(dx, bbox.width)
    dy = toPercentage(dy, bbox.height)
  }

  data.anchor = {
    name: 'topLeft',
    args: {
      dx,
      dy,
      rotate: true,
    },
  }

  return data
}

export function pinEdgeTerminal(
  relative: boolean,
  end: TerminalCellData,
  view: EdgeView,
  magnet: Element,
  coords: PointLike,
) {
  const connection = view.getConnection()
  if (!connection) {
    return end
  }

  const length = connection.closestPointLength(coords)
  if (relative) {
    const totalLength = connection.length()
    end.anchor = {
      name: 'ratio',
      args: {
        ratio: length / totalLength,
      },
    }
  } else {
    end.anchor = {
      name: 'length',
      args: {
        length,
      },
    }
  }

  return end
}

export const pinRelative: ConnectionStrategyDefinition = pin(true)
export const pinAbsolute: ConnectionStrategyDefinition = pin(false)
