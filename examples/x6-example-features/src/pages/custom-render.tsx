import React from 'react'
import ReactDOM from 'react-dom'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        x: 60,
        y: 60,
        width: 80,
        height: 30,
        label: 'Custom',
        render(elem, cell) {
          const rect = elem.querySelector('rect') as SVGRectElement
          rect.style.stroke = '#ff0000'
          rect.style.strokeWidth = '2'
        },
      })
      const node2 = graph.addNode({
        x: 240,
        y: 240,
        width: 80,
        height: 30,
        label: 'Render',
      })

      graph.addEdge({
        source: node1,
        target: node2,
        label: 'Custom Render',
        render(elem) {},
      })

      graph.addNode({
        x: 360,
        y: 160,
        width: 80,
        height: 240,
        shape: 'html',
        html: '12',
        label: false,
        render(elem, cell) {
          const wrap = elem.querySelector('foreignObject > div')
          if (wrap) {
            ReactDOM.unmountComponentAtNode(wrap)
            ReactDOM.render(
              <div
                onClick={() => {
                  console.log(111)
                }}
                style={{ width: '100%', height: '100%' }}
              >
                asd
                <div>
                  <ul>
                    <li>1</li>
                    <li>2</li>
                    <li
                      onClick={() => {
                        console.log(3)
                      }}
                    >
                      3
                    </li>
                    <li>4</li>
                    <li>5</li>
                  </ul>
                </div>
              </div>,
              wrap,
            )
          }
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
