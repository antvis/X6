import { Graph, ToolsView, EdgeView, Point } from '@antv/x6'
import '../index.less'

class EditableCellTool extends ToolsView.ToolItem<
  EdgeView,
  EditableCellToolOptions
> {
  private editorContent: HTMLDivElement 

  render() {
    super.render()
    const cell = this.cell
    let x = 0
    let y = 0
    let width = 0
    let height = 0

    if (cell.isNode()) {
      const position = cell.position()
      const size = cell.size()
      x = position.x
      y = position.y
      width = size.width
      height = size.height
    } else {
      x = this.options.x - 40
      y = this.options.y - 20
      width = 80
      height = 40
    }

    const editorParent = ToolsView.createElement('div', false) as HTMLDivElement
    editorParent.style.position = 'absolute'
    editorParent.style.left = `${x}px`
    editorParent.style.top = `${y}px`
    editorParent.style.width = `${width}px`
    editorParent.style.height = `${height}px`
    editorParent.style.display = 'flex'
    editorParent.style.alignItems = 'center'
    editorParent.style.textAlign = 'center'

    this.editorContent = ToolsView.createElement('div', false) as HTMLDivElement
    this.editorContent.contentEditable = 'true'
    this.editorContent.style.width = '100%'
    this.editorContent.style.outline = 'none'
    this.editorContent.style.backgroundColor = cell.isEdge() ? '#fff' : ''
    this.editorContent.style.border = cell.isEdge() ? '1px solid #ccc' : 'none'
    editorParent.appendChild(this.editorContent)
    this.container.appendChild(editorParent)

    this.init()
  
    return this
  }

  init = () => {
    const cell = this.cell
    if (cell.isNode()) {
      const value = cell.attr('text/text') as string
      if (value) {
        this.editorContent.innerHTML = value
        cell.attr('text/text', '')
      }
    }
    setTimeout(() => {
      this.editorContent.focus()
    })
    document.addEventListener('mousedown', this.onMouseDown)
  }

  onMouseDown = (e: MouseEvent) => {
    if (e.target !== this.editorContent) {
      const cell = this.cell
      const value = this.editorContent.innerHTML
      cell.removeTools()
      if (cell.isNode()) {
        cell.attr('text/text', value)
      } else if (cell.isEdge()) {
        cell.appendLabel({
          attrs: {
            text: {
              text: value,
            }
          },
          position: {
            distance: this.getDistance(),
          }
        })
      }
      document.removeEventListener('mousedown', this.onMouseDown)
    }
  }

  getDistance() {
    const cell = this.cell
    if (cell.isEdge()) {
      const targetPoint = cell.getTargetPoint()
      const cross = cell.getSourceNode()!.getBBox().intersectsWithLineFromCenterToPoint(targetPoint)!
      const p = new Point(this.options.x, this.options.y)
      return p.distance(cross)
    }
    return 0
  }
}

EditableCellTool.config({
  tagName: 'div',
  isSVGElement: false,
})

export interface EditableCellToolOptions extends ToolsView.ToolItem.Options {
  x: number
  y: number
}

Graph.registerEdgeTool('editableCell', EditableCellTool, true)
Graph.registerNodeTool('editableCell', EditableCellTool, true)

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  grid: true,
})

const source = graph.addNode({
  x: 180,
  y: 60,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
})

const target = graph.addNode({
  x: 320,
  y: 250,
  width: 100,
  height: 40,
  attrs: {
    body: {
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
  },
})

graph.addEdge({
  source,
  target,
  attrs: {
    line: {
      stroke: '#a0a0a0',
      strokeWidth: 1,
    },
  },
})

graph.on('cell:dblclick', ({ cell, e }) => {
  const p = graph.clientToGraph(e.clientX, e.clientY)
  cell.addTools([
    {
      name: 'editableCell',
      args: {
        x: p.x,
        y: p.y,
      },
    },
  ])
})