import * as React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private v: HTMLDivElement
  private h: HTMLDivElement
  private c: HTMLDivElement

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    const source = this.graph.addNode({
      x: 80,
      y: 80,
      width: 80,
      height: 40,
      label: 'hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = this.graph.addNode({
      x: 240,
      y: 240,
      width: 80,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    this.graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })

    this.onChanged(defaults)
    this.start()
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove)
  }

  onMouseMove = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      this.container.contains(target) ||
      this.container === target ||
      target === this.v ||
      target === this.h ||
      target === this.c
    ) {
      const pageX = e.pageX
      const pageY = e.pageY
      const clientX = e.clientX
      const clientY = e.clientY
      this.v.style.left = `${pageX + 2}px`
      this.h.style.top = `${pageY + 2}px`

      this.c.style.left = `${pageX + 10}px`
      this.c.style.top = `${pageY + 10}px`

      const p1 = this.graph.pageToLocal(pageX, pageY)
      const p2 = this.graph.localToGraph(p1)

      this.c.innerHTML = `
        <div>Page(pageX, pageY): ${pageX} x ${pageY}</div>
        <div>Client(clientX, clientY): ${clientX} x ${clientY}</div>
        <div>Local Point: ${p1.x} x ${p1.y}</div>
        <div>Graph Point: ${p2.x} x ${p2.y}</div>
        `
    } else {
      this.v.style.left = `${-1000}px`
      this.h.style.top = `${-1000}px`
      this.c.style.left = `${-10000}px`
      this.c.style.top = `${-10000}px`
    }
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

    this.v = v
    this.h = h
    this.c = c

    document.addEventListener('mousemove', this.onMouseMove)
  }

  onChanged = (settgins: State) => {
    this.graph.scale(settgins.scale)
    this.graph.translate(settgins.tx, settgins.ty)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="coord-app">
        <div className="app-left">
          <Settings onChange={this.onChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
