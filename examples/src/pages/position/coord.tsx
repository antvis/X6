import React from 'react'
import { Graph } from '@antv/x6'
import '../index.less'

export class CoordExample extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    graph.fromJSON([
      {
        id: 'node1',
        shape: 'rect',
        x: 100,
        y: 100,
        width: 80,
        height: 40,
        label: 'hello',
      },
      {
        id: 'node2',
        shape: 'rect',
        x: 240,
        y: 300,
        width: 80,
        height: 40,
        label: 'world',
      },
      {
        shape: 'edge',
        source: 'node1',
        target: 'node2',
      },
    ])

    graph.scale(0.5)
    graph.translate(20, 20)
    console.log(graph.getGraphArea())
    console.log(graph.getContentArea())
    console.log(graph.getContentBBox())

    const v = document.createElement('div')
    const h = document.createElement('div')
    const c = document.createElement('div')

    v.style.position = 'absolute'
    v.style.top = '0'
    v.style.height = '5000%'
    v.style.borderLeft = '1px dashed red'

    h.style.position = 'absolute'
    h.style.height = '1px'
    h.style.width = `5000%`
    h.style.borderTop = '1px dashed red'

    c.style.position = 'absolute'
    c.style.display = 'inline-block'
    c.style.fontSize = '12px'
    c.style.background = 'rgba(255,255,255,0.9)'

    document.body.appendChild(v)
    document.body.appendChild(h)
    document.body.appendChild(c)

    document.addEventListener('mousemove', (e) => {
      const pageX = e.pageX
      const pageY = e.pageY
      const clientX = e.clientX
      const clientY = e.clientY

      v.style.left = `${pageX + 2}px`
      h.style.top = `${pageY + 2}px`

      c.style.left = `${pageX + 10}px`
      c.style.top = `${pageY + 10}px`

      const p1 = graph.pageToLocal(pageX, pageY)
      const p2 = graph.localToGraph(p1)

      c.innerHTML = `
      <div>Page(pageX, pageY): ${pageX} x ${pageY}</div>
      <div>Client(clientX, clientY): ${clientX} x ${clientY}</div>
      <div>Local Point: ${p1.x} x ${p1.y}</div>
      <div>Graph Point: ${p2.x} x ${p2.y}</div>
      `
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap" style={{ width: 3000, height: 3000 }}>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
