import React from 'react'
import { Graph, Dom, Addon } from '@antv/x6'
import './app.css'

const { Dnd } = Addon

export default class Example extends React.Component {
  private graph: Graph
  private container: HTMLDivElement
  private dndContainer: HTMLDivElement
  private dnd: any

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      history: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    graph.addEdge({ source, target })
    graph.centerContent()
    this.dnd = new Dnd({
      target: graph,
      scaled: false,
      animation: true,
      dndContainer: this.dndContainer,
      validateNode(droppingNode, options) {
        return droppingNode.shape === 'html'
          ? new Promise<boolean>((resolve) => {
              const { draggingNode, draggingGraph } = options
              const view = draggingGraph.findView(draggingNode)!
              const contentElem = view.findOne('foreignObject > body > div')
              Dom.addClass(contentElem, 'validating')
              setTimeout(() => {
                Dom.removeClass(contentElem, 'validating')
                resolve(true)
              }, 3000)
            })
          : true
      },
    })
    this.graph = graph
  }

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget
    const type = target.getAttribute('data-type')
    const node =
      type === 'rect'
        ? this.graph.createNode({
            width: 100,
            height: 40,
            attrs: {
              label: {
                text: 'Rect',
                fill: '#6a6c8a',
              },
              body: {
                stroke: '#31d0c6',
                strokeWidth: 2,
              },
            },
          })
        : this.graph.createNode({
            width: 60,
            height: 60,
            shape: 'html',
            html: () => {
              const wrap = document.createElement('div')
              wrap.style.width = '100%'
              wrap.style.height = '100%'
              wrap.style.display = 'flex'
              wrap.style.alignItems = 'center'
              wrap.style.justifyContent = 'center'
              wrap.style.border = '2px solid rgb(49, 208, 198)'
              wrap.style.background = '#fff'
              wrap.style.borderRadius = '100%'
              wrap.innerText = 'Circle'
              return wrap
            },
          })

    this.dnd.start(node, e.nativeEvent as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  dndContainerRef = (container: HTMLDivElement) => {
    this.dndContainer = container
  }

  render() {
    return (
      <div className="app">
        <div className="dnd-wrap" ref={this.dndContainerRef}>
          <div
            data-type="rect"
            className="dnd-rect"
            onMouseDown={this.startDrag}
          >
            Rect
          </div>
          <div
            data-type="circle"
            className="dnd-circle"
            onMouseDown={this.startDrag}
          >
            Circle
          </div>
        </div>

        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
