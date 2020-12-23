import React from 'react'
import { Graph } from '@antv/x6'
import { Layout } from '@antv/layout'
import data from './data'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const lcircularLayout = new Layout({
      type: 'circular',
      width: 480,
      height: 240,
      center: [140, 140],
    })
    const lmodel = lcircularLayout.layout({
      nodes: data.lnodes,
    })

    const rcircularLayout = new Layout({
      type: 'circular',
      width: 480,
      height: 240,
      center: [440, 140],
    })
    const rmodel = rcircularLayout.layout({
      nodes: data.rnodes,
    })

    graph.fromJSON({
      nodes: lmodel.nodes!.concat(rmodel.nodes!),
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
