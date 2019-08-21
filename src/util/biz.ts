import { Model, Cell } from '../core'
import { CellPath } from '../core/cell-path'
import { Point } from '../struct'
import { getOffset, getScrollOrigin } from './dom'

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
  value: string,
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
function setStyle(style: string | null, key: string, value: string) {
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
 * 			mxConstants.STYLE_FONTSTYLE,
 * 			mxConstants.FONT_BOLD);
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
