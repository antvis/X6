import React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

const commonAttrs = {
  body: {
    fill: '#fff',
    stroke: '#8f8f8f',
    strokeWidth: 1,
  },
  label: {
    refX: 0.5,
    refY: '100%',
    refY2: 4,
    textAnchor: 'middle',
    textVerticalAnchor: 'top',
  },
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addNode({
      shape: 'rect',
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: 'rect',
      attrs: commonAttrs,
    })

    graph.addNode({
      shape: 'circle',
      x: 180,
      y: 40,
      width: 40,
      height: 40,
      label: 'circle',
      attrs: commonAttrs,
    })

    graph.addNode({
      shape: 'ellipse',
      x: 280,
      y: 40,
      width: 80,
      height: 40,
      label: 'ellipse',
      attrs: commonAttrs,
    })

    graph.addNode({
      shape: 'path',
      x: 420,
      y: 40,
      width: 40,
      height: 40,
      // https://www.svgrepo.com/svg/13653/like
      path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
      attrs: commonAttrs,
      label: 'path',
    })

    graph.addNode({
      shape: 'polygon',
      x: 60,
      y: 150,
      width: 40,
      height: 40,
      points: '100,10 40,198 190,78 10,78 160,198',
      attrs: commonAttrs,
      label: 'polygon',
    })

    graph.addNode({
      shape: 'polyline',
      x: 180,
      y: 150,
      width: 40,
      height: 40,
      label: 'polyline',
      attrs: {
        body: {
          ...commonAttrs.body,
          refPoints: '0,0 0,10 10,10 10,0',
        },
        label: commonAttrs.label,
      },
    })

    graph.addNode({
      shape: 'image',
      x: 290,
      y: 150,
      width: 60,
      height: 40,
      imageUrl:
        'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
      label: 'image',
      attrs: commonAttrs,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="shapes-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
