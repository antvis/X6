import { Cell } from '../core'

export namespace CellPath {

  export const PATH_SEPARATOR = '.'

  export function create(cell: Cell) {
    const idxs = []
    if (cell != null) {
      let child = cell
      let parent = child.getParent()

      while (parent != null) {
        const index = parent.getChildIndex(child)
        idxs.unshift(index)
        child = parent
        parent = child.getParent()
      }
    }

    return idxs.join(PATH_SEPARATOR)
  }

  export function getParentPath(path: string) {
    if (path != null) {
      const index = path.lastIndexOf(PATH_SEPARATOR)
      if (index >= 0) {
        return path.substring(0, index)
      }
    }

    return ''
  }

  export function resolve(root: Cell, path: string): Cell {
    let child = root

    if (path != null) {
      const tokens = path.split(PATH_SEPARATOR)
      for (let i = 0; i < tokens.length; i += 1) {
        child = child.getChildAt(parseInt(tokens[i], 10))!
      }
    }

    return child
  }

  export function compare(p1: string[], p2: string[]) {
    let comp = 0

    const min = Math.min(p1.length, p2.length)
    for (let i = 0; i < min; i += 1) {
      if (p1[i] !== p2[i]) {
        if (
          p1[i].length === 0 ||
          p2[i].length === 0
        ) {
          comp = p1[i] === p2[i]
            ? 0
            : ((p1[i] > p2[i]) ? 1 : -1)
        } else {
          const t1 = parseInt(p1[i], 10)
          const t2 = parseInt(p2[i], 10)

          comp = t1 === t2
            ? 0
            : ((t1 > t2) ? 1 : -1)
        }

        break
      }
    }

    // Compares path length if both paths are equal to this point
    if (comp === 0) {
      const t1 = p1.length
      const t2 = p2.length
      if (t1 !== t2) {
        comp = (t1 > t2) ? 1 : -1
      }
    }

    return comp
  }
}
