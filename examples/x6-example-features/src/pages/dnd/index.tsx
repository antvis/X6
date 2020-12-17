import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { Dnd } from '@antv/x6/es/addon/dnd'
import '../index.less'

export default class Example extends React.Component {
  private graph: Graph
  private dnd: Dnd
  private container: HTMLDivElement

  componentDidMount() {
    const graph = (this.graph = new Graph({
      container: this.container,
      width: 800,
      height: 800,
      history: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      grid: {
        visible: true,
      },
      scroller: {
        enabled: true,
        width: 600,
        height: 400,
        pageVisible: true,
        pageBreak: false,
        pannable: true,
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((parent) => {
            const targetBBox = parent.getBBox()
            return targetBBox.containsRect(bbox)
          })
        },
      },
    }))

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 200,
      height: 80,
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
      x: 320,
      y: 240,
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

    graph.on('node:change:parent', (args) => {
      console.log('node:change:parent', args)
    })

    graph.on('node:added', (args) => {
      console.log('node:added', args)
    })

    graph.centerContent()

    this.dnd = new Dnd({
      target: graph,
      animation: true,
      // validateNode: () => {
      //   return false
      // },
      getDragNode(node) {
        console.log('getDragNode', node.clone())
        return node.clone()
      },
      getDropNode(node) {
        console.log('getDropNode', node.clone())
        return node.clone()
      },
      validateNode(node) {
        console.log('validateNode', node)
        return new Promise<boolean>((resolve) => {
          setTimeout(() => resolve(true), 2000)
        })
      },
    })
    this.graph = graph
  }

  onUndo = () => {
    this.graph.undo()
  }

  onRedo = () => {
    this.graph.redo()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
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

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Dnd</h1>
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 40,
            width: 200,
            height: 300,
            padding: 16,
            border: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          <div
            data-type="rect"
            onMouseDown={this.startDrag}
            style={{
              width: 100,
              height: 40,
              border: '2px solid #31d0c6',
              textAlign: 'center',
              lineHeight: '40px',
              margin: 16,
              cursor: 'move',
            }}
          >
            Rect
          </div>
          <div
            data-type="circle"
            onMouseDown={this.startDrag}
            style={{
              width: 60,
              height: 60,
              borderRadius: '100%',
              border: '2px solid #31d0c6',
              textAlign: 'center',
              lineHeight: '60px',
              margin: 16,
              cursor: 'move',
            }}
          >
            Circle
          </div>
        </div>

        <div className="x6-graph-tools">
          <Button.Group>
            <Button onClick={this.onUndo}>Undo</Button>
            <Button onClick={this.onRedo}>Redo</Button>
          </Button.Group>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
