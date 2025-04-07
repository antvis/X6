import { Point } from '@antv/x6-geometry'
import { Dom, FunctionExt, NumberExt, ObjectExt } from '@antv/x6-common'
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
  private event: Dom.EventObject
  private dblClick = this.onCellDblClick.bind(this)
  private click = this.onCellClick.bind(this)
  private clickPosition: { x: number; y: number } | null = null

  // 添加一个全局静态变量来跟踪整个图表中当前选中的节点
  private static globalSelectedCell: Cell | null = null

  onRender() {
    const cellView = this.cellView as CellView
    if (cellView) {
      cellView.on('cell:dblclick', this.dblClick)
      cellView.on('cell:click', this.click)
      // 监听全局空白区域点击和其他选择事件，用于重置选中状态
      const graph = this.graph
      if (graph) {
        // 点击空白区域时清除全局选中状态
        graph.on('blank:click', () => {
          CellEditor.globalSelectedCell = null
        })
        // 当有新的节点被选中时，更新全局选中状态
        graph.on('cell:selected', ({ cell }: { cell: Cell }) => {
          if (cell !== this.cell) {
            CellEditor.globalSelectedCell = null
          }
        })
        // 当节点被取消选中时，清除全局选中状态
        graph.on('cell:unselected', ({ cell }: { cell: Cell }) => {
          if (cell === CellEditor.globalSelectedCell) {
            CellEditor.globalSelectedCell = null
          }
        })
      }
    }
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
    const text = this.getCellText() || ''
    editor.innerText = text
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
    let textAlign
    let { x, y } = this.options
    const { width, height } = this.options
    // 从选项中获取文本对齐属性或从节点属性中获取
    const attrs = this.options.attrs || {}
    const textAnchor =
      attrs.textAnchor || cell.attr('label/textAnchor') || 'middle'
    const textVerticalAnchor =
      attrs.textVerticalAnchor ||
      cell.attr('label/textVerticalAnchor') ||
      'middle'
    const bbox = cell.getBBox()

    if (typeof x !== 'undefined' && typeof y !== 'undefined') {
      // 如果明确指定了 x 和 y，则使用这些值
      x = NumberExt.normalizePercentage(x, bbox.width)
      y = NumberExt.normalizePercentage(y, bbox.height)
      pos = bbox.topLeft.translate(x, y)
      minWidth = bbox.width - x * 2
    } else {
      // 根据文本对齐方式自动确定位置
      let xPercent
      let yPercent
      // 水平对齐
      if (textAnchor === 'start') {
        xPercent = 0.05 // 靠左
      } else if (textAnchor === 'end') {
        xPercent = 0.95 // 靠右
      } else {
        xPercent = 0.5 // 居中
      }
      // 垂直对齐
      if (textVerticalAnchor === 'top') {
        yPercent = 0.05 // 靠上
      } else if (textVerticalAnchor === 'bottom') {
        yPercent = 0.95 // 靠下
      } else {
        yPercent = 0.5 // 居中
      }
      x = NumberExt.normalizePercentage(xPercent, bbox.width)
      y = NumberExt.normalizePercentage(yPercent, bbox.height)
      pos = bbox.topLeft.translate(x, y)
      minWidth = bbox.width - Math.min(x, bbox.width - x) * 2
    }
    // 始终根据textAnchor和textVerticalAnchor设置适当的transform
    // 确定编辑器的 CSS transform 属性
    if (textAnchor === 'middle' && textVerticalAnchor === 'middle') {
      translate = 'translate(-50%, -50%)'
    } else if (textAnchor === 'middle' && textVerticalAnchor === 'top') {
      translate = 'translate(-50%, 0)'
    } else if (textAnchor === 'middle' && textVerticalAnchor === 'bottom') {
      translate = 'translate(-50%, -100%)'
    } else if (textAnchor === 'start' && textVerticalAnchor === 'middle') {
      translate = 'translate(0, -50%)'
    } else if (textAnchor === 'end' && textVerticalAnchor === 'middle') {
      translate = 'translate(-100%, -50%)'
    } else if (textAnchor === 'start' && textVerticalAnchor === 'top') {
      translate = 'translate(0, 0)'
    } else if (textAnchor === 'start' && textVerticalAnchor === 'bottom') {
      translate = 'translate(0, -100%)'
    } else if (textAnchor === 'end' && textVerticalAnchor === 'top') {
      translate = 'translate(-100%, 0)'
    } else if (textAnchor === 'end' && textVerticalAnchor === 'bottom') {
      translate = 'translate(-100%, -100%)'
    }

    // 对于所有textAnchor为'start'的情况统一处理minWidth
    if (textAnchor === 'start') {
      minWidth = 0
      textAlign = 'left'
    } else if (textAnchor === 'end') {
      textAlign = 'right'
    } else {
      textAlign = 'center'
    }
    const scale = graph.scale()
    const { style } = editor
    pos = graph.localToGraph(pos)
    style.textAlign = textAlign
    style.left = `${pos.x}px`
    style.top = `${pos.y}px`
    style.transform = `scale(${scale.sx}, ${scale.sy}) ${translate}`
    style.minWidth = `${minWidth}px`

    if (typeof width === 'number') {
      style.width = `${width}px`
    }
    if (typeof height === 'number') {
      style.height = `${height}px`
    }
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

  onDocumentMouseUp(e: Dom.MouseDownEvent) {
    if (this.editor && e.target !== this.editor) {
      const value = this.editor.innerText.replace(/\n$/, '') || ''
      // set value, when value is null, we will remove label in edge
      this.setCellText(value !== '' ? value : null)
      // 重置节点的编辑状态标记
      if (this.cell.isNode()) {
        this.cell.setData({
          ...this.cell.getData(),
          isEdit: false,
        })
      }
      // remove tool
      this.removeElement()
    }
  }

  onCellClick({ e }: { e: Dom.ClickEvent; x: number; y: number }) {
    // 检查是否点击在文本区域
    const target = e.target as Element
    const isText = this.isTextElement(target)
    if (isText) {
      e.stopPropagation()
      // 判断当前点击的节点是否与全局选中的节点相同
      const isGloballySelected = CellEditor.globalSelectedCell === this.cell
      // 如果全局已选中当前节点，则进入编辑状态
      if (isGloballySelected || this.editor) {
        // 第二次点击同一节点，进入编辑状态
        this.removeElement() // 如果已有编辑器，先移除
        this.event = e
        this.clickPosition = { x: e.clientX, y: e.clientY }
        this.createElement()
        this.updateEditor()
        this.autoFocus()
        if (this.cell.isNode()) {
          // 标记节点为编辑状态，通过data属性
          this.cell.setData({
            ...this.cell.getData(),
            isEdit: true,
          })
          this.cell.attr('text/text', '')
        }
        this.delegateDocumentEvents(this.options.documentEvents!)
      } else {
        // 第一次点击，只选中节点，不进入编辑状态
        // 更新全局选中状态
        CellEditor.globalSelectedCell = this.cell
      }
    }
  }

  // 判断是否为文本元素
  isTextElement(elem: Element): boolean {
    // 检查元素或其父元素是否包含文本相关特征
    const textTags = ['text', 'tspan']
    const textAttrs = ['text/text', 'label/text']
    // 检查标签名
    if (textTags.includes(elem.tagName.toLowerCase())) {
      return true
    }
    // 检查父元素
    if (
      elem.parentElement &&
      textTags.includes(elem.parentElement.tagName.toLowerCase())
    ) {
      return true
    }
    // 检查文本属性
    return textAttrs.some(
      (attr) => this.cell.isNode() && this.cell.attr(attr) !== undefined,
    )
  }

  onCellDblClick() {
    // 禁用双击启动编辑器的功能
    // 不执行任何操作，保留方法以便事件监听正常工作
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
      if (this.clickPosition) {
        try {
          // 尝试使用caretRangeFromPoint/caretPositionFromPoint定位光标位置
          let textNode: Node | null = null
          let offset = 0
          if (document.caretRangeFromPoint) {
            const caretRange = document.caretRangeFromPoint(
              this.clickPosition.x,
              this.clickPosition.y,
            )
            if (caretRange) {
              textNode = caretRange.startContainer
              offset = caretRange.startOffset
            }
          } else if ((document as any).caretPositionFromPoint) {
            const caretPosition = (document as any).caretPositionFromPoint(
              this.clickPosition.x,
              this.clickPosition.y,
            )
            if (caretPosition) {
              textNode = caretPosition.offsetNode
              offset = caretPosition.offset
            }
          }
          if (textNode && this.editor.contains(textNode)) {
            range.setStart(textNode, offset)
            range.setEnd(textNode, offset)
            selection.removeAllRanges()
            selection.addRange(range)
            return
          }
          // 如果上面的方法失败，回退到在编辑器内部设置光标位置
          // 找到文本节点
          const textNodes: Node[] = []
          const findTextNodes = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              textNodes.push(node)
            } else {
              Array.from(node.childNodes).forEach(findTextNodes)
            }
          }
          findTextNodes(this.editor)
          if (textNodes.length > 0) {
            // 简单方案：将光标定位到第一个文本节点的末尾
            const lastTextNode = textNodes[textNodes.length - 1]
            range.setStart(lastTextNode, lastTextNode.nodeValue?.length || 0)
            range.setEnd(lastTextNode, lastTextNode.nodeValue?.length || 0)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            // 如果没有文本节点，将光标定位到编辑器的开始
            range.setStart(this.editor, 0)
            range.setEnd(this.editor, 0)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        } catch {
          // 如果出现错误，回退到默认全选行为
          range.selectNodeContents(this.editor)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      } else {
        // 如果没有点击位置信息，回退到默认全选行为
        range.selectNodeContents(this.editor)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  getCellText() {
    const { getText } = this.options
    if (typeof getText === 'function') {
      return FunctionExt.call(getText, this.cellView, {
        cell: this.cell,
        index: this.labelIndex,
      })
    }
    if (typeof getText === 'string') {
      if (this.cell.isNode()) {
        return this.cell.attr(getText)
      }
      if (this.cell.isEdge()) {
        if (this.labelIndex !== -1) {
          return this.cell.prop(`labels/${this.labelIndex}/attrs/${getText}`)
        }
      }
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
      return
    }
    if (typeof setText === 'string') {
      if (this.cell.isNode()) {
        if (value !== null) {
          this.cell.attr(setText, value)
        }
        return
      }
      if (this.cell.isEdge()) {
        const edge = this.cell as Edge
        if (this.labelIndex === -1) {
          if (value) {
            const newLabel = {
              position: {
                distance: this.distance,
              },
              attrs: {},
            }
            ObjectExt.setByPath(newLabel, `attrs/${setText}`, value)
            edge.appendLabel(newLabel)
          }
        } else {
          if (value !== null) {
            edge.prop(`labels/${this.labelIndex}/attrs/${setText}`, value)
          } else if (typeof this.labelIndex === 'number') {
            edge.removeLabelAt(this.labelIndex)
          }
        }
      }
    }
  }

  protected onRemove() {
    const cellView = this.cellView as CellView
    if (cellView) {
      cellView.off('cell:dblclick', this.dblClick)
      cellView.off('cell:click', this.click)
    }
    this.removeElement()
  }
}

export namespace CellEditor {
  export interface CellEditorOptions extends ToolsView.ToolItem.Options {
    x?: number | string
    y?: number | string
    width?: number
    height?: number
    attrs: {
      fontSize: number
      fontFamily: string
      color: string
      backgroundColor: string
      textAnchor?: string
      textVerticalAnchor?: string
    }
    labelAddable?: boolean
    getText:
      | ((
          this: CellView,
          args: {
            cell: Cell
            index?: number
          },
        ) => string)
      | string
    setText:
      | ((
          this: CellView,
          args: {
            cell: Cell
            value: string | null
            index?: number
            distance?: number
          },
        ) => void)
      | string
  }
}

export namespace CellEditor {
  CellEditor.config({
    tagName: 'div',
    isSVGElement: false,
    events: {
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
    },
    documentEvents: {
      mouseup: 'onDocumentMouseUp',
      touchend: 'onDocumentMouseUp',
      touchcancel: 'onDocumentMouseUp',
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
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
    getText: 'text/text',
    setText: 'text/text',
  })

  export const EdgeEditor = CellEditor.define<CellEditorOptions>({
    attrs: {
      fontSize: 14,
      fontFamily: 'Arial, helvetica, sans-serif',
      color: '#000',
      backgroundColor: '#fff',
    },
    labelAddable: true,
    getText: 'label/text',
    setText: 'label/text',
  })
}
