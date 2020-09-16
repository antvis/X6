import * as React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = this.graph.addNode({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      label: 'hello',
    })

    const target = this.graph.addNode({
      x: 240,
      y: 300,
      width: 80,
      height: 40,
      label: 'world',
    })

    this.graph.addEdge({ source, target })
    this.onChanged(defaults)
    this.start()
  }

  start() {
    const root = document.getElementById('root')!
    const v = document.createElement('div')
    const h = document.createElement('div')
    const c = document.createElement('div')

    v.style.position = 'absolute'
    v.style.width = '1px'
    v.style.top = '0'
    v.style.bottom = '0'
    v.style.left = '-100px'
    v.style.zIndex = `99`
    v.style.borderLeft = '1px dashed red'

    h.style.position = 'absolute'
    h.style.height = '1px'
    h.style.left = '0'
    h.style.right = '0'
    h.style.top = '-100px'
    h.style.zIndex = `99`
    h.style.borderTop = '1px dashed red'

    c.style.position = 'absolute'
    c.style.display = 'inline-block'
    c.style.fontSize = '12px'
    c.style.zIndex = `99`
    c.style.padding = '4px 8px'
    c.style.borderRadius = '2px'
    c.style.lineHeight = '20px'
    c.style.background = '#f6ffed'
    c.style.border = '1px solid #b7eb8f'

    root.appendChild(v)
    root.appendChild(h)
    root.appendChild(c)

    document.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement
      if (
        this.container.contains(target) ||
        this.container === target ||
        target === v ||
        target === h ||
        target === c
      ) {
        const pageX = e.pageX
        const pageY = e.pageY
        const clientX = e.clientX
        const clientY = e.clientY
        v.style.left = `${pageX + 2}px`
        h.style.top = `${pageY + 2}px`

        c.style.left = `${pageX + 10}px`
        c.style.top = `${pageY + 10}px`

        const p1 = this.graph.pageToLocalPoint(pageX, pageY)
        const p2 = this.graph.localToPagePoint(p1)
        const p3 = this.graph.localToClientPoint(p1)
        const p4 = this.graph.localToGraphPoint(p1)

        c.innerHTML = `
      <div>Mouse Page Position(e.pageX, e.pageY): ${pageX} x ${pageY}</div>
      <div>Mouse Client Position(e.clientX, e.clientY): ${clientX} x ${clientY}</div>
      <div>Local Position: ${p1.x} x ${p1.y}</div>
      <div>Local to Page: ${p2.x} x ${p2.y}</div>
      <div>Local to Client: ${p3.x} x ${p3.y}</div>
      <div>Local to Graph: ${p4.x} x ${p4.y}</div>
      `
      } else {
        v.style.left = `${-1000}px`
        h.style.top = `${-1000}px`
        c.style.left = `${-10000}px`
        c.style.top = `${-10000}px`
      }
    })
  }

  onChanged = (settgins: State) => {
    this.graph.scale(settgins.scale)
    this.graph.translate(settgins.tx, settgins.ty)
    document.documentElement.scrollLeft = settgins.scrollLeft
    document.documentElement.scrollTop = settgins.scrollTop
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
