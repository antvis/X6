import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      width: 800,
      height: 600,
    })

    const switchCenter = {
      x: 35,
      y: -2,
    }
    const switchOpen = `rotate(-30 ${switchCenter.x} ${switchCenter.y})`
    const switchClose = `rotate(-12 ${switchCenter.x} ${switchCenter.y})`

    graph.addNode({
      x: 80,
      y: 80,
      markup: [
        {
          tagName: 'g',
          selector: 'left-group',
          children: [
            {
              tagName: 'rect',
              selector: 'left',
              groupSelector: 'line',
              attrs: {
                x: 0,
                y: 0,
              },
            },
            {
              tagName: 'circle',
              selector: 'lco',
              groupSelector: 'co',
              attrs: {
                cx: 30,
              },
            },
            {
              tagName: 'circle',
              selector: 'lci',
              groupSelector: 'ci',
              attrs: {
                cx: 30,
              },
            },
          ],
        },
        {
          tagName: 'rect',
          selector: 'switch',
          groupSelector: 'line',
        },
        {
          tagName: 'g',
          selector: 'right-group',
          children: [
            {
              tagName: 'rect',
              selector: 'right',
              groupSelector: 'line',
              attrs: {
                x: 70,
                y: 0,
              },
            },
            {
              tagName: 'circle',
              selector: 'rco',
              groupSelector: 'co',
              attrs: {
                cx: 70,
              },
            },
            {
              tagName: 'circle',
              selector: 'rci',
              groupSelector: 'ci',
              attrs: {
                cx: 70,
              },
            },
          ],
        },
      ],
      attrs: {
        line: {
          width: 30,
          height: 2,
          fill: '#000',
          stroke: '#000',
        },
        co: {
          r: 8,
          fill: '#000',
        },
        ci: {
          r: 4,
          fill: '#fff',
        },
        switch: {
          ...switchCenter,
          width: 35,
          transform: switchOpen,
        },
      },
    })

    graph.on('node:click', ({ node }) => {
      const attrPath = 'attrs/switch/transform'
      const current = node.prop(attrPath)
      const target = current === switchOpen ? switchClose : switchOpen

      node.transition(attrPath, target, {
        interp: (a: string, b: string) => {
          const reg = /-?\d+/g
          const start = parseInt(a.match(reg)![0], 10)
          const end = parseInt(b.match(reg)![0], 10)
          const d = end - start
          return (t: number) => {
            return `rotate(${start + d * t} ${switchCenter.x} ${
              switchCenter.y
            })`
          }
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
