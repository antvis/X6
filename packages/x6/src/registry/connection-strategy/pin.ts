import { Point } from '../../geometry'
import { Node, Edge } from '../../model'
import { EdgeView, NodeView } from '../../view'
import { ConnectionStrategy } from './index'

function toPercentage(value: number, max: number) {
  if (max === 0) {
    return '0%'
  }

  return `${Math.round((value / max) * 100)}%`
}

function pin(relative: boolean) {
  const strategy: ConnectionStrategy.Definition = (
    terminal,
    view,
    magnet,
    coords,
  ) => {
    return view.isEdgeElement(magnet)
      ? pinEdgeTerminal(relative, terminal, view as EdgeView, magnet, coords)
      : pinNodeTerminal(relative, terminal, view as NodeView, magnet, coords)
  }

  return strategy
}

function pinNodeTerminal(
  relative: boolean,
  data: Edge.TerminalCellData,
  view: NodeView,
  magnet: Element,
  coords: Point.PointLike,
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

function pinEdgeTerminal(
  relative: boolean,
  end: Edge.TerminalCellData,
  view: EdgeView,
  magnet: Element,
  coords: Point.PointLike,
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

export const pinRelative = pin(true)
export const pinAbsolute = pin(false)
