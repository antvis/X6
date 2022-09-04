import { ToolsView } from '../../view/tool'
import { Cell, Edge } from '../../model'
import { CellView, NodeView, EdgeView } from '../../view'
import { Point } from '../../geometry'
import { Dom, FunctionExt } from '../../util'

export class CellEditor extends ToolsView.ToolItem<
  NodeView | EdgeView,
  CellEditor.CellEditorOptions & { event: JQuery.MouseEventBase }
> {
  private editor: HTMLDivElement
  private labelIndex = -1
  private distance = 0.5

  render() {
    this.createElement()
    this.updateEditor()
    this.autoFocus()
    this.delegateDocumentEvents(this.options.documentEvents!)

    return this
  }

  createElement() {
    const { cell } = this
    const classNames = [
      this.prefixClassName(`${cell.isEdge() ? 'edge' : 'node'}-tool-editor`),
      this.prefixClassName('cell-tool-editor'),
    ]
    this.editor = ToolsView.createElement('div', false) as HTMLDivElement
    this.addClass(classNames, this.editor)
    this.editor.contentEditable = 'true'
    this.container.appendChild(this.editor)
  }

  updateEditor() {
    const { graph, cell, editor } = this
    const style = editor.style

    // set tool position
    let pos = new Point()
    let minWidth = 20
    if (cell.isNode()) {
      pos = cell.getBBox().center
      minWidth = cell.size().width - 4
    } else if (cell.isEdge()) {
      const e = this.options.event
      const target = e.target
      const parent = target.parentElement
      const isEdgeLabel =
        parent && Dom.hasClass(parent, this.prefixClassName('edge-label'))
      if (isEdgeLabel) {
        const index = parent.getAttribute('data-index') || '0'
        this.labelIndex = parseInt(index, 10)
        const matrix = parent.getAttribute('transform')
        const { translation } = Dom.parseTransformString(matrix)
        pos = new Point(translation.tx, translation.ty)
        minWidth = Dom.getBBox(target).width
      } else {
        if (!this.options.labelAddable) {
          return this
        }
        pos = graph.clientToLocal(Point.create(e.clientX, e.clientY))
        const view = this.cellView as EdgeView
        const d = view.path.closestPointLength(pos)
        this.distance = d
      }
    }
    pos = graph.localToGraph(pos)
    style.left = `${pos.x}px`
    style.top = `${pos.y}px`
    style.minWidth = `${minWidth}px`

    // set tool transform
    const scale = graph.scale()
    style.transform = `scale(${scale.sx}, ${scale.sy}) translate(-50%, -50%)`

    // set font style
    const attrs = this.options.attrs
    style.fontSize = `${attrs.fontSize}px`
    style.fontFamily = attrs.fontFamily
    style.color = attrs.color
    style.backgroundColor = attrs.backgroundColor

    // set init value
    const getText = this.options.getText
    let text
    if (typeof getText === 'function') {
      text = FunctionExt.call(getText, this.cellView, {
        cell: this.cell,
        index: this.labelIndex,
      })
    }
    editor.innerText = text || ''

    return this
  }

  onDocumentMouseDown(e: JQuery.MouseDownEvent) {
    if (e.target !== this.editor) {
      const cell = this.cell
      const value = this.editor.innerText.replace(/\n$/, '') || ''
      // set value
      const setText = this.options.setText
      if (typeof setText === 'function') {
        FunctionExt.call(setText, this.cellView, {
          cell: this.cell,
          value,
          index: this.labelIndex,
          distance: this.distance,
        })
      }
      // remove tool
      cell.removeTool(cell.isEdge() ? 'edge-editor' : 'node-editor')
      this.undelegateDocumentEvents()
    }
  }

  onDblClick(e: JQuery.DoubleClickEvent) {
    e.stopPropagation()
  }

  onMouseDown(e: JQuery.MouseDownEvent) {
    e.stopPropagation()
  }

  autoFocus() {
    setTimeout(() => {
      this.editor.focus()
      this.selectText()
    })
  }

  selectText() {
    if (window.getSelection) {
      const range = document.createRange()
      const selection = window.getSelection()!
      range.selectNodeContents(this.editor)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}

export namespace CellEditor {
  export interface CellEditorOptions extends ToolsView.ToolItem.Options {
    attrs: {
      fontSize: number
      fontFamily: string
      color: string
      backgroundColor: string
    }
    labelAddable?: boolean
    getText: (
      this: CellView,
      args: {
        cell: Cell
        index?: number
      },
    ) => string
    setText: (
      this: CellView,
      args: {
        cell: Cell
        value: string
        index?: number
        distance?: number
      },
    ) => void
  }
}

export namespace CellEditor {
  CellEditor.config({
    tagName: 'div',
    isSVGElement: false,
    events: {
      dblclick: 'onDblClick',
      mousedown: 'onMouseDown',
    },
    documentEvents: {
      mousedown: 'onDocumentMouseDown',
    },
  })
}

export namespace CellEditor {
  export const NodeEditor = CellEditor.define<CellEditorOptions>({
    attrs: {
      fontSize: 14,
      fontFamily: 'Arial, helvetica, sans-serif',
      color: '#000',
      backgroundColor: '#fff',
    },
    getText({ cell }) {
      return cell.attr('text/text')
    },
    setText({ cell, value }) {
      cell.attr('text/text', value)
    },
  })

  export const EdgeEditor = CellEditor.define<CellEditorOptions>({
    attrs: {
      fontSize: 14,
      fontFamily: 'Arial, helvetica, sans-serif',
      color: '#000',
      backgroundColor: '#fff',
    },
    labelAddable: true,
    getText({ cell, index }) {
      if (index === -1) {
        return ''
      }
      return cell.prop(`labels/${index}/attrs/label/text`)
    },
    setText({ cell, value, index, distance }) {
      const edge = cell as Edge
      if (index === -1) {
        edge.appendLabel({
          position: {
            distance: distance!,
          },
          attrs: {
            label: {
              text: value,
            },
          },
        })
      } else {
        if (value) {
          edge.prop(`labels/${index}/attrs/label/text`, value)
        } else if (typeof index === 'number') {
          edge.removeLabelAt(index)
        }
      }
    },
  })
}
