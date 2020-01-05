export type Align = 'left' | 'center' | 'right'
export type VAlign = 'top' | 'middle' | 'bottom'

export namespace Align {
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
    let x = 0
    let y = 0

    if (align === 'center') {
      x = -0.5
    } else if (align === 'right') {
      x = -1
    }

    if (valign === 'middle') {
      y = -0.5
    } else if (valign === 'bottom') {
      y = -1
    }

    return { x, y }
  }
}
