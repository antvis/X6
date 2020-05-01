import React from 'react'
import { v1 } from '@antv/x6'
import '../../index.less'
import '../index.less'

export default class Example extends React.Component {
  private info: HTMLDivElement
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new v1.Graph({
      container: this.container,
      width: 1000,
      height: 600,
    })

    const me = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
    ) => {
      return graph.addNode({
        id,
        type: 'rect',
        name: id,
        x,
        y,
        width,
        height,
        attrs: {
          body: {
            fill: fill || 'blue',
          },
          label: {
            text: id,
            fill: 'white',
            refX: 10,
            refY: 10,
            textAnchor: 'start',
          },
        },
      })
    }

    const ml = (
      id: string,
      source: string,
      target: string,
      vertices?: { x: number; y: number }[],
    ) => {
      return graph.addEdge({
        id,
        source,
        target,
        type: 'edge',
        name: id,
        vertices: vertices,
        labels: [
          {
            position: 0.5,
            attrs: { text: { text: id } },
          },
        ],
      })
    }

    const a = me('a', 100, 30, 420, 200, 'lightblue')
    const aa = me('aa', 130, 50, 160, 140, 'green')
    const aaa = me('aaa', 150, 120, 120, 40, 'gray')
    const c = me('c', 400, 50, 50, 50, 'orange')
    a.addChild(aa)
    aa.addChild(aaa)
    a.addChild(c)

    console.log(aa)

    me('d', 620, 50, 50, 50, 'black')
    const l1 = ml('l1', 'aa', 'c') // auto embed to common ancestor `a`
    console.log(l1)
    ml('l3', 'c', 'd')
    aa.addChild(
      ml('l2', 'aa', 'aaa', [
        { x: 50, y: 110 },
        { x: 50, y: 140 },
      ]),
    )

    const model = graph.model
    graph.on('cell:mouseleave', this.resetInfo)
    graph.on('cell:mouseenter', ({ view }: { view: v1.CellView }) => {
      const cell = view.cell
      const i: { [key: string]: string } = {}
      const toString = (cloned: { [key: string]: v1.Cell }) =>
        Object.keys(cloned)
          .map(id => {
            const cell = cloned[id]
            return cell.prop('name')
          })
          .join(', ')

      let key = `graph.cloneCells([${cell.id}])`
      let cloned = model.cloneCells([cell])
      i[key] = toString(cloned)

      key = `Cell.deepClone(${cell.id})`
      cloned = v1.Cell.deepClone(cell)
      i[key] = toString(cloned)

      key = `${cell.id}.clone({ deep: true })`
      cloned = { [cell.id]: cell.clone({ deep: true }) }
      i[key] = toString(cloned)

      key = `graph.cloneSubGraph([${cell.id}], { deep: true })`
      cloned = model.cloneSubGraph([cell], { deep: true })
      i[key] = toString(cloned)

      key = `graph.getSubGraph([${cell.id}], { deep: true })`
      const cells = model.getSubGraph([cell], { deep: true })
      i[key] = cells.map(c => c.prop('name')).join(', ')

      key = `graph.getConnectedLinks(${cell.id}, { deep: true })`
      const edges = model.getConnectedEdges(cell, { deep: true })
      i[key] = edges.map(c => c.prop('name')).join(', ')

      this.info.innerText = JSON.stringify(i, null, '\t')
    })

    this.resetInfo()
  }

  resetInfo = () => {
    this.info.innerText =
      'Hover over cells to see\nhow cloning and graph search works\non nested graphs.'
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  refInfo = (div: HTMLDivElement) => {
    this.info = div
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          ref={this.refInfo}
          style={{ position: 'fixed', right: 50, bottom: 50 }}
        />
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
