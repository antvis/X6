import { Cell, CellState } from '../core'
import { getOffset, getScrollOrigin } from './dom'
import { Point, DirectionMask, CellPath } from '../struct'
import { Align, VAlign } from '../types'

/**
 * Sorts the given cells according to the order in the cell hierarchy.
 * Ascending is optional and defaults to true.
 */
export function sortCells(cells: Cell[], ascending: boolean = true) {
  const lookup = new WeakMap<Cell, string[]>()

  cells.sort((o1, o2) => {
    let p1 = lookup.get(o1)
    if (p1 == null) {
      p1 = CellPath.create(o1).split(CellPath.PATH_SEPARATOR)
      lookup.set(o1, p1)
    }

    let p2 = lookup.get(o2)

    if (p2 == null) {
      p2 = CellPath.create(o2).split(CellPath.PATH_SEPARATOR)
      lookup.set(o2, p2)
    }

    const comp = CellPath.compare(p1, p2)
    return (comp === 0) ? 0 : (((comp > 0) === ascending) ? 1 : -1)
  })

  return cells
}

/**
 * Converts the specified point (x, y) using the offset of the specified
 * container and returns a new `Point` with the result.
 */
export function clientToGraph(container: HTMLElement, x: number, y: number) {
  const origin = getScrollOrigin(container, false)
  const offset = getOffset(container)

  offset.x -= origin.x
  offset.y -= origin.y

  return new Point(x - offset.x, y - offset.y)
}

/**
 *
 * Returns an `Point` that represents the horizontal and vertical alignment
 * for numeric computations.
 *
 * X is -0.5 for center, -1 for right and 0 for left alignment.
 * Y is -0.5 for middle, -1 for bottom and 0 for top alignment.
 *
 * Default values for missing arguments is top, left.
 */
export function getAlignmentAsPoint(align: Align, valign: VAlign) {
  let dx = 0
  let dy = 0

  if (align === 'center') {
    dx = -0.5
  } else if (align === 'right') {
    dx = -1
  }

  if (valign === 'middle') {
    dy = -0.5
  } else if (valign === 'bottom') {
    dy = -1
  }

  return new Point(dx, dy)
}

/**
* Returns an integer mask of the port constraints of the given map
* @param dict the style map to determine the port constraints for
* @param defaultValue Default value to return if the key is undefined.
* @return the mask of port constraint directions
*
* Parameters:
*
* terminal - <mxCelState> that represents the terminal.
* edge - <mxCellState> that represents the edge.
* source - Boolean that specifies if the terminal is the source terminal.
* defaultValue - Default value to be returned.
*/
export function getPortConstraints(
  terminal: CellState,
  edge: CellState,
  isSource: boolean,
  defaultValue: DirectionMask,
) {
  const value = (isSource
    ? edge.style.sourcePortConstraint
    : edge.style.targetPortConstraint
  ) || terminal.style.portConstraint

  if (value == null) {
    return defaultValue
  } {
    let returnValue = DirectionMask.none
    const directions = value.toString()
    const constraintRotationEnabled = terminal.style.portConstraintRotation

    let rotation = 0
    if (constraintRotationEnabled) {
      rotation = terminal.style.rotation || 0
    }

    let quad = 0
    if (rotation > 45) {
      quad = 1

      if (rotation >= 135) {
        quad = 2
      }
    } else if (rotation < -45) {
      quad = 3

      if (rotation <= -135) {
        quad = 2
      }
    }

    if (directions.indexOf('north') >= 0) {
      switch (quad) {
        case 0:
          returnValue |= DirectionMask.north
          break
        case 1:
          returnValue |= DirectionMask.east
          break
        case 2:
          returnValue |= DirectionMask.south
          break
        case 3:
          returnValue |= DirectionMask.west
          break
      }
    }

    if (directions.indexOf('west') >= 0) {
      switch (quad) {
        case 0:
          returnValue |= DirectionMask.west
          break
        case 1:
          returnValue |= DirectionMask.north
          break
        case 2:
          returnValue |= DirectionMask.east
          break
        case 3:
          returnValue |= DirectionMask.south
          break
      }
    }
    if (directions.indexOf('south') >= 0) {
      switch (quad) {
        case 0:
          returnValue |= DirectionMask.south
          break
        case 1:
          returnValue |= DirectionMask.west
          break
        case 2:
          returnValue |= DirectionMask.north
          break
        case 3:
          returnValue |= DirectionMask.east
          break
      }
    }
    if (directions.indexOf('east') >= 0) {
      switch (quad) {
        case 0:
          returnValue |= DirectionMask.east
          break
        case 1:
          returnValue |= DirectionMask.south
          break
        case 2:
          returnValue |= DirectionMask.west
          break
        case 3:
          returnValue |= DirectionMask.north
          break
      }
    }

    return returnValue
  }
}

/**
 * Reverse the port constraint bitmask. For example, north | east
 * becomes south | west
 */
export function reversePortConstraints(constraint: DirectionMask) {
  let result = 0

  result = (constraint & DirectionMask.west) << 3
  result |= (constraint & DirectionMask.north) << 1
  result |= (constraint & DirectionMask.south) >> 1
  result |= (constraint & DirectionMask.east) >> 3

  return result
}
