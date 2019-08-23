import { Model, Cell, CellState } from '../core'
import { CellPath } from '../core/cell-path'
import { Point } from '../struct'
import { Align, DirectionMask, StyleNames, Direction } from '../types'
import { getOffset, getScrollOrigin } from './dom'
import { getValue, getNumber } from './object'
import { getBooleanFromStyle } from './stylesheet'

/**
	 * Function: setCellStyles
	 *
	 * Assigns the value for the given key in the styles of the given cells, or
	 * removes the key from the styles if the value is null.
	 *
	 * Parameters:
	 *
	 * model - <mxGraphModel> to execute the transaction in.
	 * cells - Array of <mxCells> to be updated.
	 * key - Key of the style to be changed.
	 * value - New value for the given key.
	 */
export function setCellStyles(
  model: Model,
  cells: Cell[],
  key: string,
  value: string | null,
) {
  if (cells != null && cells.length > 0) {
    model.beginUpdate()
    try {
      cells.forEach((cell) => {
        if (cell != null) {
          const style = setStyle(model.getStyle(cell), key, value)
          model.setStyle(cell, style)
        }
      })
    } finally {
      model.endUpdate()
    }
  }
}

/**
 * Adds or removes the given key, value pair to the style and returns the
 * new style. If value is null or zero length then the key is removed from
 * the style.
 *
 * This is for cell styles, not for CSS styles.
 */
export function setStyle(
  style: string | null,
  key: string,
  value: string | null,
) {
  const isValue = (
    value != null &&
    (typeof (value.length) === 'undefined' || value.length > 0)
  )

  if (style == null || style.length === 0) {
    if (isValue) {
      return `${key}=${value};`
    }
  } else {
    if (style.substring(0, key.length + 1) === `${key}=`) {
      const next = style.indexOf(';')
      if (isValue) {
        return `${key}=${value}${next < 0 ? ';' : style.substring(next)}`
      }

      return (next < 0 || next === style.length - 1)
        ? ''
        : style.substring(next + 1)
    }

    const index = style.indexOf(`;${key}=`)
    if (index < 0) {
      if (isValue) {
        const sep = (style.charAt(style.length - 1) === ';') ? '' : ';'
        return `${style}${sep}${key}=${value};`
      }
    } else {
      const next = style.indexOf(';', index + 1)
      if (isValue) {
        // tslint:disable-next-line
        return `${style.substring(0, index + 1)}${key}=${value}${next < 0 ? ';' : style.substring(next)}`
      }

      return style.substring(0, index) + (next < 0 ? ';' : style.substring(next))
    }
  }

  return style
}

/**
 * Sets or toggles the flag bit for the given key in the cell's styles.
 * If value is null then the flag is toggled.
 *
 * Example:
 *
 * (code)
 * var cells = graph.getSelectionCells();
 * mxUtils.setCellStyleFlags(graph.model,
 * 			cells,
 * 			constants.STYLE_FONTSTYLE,
 * 			constants.FONT_BOLD);
 * (end)
 *
 * Toggles the bold font style.
 *
 * Parameters:
 *
 * model - <mxGraphModel> that contains the cells.
 * cells - Array of <mxCells> to change the style for.
 * key - Key of the style to be changed.
 * flag - Integer for the bit to be changed.
 * value - Optional boolean value for the flag.
 */
export function setCellStyleFlags(
  model: Model,
  cells: Cell[],
  key: string,
  flag: number,
  value: boolean,
) {
  if (cells != null && cells.length > 0) {
    model.beginUpdate()
    try {
      cells.forEach((cell) => {
        if (cell != null) {
          const style = setStyleFlag(
            model.getStyle(cell),
            key, flag, value,
          )
          model.setStyle(cell, style)
        }
      })
    } finally {
      model.endUpdate()
    }
  }
}

/**
 * Sets or removes the given key from the specified style and returns the
 * new style. If value is null then the flag is toggled.
 *
 * Parameters:
 *
 * style - String of the form [(stylename|key=value);].
 * key - Key of the style to be changed.
 * flag - Integer for the bit to be changed.
 * value - Optional boolean value for the given flag.
 */
function setStyleFlag(
  style: string | null,
  key: string,
  flag: number,
  value: boolean,
) {
  if (style == null || style.length === 0) {
    if (value || value == null) {
      return `${key}=${flag}`
    }
    return `${key}=0`
  }

  const index = style.indexOf(`${key}=`)
  if (index < 0) {
    const sep = (style.charAt(style.length - 1) === ';') ? '' : ';'
    if (value || value == null) {
      return `${style}${sep}${key}=${flag}`
    }
    return `${style}${sep}${key}=0`
  }

  const cont = style.indexOf(';', index)
  let tmp = ''

  if (cont < 0) {
    tmp = style.substring(index + key.length + 1)
  } else {
    tmp = style.substring(index + key.length + 1, cont)
  }

  let val
  if (value == null) {
    val = parseInt(tmp, 10) ^ flag
  } else if (value) {
    val = parseInt(tmp, 10) | flag
  } else {
    val = parseInt(tmp, 10) & ~flag
  }

  return `${style.substring(0, index)}${key}=${val}${cont >= 0 ? style.substring(cont) : ''}`
}

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
export function convertPoint(container: HTMLElement, x: number, y: number) {
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
export function getAlignmentAsPoint(align: Align, valign: Align) {
  let dx = 0
  let dy = 0

  if (align === Align.center) {
    dx = -0.5
  } else if (align === Align.right) {
    dx = -1
  }

  if (valign === Align.middle) {
    dy = -0.5
  } else if (valign === Align.bottom) {
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
  const value = getValue(
    terminal.style,
    StyleNames.portConstraint,
    getValue(
      edge.style,
      isSource
        ? StyleNames.sourcePortConstraint
        : StyleNames.targetPortConstraint,
      null,
    ),
  )

  if (value == null) {
    return defaultValue
  } {
    let returnValue = DirectionMask.none
    const directions = value.toString()
    const constraintRotationEnabled = getBooleanFromStyle(
      terminal.style,
      StyleNames.portConstraintRotation,
    )

    let rotation = 0
    if (constraintRotationEnabled) {
      rotation = getNumber(terminal.style, StyleNames.rotation, 0)
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

    if (directions.indexOf(Direction.north) >= 0) {
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

    if (directions.indexOf(Direction.west) >= 0) {
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
    if (directions.indexOf(Direction.south) >= 0) {
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
    if (directions.indexOf(Direction.east) >= 0) {
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
