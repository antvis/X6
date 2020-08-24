import { Graph, Events, DataUri } from '@antv/x6'
import { debounce } from 'lodash'
import registerShape from './shape'
import { SHAPES } from './constant'

export interface ShapeOption {
  type: string,
  clientX: number,
  clientY: number,
}
export enum CONFIG_TYPE {
  GRID,
  NODE,
  EDGE,
}

export default class X6Editor extends Events{
  private static instance: X6Editor | null = null
  private graph: Graph
  private container: HTMLElement

  public static getInstance() {
    if (!this.instance) {
      this.instance = new X6Editor()
    }
    return this.instance;
  }

  constructor() {
    super()
    this.container = document.getElementById('container')!
    const { offsetWidth, offsetHeight } = this.container
    this.graph = new Graph({
      container: this.container,
      width: offsetWidth,
      height: offsetHeight - 2,
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          { 
            color: '#e6e6e6',
            thickness: 1,
          },
          { 
            color: '#d0d0d0',
            thickness: 1,
            factor: 5,
          },
        ],
      },
      connecting:{
        anchor: 'center',
        connectionPoint: 'anchor',
      },
      snapline: true,
      resizing: true,
      history: true,
    })
    this.initEvent()
    registerShape();
  }

  addShape(option: ShapeOption) {
    const { type, clientX, clientY } = option
    const { width, height } = SHAPES.find(s => s.type === type)!
    const { offsetLeft, offsetTop } = this.container
    const x = clientX - offsetLeft - width / 2
    const y = clientY - offsetTop - height / 2
    this.graph.addNode({
      shape: type,
      x,
      y,
      width,
      height,
    })
  }

  showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }

  clear() {
    const ids: string[] = []
    const edges = this.graph.getEdges()
    edges.forEach(edge => {
      ids.push(edge.id)
    })
    const nodes = this.graph.getNodes()
    nodes.forEach(node => {
      ids.push(node.id)
    })
    this.graph.removeCells(ids)
  }

  save() {
    this.graph.toPNG(datauri => {
      DataUri.downloadDataUri(datauri, 'chart.png')
    })
  }

  print() {
    this.graph.printPreview()
  }

  getHistoryStatus() {
    const { history } = this.graph
    return {
      canUndo: history.canUndo(),
      canRedo: history.canRedo(),
    }
  }

  undo() {
    this.graph.history.undo()
  }

  redo() {
    this.graph.history.redo()
  }

  drawGrid(option: Graph.GridManager.DrawGridOptions) {
    this.graph.drawGrid(option)
  }

  setGridSize(size: number) {
    this.graph.setGridSize(size)
  }

  initEvent() {
    const { graph } = this
    // show or hide ports
    graph.on('node:mouseenter', debounce(() => {
      const ports = this.container.querySelectorAll('.x6-port') as NodeListOf<SVGAElement>
      this.showPorts(ports, true)
    }), 500)
    graph.on('node:mouseleave', () => {
      const ports = this.container.querySelectorAll('.x6-port') as NodeListOf<SVGAElement>
      this.showPorts(ports, false)
    })

    // history
    graph.history.on('change', () => {
      this.trigger('history:change', {
        canUndo: graph.history.canUndo(),
        canRedo: graph.history.canRedo(),
      })
    })

    // node/edges attrs
    graph.on('node:click', ({e, x, y, node}) => {
      this.trigger('config.type:change', CONFIG_TYPE.NODE)
    })
    graph.on('edge:click', ({e, x, y, edge}) => {
      this.trigger('config.type:change', CONFIG_TYPE.EDGE)
    })

    // grid attrs
    graph.on('blank:click', () => {
      this.trigger('config.type:change', CONFIG_TYPE.GRID)
    })
  }
}
