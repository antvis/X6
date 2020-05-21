import { Node, Model } from '../model'

export namespace GridLayout {
  export function layout(cells: Node[] | Model, options: Options = {}) {
    let graph
    graph =
      cells instanceof Model
        ? cells
        : new Model().resetCells(cells, {
            sort: false,
            dryrun: true,
          })

    const nodes = graph.getNodes()
    const columns = options.columns || 1
    const rows = Math.ceil(nodes.length / columns)
    const dx = options.dx || 0
    const dy = options.dy || 0
    const centre = options.centre !== false
    const resizeToFit = options.resizeToFit === true
    const marginX = options.marginX || 0
    const marginY = options.marginY || 0
    const columnWidths: number[] = []

    let columnWidth = options.columnWidth

    if ('compact' === columnWidth) {
      for (let j = 0; j < columns; j += 1) {
        const items = getNodesInColumn(nodes, j, columns)
        columnWidths.push(getMaxDim(items, 'width') + dx)
      }
    } else {
      if (columnWidth == null || columnWidth === 'auto') {
        columnWidth = getMaxDim(nodes, 'width') + dx
      }

      for (let i = 0; i < columns; i += 1) {
        columnWidths.push(columnWidth)
      }
    }

    const columnLefts = accumulate(columnWidths, marginX)

    const rowHeights: number[] = []
    let rowHeight = options.rowHeight
    if ('compact' === rowHeight) {
      for (let i = 0; i < rows; i += 1) {
        const items = getNodesInRow(nodes, i, columns)
        rowHeights.push(getMaxDim(items, 'height') + dy)
      }
    } else {
      if (rowHeight == null || rowHeight === 'auto') {
        rowHeight = getMaxDim(nodes, 'height') + dy
      }

      for (let i = 0; i < rows; i += 1) {
        rowHeights.push(rowHeight)
      }
    }
    const rowTops = accumulate(rowHeights, marginY)

    graph.startBatch('layout')

    nodes.forEach((node, index) => {
      const rowIndex = index % columns
      const columnIndex = Math.floor(index / columns)
      const columnWidth = columnWidths[rowIndex]
      const rowHeight = rowHeights[columnIndex]

      let cx = 0
      let cy = 0
      let size = node.getSize()

      if (resizeToFit) {
        let width = columnWidth - 2 * dx
        let height = rowHeight - 2 * dy
        const calcHeight = size.height * (size.width ? width / size.width : 1)
        const calcWidth = size.width * (size.height ? height / size.height : 1)
        if (rowHeight < calcHeight) {
          width = calcWidth
        } else {
          height = calcHeight
        }
        size = {
          width,
          height,
        }
        node.setSize(size, options)
      }

      if (centre) {
        cx = (columnWidth - size.width) / 2
        cy = (rowHeight - size.height) / 2
      }

      node.pos(
        columnLefts[rowIndex] + dx + cx,
        rowTops[columnIndex] + dy + cy,
        options,
      )
    })

    graph.stopBatch('layout')
  }

  export interface Options extends Node.SetPositionOptions {
    columns?: number
    columnWidth?: number | 'auto' | 'compact'
    rowHeight?: number | 'auto' | 'compact'
    dx?: number
    dy?: number
    marginX?: number
    marginY?: number
    /**
     * Positions the elements in the centre of a grid cell.
     * Default: true
     */
    centre?: boolean
    /**
     * Resizes the elements to fit a grid cell, preserving the aspect ratio.
     * Default: false
     */
    resizeToFit?: boolean
  }

  function getMaxDim(nodes: Node[], name: 'width' | 'height') {
    return nodes.reduce((memo, node) => Math.max(node.getSize()[name], memo), 0)
  }

  function getNodesInRow(nodes: Node[], rowIndex: number, columnCount: number) {
    const res: Node[] = []
    for (let i = columnCount * rowIndex, ii = i + columnCount; i < ii; i += 1) {
      res.push(nodes[i])
    }
    return res
  }

  function getNodesInColumn(
    nodes: Node[],
    columnIndex: number,
    columnCount: number,
  ) {
    const res: Node[] = []
    for (let i = columnIndex, ii = nodes.length; i < ii; i = i + columnCount) {
      res.push(nodes[i])
    }
    return res
  }

  function accumulate(items: number[], start: number) {
    return items.reduce(
      (memo, item, i) => {
        memo.push(memo[i] + item)
        return memo
      },
      [start || 0],
    )
  }
}
