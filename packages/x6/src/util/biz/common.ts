import { State } from '../../core'
import { Shape } from '../../shape'
import { getOffset, getScrollOrigin } from '../dom'
import { MouseEventEx, DomEvent } from '../../common'
import { Point, DirectionMask } from '../../struct'
import { Align, VAlign } from '../../types'

export function clientToGraph(container: HTMLElement, e: TouchEvent): Point
export function clientToGraph(container: HTMLElement, e: MouseEvent): Point
export function clientToGraph(container: HTMLElement, e: MouseEventEx): Point
export function clientToGraph(
  container: HTMLElement,
  x: number,
  y: number,
): Point
export function clientToGraph(
  container: HTMLElement,
  x: number | MouseEvent | TouchEvent | MouseEventEx,
  y?: number,
) {
  const origin = getScrollOrigin(container, false)
  const offset = getOffset(container)

  offset.x -= origin.x
  offset.y -= origin.y

  let clientX
  let clisntY

  if (x instanceof MouseEventEx) {
    clientX = x.getClientX()
    clisntY = x.getClientY()
  } else if (x instanceof Event) {
    clientX = DomEvent.getClientX(x)
    clisntY = DomEvent.getClientY(x)
  } else {
    clientX = x
    clisntY = y!
  }

  return new Point(clientX - offset.x, clisntY - offset.y)
}

/**
 * Returns an `Point` that represents the horizontal and vertical
 * alignment for numeric computations.
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
 * Returns an integer mask of the port constraints.
 *
 * @param terminal `State` that represents the terminal.
 * @param edge `State` that represents the edge.
 * @param isSource Specifies if the terminal is the source terminal.
 * @param defaultValue Default value to be returned.
 */
export function getPortConstraints(
  terminal: State,
  edge: State,
  isSource: boolean,
  defaultValue: DirectionMask,
) {
  const value =
    (isSource
      ? edge.style.sourcePortConstraint
      : edge.style.targetPortConstraint) || terminal.style.portConstraint

  if (value == null) {
    return defaultValue
  }
  {
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
 * Reverse the port constraint bitmask.
 *
 * For example, north | east becomes south | west
 */
export function reversePortConstraints(constraint: DirectionMask) {
  let result = 0

  result = (constraint & DirectionMask.west) << 3
  result |= (constraint & DirectionMask.north) << 1
  result |= (constraint & DirectionMask.south) >> 1
  result |= (constraint & DirectionMask.east) >> 3

  return result
}

export function hasHtmlLabel(state: State | null) {
  return (
    state != null &&
    state.text != null &&
    state.text.elem != null &&
    state.text.elem.parentNode === state.view.graph.container
  )
}

export function isValidLabel(label: string | HTMLElement | null) {
  if (label != null) {
    if (typeof label === 'string') {
      return label.length > 0
    }
    return true
  }

  return false
}

export function applyClassName(
  shape: Shape | HTMLElement,
  prefix: string,
  native?: string,
  manual?: string,
) {
  let className = ''
  if (native) {
    className += `${prefix}-${native}`
  }
  if (manual) {
    className += ` ${manual}`
  }

  if (className.length > 0) {
    shape.className = className
    if (shape instanceof Shape && shape.elem) {
      shape.elem.setAttribute('class', className)
    }
  }
}
