import * as util from '../../../../../../src/util'
import { Graph } from '../../../../../../src/core'
import { Point, FontStyle } from '../../../../../../src/struct'

export function autosize(graph: Graph) {
  const cells = graph.getSelectedCells()

  if (cells != null) {
    graph.batchUpdate(() => {
      cells.forEach((cell) => {
        if (graph.model.getChildCount(cell)) {
          graph.updateGroupBounds([cell], 20)
        } else {
          const state = graph.view.getState(cell)
          let geo = graph.getCellGeometry(cell)

          if (
            graph.model.isNode(cell) &&
            state != null &&
            state.text != null &&
            geo != null &&
            graph.isWrapping(cell)
          ) {
            geo = geo.clone()
            geo.bounds.height = state.text.boundingBox!.height / graph.view.scale
            graph.model.setGeometry(cell, geo)
          } else {
            graph.cellManager.updateCellSize(cell)
          }
        }
      })
    })
  }
}

export function wordWrap(graph: Graph) {
  const cells = graph.getSelectedCells()
  if (cells != null && cells.length) {
    const style = graph.getStyle(cells[0])
    const value = style.whiteSpace === 'nowrap' ? 'wrap' : 'nowrap'
    graph.stopEditing()
    graph.updateCellsStyle('whiteSpace', value, cells)
  }
}

export function formattedText(graph: Graph) {
  const cells = graph.getSelectedCells()
  if (cells != null && cells.length > 0) {
    graph.stopEditing()
    graph.batchUpdate(() => {
      cells.forEach((cell) => {
        const state = graph.view.getState(cell)
        if (state != null) {
          let label = graph.getLabel(state.cell)
          if (typeof label === 'string') {
            if (graph.isHtmlLabel(cell)) {
              if (util.getBoolean(state.style, 'nl2Br', true)) {
                label = label.replace(/\n/g, '').replace(/<br\s*.?>/g, '\n')
                // Removes HTML tags
                const temp = document.createElement('div')
                temp.innerHTML = label
                label = util.extractTextWithWhitespace(temp.childNodes as any)
              }
            } else {
              // Converts HTML tags to text
              label = util.escape(label)
              if (util.getBoolean(state.style, 'nl2Br', true)) {
                // Converts newlines in plain text to breaks in HTML
                // to match the plain text output
                label = label.replace(/\n/g, '<br/>')
              }
            }
            graph.updateLabel(cell, label)
          }
        }
      })
    })
  }
}

export function fitPage(graph: Graph, padding: Point = new Point()) {
  if (!graph.pageVisible) {
    // this.get('pageView').funct()
  }

  const fmt = graph.pageFormat
  const ps = graph.pageScale
  const cw = graph.container.clientWidth - 10
  const ch = graph.container.clientHeight - 10
  const scale = Math.floor(20 * Math.min(cw / fmt.width / ps, ch / fmt.height / ps)) / 20
  graph.zoomTo(scale)

  if (util.hasScrollbars(graph.container)) {
    graph.container.scrollTop = padding.y * graph.view.scale - 1
    graph.container.scrollLeft = Math.min(
      padding.x * graph.view.scale,
      (graph.container.scrollWidth - graph.container.clientWidth) / 2,
    ) - 1
  }
}

export function fitTwoPages(graph: Graph, padding: Point = new Point()) {
  if (!graph.pageVisible) {
    // this.get('pageView').funct()
  }

  const fmt = graph.pageFormat
  const ps = graph.pageScale
  const cw = graph.container.clientWidth - 10
  const ch = graph.container.clientHeight - 10

  const scale = Math.floor(20 * Math.min(cw / (2 * fmt.width) / ps, ch / fmt.height / ps)) / 20
  graph.zoomTo(scale)

  if (util.hasScrollbars(graph.container)) {
    graph.container.scrollTop = Math.min(
      padding.y,
      (graph.container.scrollHeight - graph.container.clientHeight) / 2,
    )

    graph.container.scrollLeft = Math.min(
      padding.x,
      (graph.container.scrollWidth - graph.container.clientWidth) / 2,
    )
  }
}

export function fitPageWidth(graph: Graph, padding: Point = new Point()) {
  if (!graph.pageVisible) {
    // this.get('pageView').funct()
  }

  const fmt = graph.pageFormat
  const ps = graph.pageScale
  const cw = graph.container.clientWidth - 10

  const scale = Math.floor(20 * cw / fmt.width / ps) / 20
  graph.zoomTo(scale)

  if (util.hasScrollbars(graph.container)) {
    graph.container.scrollLeft = Math.min(
      padding.x * graph.view.scale,
      (graph.container.scrollWidth - graph.container.clientWidth) / 2,
    )
  }
}

export function toggleFontStyle(
  graph: Graph,
  fontStyle: FontStyle,
) {
  if (graph.isEditing()) {
    document.execCommand(FontStyle[fontStyle], false)
  } else {
    graph.stopEditing(false)
    graph.toggleCellStyleFlags('fontStyle', fontStyle)
  }
}
