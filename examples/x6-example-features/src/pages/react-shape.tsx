import React from 'react'
import { Graph } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import './index.less'

register()

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.batchUpdate(() => {
      const node1 = graph.addNode({
        x: 32,
        y: 48,
        width: 180,
        height: 40,
        label: false, // no label
        stroke: '#597ef7',
        shape: 'react',
        component: (
          <div
            style={{
              color: '#fff',
              width: '100%',
              height: '100%',
              background: '#597ef7',
              textAlign: 'center',
              lineHeight: '40px',
            }}
          >
            This is a react element
          </div>
        ),
      })

      const node2 = graph.addNode({
        x: 320,
        y: 200,
        width: 120,
        height: 240,
        label: false,
        shape: 'react',
        component: (
          <div
            onClick={() => {
              console.log(111)
            }}
            style={{ width: '100%', height: '100%', padding: 8 }}
          >
            React Event
            <div>
              <ul>
                <li>1</li>
                <li>2</li>
                <li
                  onClick={e => {
                    e.stopPropagation()
                    console.log(3)
                  }}
                >
                  3
                </li>
                <li>4</li>
                <li>5</li>
              </ul>
            </div>
          </div>
        ),
      })

      graph.addEdge({
        source: node1,
        target: node2,
        label: 'Render With React Shape',
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
