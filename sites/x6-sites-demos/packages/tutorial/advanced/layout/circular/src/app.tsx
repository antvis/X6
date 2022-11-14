import React from 'react'
import { Graph } from '@antv/x6'
import { CircularLayout } from '@antv/layout'
import './app.css'

const data: any = {
  lnodes: [],
  rnodes: [],
}

for (let i = 1; i <= 24; i++) {
  data.lnodes.push({
    id: i,
    shape: 'rect',
    width: 24,
    height: 24,
    label: '💜',
    attrs: {
      body: {
        stroke: 'transparent',
      },
    },
  })
  data.rnodes.push({
    id: i + 30,
    shape: 'path',
    width: 26,
    height: 26,
    attrs: {
      body: {
        d: 'M0,-9.898961565145173L2.222455340918111,-3.0589473502942863L9.41447190108659,-3.058947350294287L3.596008280084239,1.1684139180159865L5.818463621002351,8.008428132866873L4.440892098500626e-16,3.7810668645565997L-5.8184636210023495,8.008428132866873L-3.5960082800842383,1.1684139180159867L-9.41447190108659,-3.058947350294285L-2.2224553409181116,-3.058947350294286Z',
        fill: '#ffffff',
        stroke: '#8921e0',
      },
    },
  })
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const lcircularLayout = new CircularLayout({
      type: 'circular',
      width: 480,
      height: 240,
      center: [140, 140],
    })
    const lmodel = lcircularLayout.layout({
      nodes: data.lnodes,
    })

    const rcircularLayout = new CircularLayout({
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
