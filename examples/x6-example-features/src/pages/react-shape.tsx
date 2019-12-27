import React from 'react'
import { Graph, Shape, MiniMap } from '@antv/x6'
import { ReactShape } from '@antv/x6-react-shape'
import { randomColor, invertColor } from '../util'
import './index.less'
import './react-shape.less'

Shape.register('react', ReactShape, true)

export default class Example extends React.Component {
  private container: HTMLDivElement
  private minimapContainer: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = (this.graph = new Graph(this.container, {
      infinite: true,
      connection: {
        enabled: true,
        hotspotable: false,
      },
      anchor: {
        inductiveSize: 16,
      },
      getAnchors(cell) {
        if (cell != null && this.model.isNode(cell)) {
          return [
            [0.25, 0],
            [0.5, 0],
            [0.75, 0],

            [0, 0.25],
            [0, 0.5],
            [0, 0.75],

            [1, 0.25],
            [1, 0.5],
            [1, 0.75],

            [0.25, 1],
            [0.5, 1],
            [0.75, 1],
          ]
        }
      },
    }))

    new MiniMap(graph, {
      container: this.minimapContainer,
      viewport: {
        strokeColor: '#31d0c6',
      },
      sizer: {
        visible: false,
        strokeColor: '#31d0c6',
      },
      getCellStyle: cell => {
        if (cell != null && cell.isNode()) {
          const data = cell.getData()
          if (data != null && data.bg != null) {
            return { fill: data.bg, stroke: data.bg }
          }
        }
      },
    })

    graph.batchUpdate(() => {
      const bg1 = randomColor()
      const node1 = graph.addNode({
        x: 48,
        y: 48,
        width: 180,
        height: 40,
        label: false, // no label
        stroke: 'none',
        shape: 'react',
        component: (
          <div
            style={{
              color: invertColor(bg1, true),
              width: '100%',
              height: '100%',
              background: bg1,
              textAlign: 'center',
              lineHeight: '40px',
            }}
            onClick={() => {
              console.log('React Component Clicked')
            }}
          >
            React Component
          </div>
        ),
      })

      const bg2 = randomColor()
      const div = document.createElement('div')
      div.appendChild(document.createTextNode('HTML Component'))
      div.style.width = '100%'
      div.style.height = '100%'
      div.style.display = 'flex'
      div.style.alignItems = 'center'
      div.style.justifyContent = 'center'
      div.style.backgroundColor = bg2
      div.style.color = invertColor(bg2, true)

      const node2 = graph.addNode({
        x: 240,
        y: 240,
        width: 180,
        height: 40,
        label: false,
        shape: 'html',
        stroke: 'none',
        strokeWidth: 10,
        html: div,
      })

      const bg3 = randomColor()
      graph.addNode({
        x: 240,
        y: 320,
        width: 180,
        height: 40,
        label: 'SVG Component',
        strokeWidth: 1,
        stroke: 'none',
        fill: bg3,
        fontColor: invertColor(bg3, true),
      })

      graph.addEdge({
        source: node1,
        target: node2,
        label: 'Label',
      })
    })

    // this.renderSimpleReactShape()
    this.renderComplexReactCompont()
  }

  renderSimpleReactShape() {
    this.graph.batchUpdate(() => {
      for (let i = 0; i < 30; i += 1) {
        for (let j = 0; j < 30; j += 1) {
          const bg = randomColor()
          this.graph.addNode({
            x: 480 + 160 * i,
            y: 48 + 80 * j,
            width: 120,
            height: 40,
            label: false,
            stroke: bg,
            shape: 'react',
            resizable: false,
            data: { bg },
            component: <SimpleComponent text={bg} bg={bg} />,
          })
        }
      }
    })
  }

  renderComplexReactCompont() {
    this.graph.batchUpdate(() => {
      for (let i = 0; i < 20; i += 1) {
        for (let j = 0; j < 20; j += 1) {
          const bg = randomColor()
          this.graph.addNode({
            x: 480 + 300 * i,
            y: 48 + 200 * j,
            width: 240,
            height: 160,
            label: false,
            stroke: 'none',
            shape: 'react',
            resizable: false,
            data: { bg },
            component: <ComplexComponent text={bg} bg={bg} />,
          })
        }
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refMiniMap = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          ref={this.refContainer}
          className="graph"
          style={{ backgroundColor: '#f8f9fa' }}
        />
        <div
          ref={this.refMiniMap}
          style={{
            width: 240,
            height: 200,
            position: 'absolute',
            top: 24,
            right: 24,
            border: '1px solid #e9e9e9',
            zIndex: 999,
            boxShadow: '0 0 2px 1px #e9e9e9',
          }}
        />
      </div>
    )
  }
}

export const SimpleComponent: React.SFC<SimpleComponent.Props> = ({
  text,
  bg,
}) => (
  <div
    className="simple-component"
    style={{
      color: invertColor(bg, true),
      backgroundColor: bg,
    }}
  >
    {text}
  </div>
)

export namespace SimpleComponent {
  export interface Props {
    bg: string
    text: string
  }
}

export const ComplexComponent: React.SFC<ComplexComponent.Props> = ({
  text,
  bg,
}) => (
  <div className="complex-component">
    <div
      className="header"
      style={{
        color: invertColor(bg, true),
        backgroundColor: bg,
      }}
    >
      {text}
    </div>
    <div
      className="list"
      style={{
        borderColor: bg,
      }}
    >
      <div>
        <ul>
          <li>column 1</li>
          <li>column 2</li>
          <li>column 3</li>
          <li>column 4</li>
          <li>column 5</li>
          <li>column 6</li>
          <li>column 7</li>
          <li>column 8</li>
          <li>column 9</li>
          <li>column 10</li>
        </ul>
      </div>
    </div>
  </div>
)

export namespace ComplexComponent {
  export interface Props {
    bg: string
    text: string
  }
}
