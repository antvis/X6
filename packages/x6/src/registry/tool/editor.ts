import { Point } from '@antv/x6-geometry'
import { Dom, FunctionExt, NumberExt } from '@antv/x6-common'
import { ToolsView } from '../../view/tool'
import { Cell, Edge } from '../../model'
import { CellView, NodeView, EdgeView } from '../../view'
import { Util } from '../../util'

export class CellEditor extends ToolsView.ToolItem<
  NodeView | EdgeView,
  CellEditor.CellEditorOptions & { event: Dom.EventObject }
> {
  private editor: HTMLDivElement | null
  private labelIndex = -1
  private distance = 0.5
  private event: Dom.DoubleClickEvent

  onRender() {
    this.graph.on('cell:dblclick', ({ e, cell }) => {
      if (cell === this.cell) {
        this.onCellDblClick(e)
      }
    })
  }

  createElement() {
    const classNames = [
      this.prefixClassName(
        `${this.cell.isEdge() ? 'edge' : 'node'}-tool-editor`,
      ),
      this.prefixClassName('cell-tool-editor'),
    ]
    this.editor = ToolsView.createElement('div', false) as HTMLDivElement
    this.addClass(classNames, this.editor)
    this.editor.contentEditable = 'true'
    this.container.appendChild(this.editor)
  }

  removeElement() {
    this.undelegateDocumentEvents()
    if (this.editor) {
      this.container.removeChild(this.editor)
      this.editor = null
    }
  }

  updateEditor() {
    const { cell, editor } = this

    if (!editor) {
      return
    }

    const { style } = editor

    if (cell.isNode()) {
      this.updateNodeEditorTransform()
    } else if (cell.isEdge()) {
      this.updateEdgeEditorTransform()
    }

    // set font style
    const { attrs } = this.options
    style.fontSize = `${attrs.fontSize}px`
    style.fontFamily = attrs.fontFamily
    style.color = attrs.color
    style.backgroundColor = attrs.backgroundColor

    // set init value
    let text
    const { getText } = this.options
    if (typeof getText === 'function') {
      text = FunctionExt.call(getText, this.cellView, {
        cell: this.cell,
        index: this.labelIndex,
      })
    }
    editor.innerText = text || ''
    this.setCellText('') // clear display value when edit status because char ghosting.

    return this
  }

  updateNodeEditorTransform() {
    const { graph, cell, editor } = this

    if (!editor) {
      return
    }

    let pos = Point.create()
    let minWidth = 20
    let translate = ''
    let { x, y } = this.options

    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      const bbox = cell.getBBox()
      x = NumberExt.normalizePercentage(x, bbox.width)
      y = NumberExt.normalizePercentage(y, bbox.height)
      pos = bbox.topLeft.translate(x, y)
      minWidth = bbox.width - x * 2
    } else {
      const bbox = cell.getBBox()
      pos = bbox.center
      minWidth = bbox.width - 4
      translate = 'translate(-50%, -50%)'
    }

    const scale = graph.scale()
    const { style } = editor
    pos = graph.localToGraph(pos)
    style.left = `${pos.x}px`
    style.top = `${pos.y}px`
    style.transform = `scale(${scale.sx}, ${scale.sy}) ${translate}`
    style.minWidth = `${minWidth}px`
  }

  updateEdgeEditorTransform() {
    if (!this.event) {
      return
    }

    const { graph, editor } = this
    if (!editor) {
      return
    }

    let pos = Point.create()
    let minWidth = 20
    const { style } = editor
    const target = this.event.target
    const parent = target.parentElement
    const isEdgeLabel =
      parent && Dom.hasClass(parent, this.prefixClassName('edge-label'))
    if (isEdgeLabel) {
      const index = parent.getAttribute('data-index') || '0'
      this.labelIndex = parseInt(index, 10)
      const matrix = parent.getAttribute('transform')
      const { translation } = Dom.parseTransformString(matrix)
      pos = new Point(translation.tx, translation.ty)
      minWidth = Util.getBBox(target).width
    } else {
      if (!this.options.labelAddable) {
        return this
      }
      pos = graph.clientToLocal(
        Point.create(this.event.clientX, this.event.clientY),
      )
      const view = this.cellView as EdgeView
      const d = view.path.closestPointLength(pos)
      this.distance = d
      this.labelIndex = -1
    }

    pos = graph.localToGraph(pos)
    const scale = graph.scale()
    style.left = `${pos.x}px`
    style.top = `${pos.y}px`
    style.minWidth = `${minWidth}px`
    style.transform = `scale(${scale.sx}, ${scale.sy}) translate(-50%, -50%)`
  }

  onDocumentMouseDown(e: Dom.MouseDownEvent) {
    if (this.editor && e.target !== this.editor) {
      const value = this.editor.innerText.replace(/\n$/, '') || ''
      // set value, when value is null, we will remove label in edge
      this.setCellText(value !== '' ? value : null)
      // remove tool
      this.removeElement()
    }
  }

  onCellDblClick(e: Dom.DoubleClickEvent) {
    e.stopPropagation()
    this.removeElement()
    this.event = e
    this.createElement()
    this.updateEditor()
    this.autoFocus()
    this.delegateDocumentEvents(this.options.documentEvents!)
  }

  onMouseDown(e: Dom.MouseDownEvent) {
    e.stopPropagation()
  }

  autoFocus() {
    setTimeout(() => {
      if (this.editor) {
        this.editor.focus()
        this.selectText()
      }
    })
  }

  selectText() {
    if (window.getSelection && this.editor) {
      const range = document.createRange()
      const selection = window.getSelection()!
      range.selectNodeContents(this.editor)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  setCellText(value: string | null) {
    const setText = this.options.setText
    if (typeof setText === 'function') {
      FunctionExt.call(setText, this.cellView, {
        cell: this.cell,
        value,
        index: this.labelIndex,
        distance: this.distance,
      })
    }
  }

  protected onRemove() {
    this.removeElement()
  }
}

export namespace CellEditor {
  export interface CellEditorOptions extends ToolsView.ToolItem.Options {
    x?: number | string
    y?: number | string
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
        value: string | null
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
      if (value !== null) {
        cell.attr('text/text', value)
      }
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
        if (value) {
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
        }
      } else {
        if (value !== null) {
          edge.prop(`labels/${index}/attrs/label/text`, value)
        } else if (typeof index === 'number') {
          edge.removeLabelAt(index)
        }
      }
    },
  })
}
