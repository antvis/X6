import { Cell } from '../core'

export namespace CellPath {
  const separator = '.'

  export function getCellPath(cell: Cell) {
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

    return idxs.join(separator)
  }

  export function getParentPath(path: string) {
    if (path != null) {
      const index = path.lastIndexOf(separator)
      if (index >= 0) {
        return path.substring(0, index)
      }
    }

    return ''
  }

  export function resolve(root: Cell, path: string): Cell {
    let child = root
    path.split(separator).forEach(token => {
      const index = parseInt(token, 10)
      const result = child.getChildAt(index)
      if (result == null) {
        throw new Error(`Can not resolve cell from path: ${path}`)
      } else {
        child = result
      }
    })
    return child
  }

  export function compare(p1: string[], p2: string[]) {
    let comp = 0
    const min = Math.min(p1.length, p2.length)

    for (let i = 0; i < min; i += 1) {
      const v1 = p1[i]
      const v2 = p2[i]

      if (v1 !== v2) {
        if (v1.length === 0 || v2.length === 0) {
          comp = v1 === v2 ? 0 : v1 > v2 ? 1 : -1
        } else {
          const t1 = parseInt(v1, 10)
          const t2 = parseInt(v2, 10)
          comp = t1 === t2 ? 0 : t1 > t2 ? 1 : -1
        }

        break
      }
    }

    // Compares path length if both paths are equal to this point
    if (comp === 0) {
      const t1 = p1.length
      const t2 = p2.length
      if (t1 !== t2) {
        comp = t1 > t2 ? 1 : -1
      }
    }

    return comp
  }

  /**
   * Sorts the given cells according to the order in the cell hierarchy.
   * Ascending is optional and defaults to true.
   */
  export function sortCells(cells: Cell[], ascending: boolean = true) {
    const dict = new WeakMap<Cell, string[]>()
    const ensure = (c: Cell) => {
      let p = dict.get(c)
      if (p == null) {
        p = getCellPath(c).split(separator)
        dict.set(c, p)
      }
      return p
    }

    return cells.sort((c1, c2) => {
      const p1 = ensure(c1)
      const p2 = ensure(c2)
      const comp = compare(p1, p2)
      return comp === 0 ? 0 : comp > 0 === ascending ? 1 : -1
    })
  }

  export function getNearestCommonAncestor(
    cell1: Cell | null,
    cell2: Cell | null
  ): Cell | null {
    if (cell1 != null && cell2 != null) {
      let path2 = getCellPath(cell2)
      if (path2 != null && path2.length > 0) {
        let cell: Cell | null = cell1
        let path1 = getCellPath(cell)

        // exchange
        if (path2.length < path1.length) {
          cell = cell2
          const tmp = path1
          path1 = path2
          path2 = tmp
        }

        while (cell != null) {
          const parent: Cell | null = cell.getParent()
          if (path2.indexOf(path1 + separator) === 0 && parent != null) {
            return cell
          }

          path1 = getParentPath(path1)
          cell = parent
        }
      }
    }

    return null
  }
}
