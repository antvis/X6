import React from 'react'
import { Graph } from '../../../../src'
import '../index.less'

export class AnimateAlongPathExample extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const node = graph.addNode({
      shape: 'path',
      x: 420,
      y: 40,
      width: 100,
      height: 100,
      // https://www.svgrepo.com/svg/13653/like
      path: 'M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z',
      attrs: {
        body: {
          fill: '#fff',
          stroke: '#8f8f8f',
          strokeWidth: 2,
        },
        text: {
          refX: 0,
          refY: 0,
        },
      },
      label: 'path',
    })

    const view = graph.findViewByCell(node)

    view?.on('view:render', () => {
      view.animateAlongPath('text', {
        dur: '3s',
        repeatCount: 'indefinite',
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap" style={{ height: 500 }}>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
