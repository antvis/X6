import React from 'react'
import { Graph, Node } from '@antv/x6'
import { Universe } from './model'
import { data } from './data'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const model = new Universe()
    const graph = new Graph({
      model,
      container: this.container,
      interacting: false,
      width: 800,
      height: 600,
      scroller: {
        enabled: true,
        padding: 0,
        fitTocontentOptions: {
          allowNewOrigin: 'any',
          padding: 1000,
        },
      },
    })

    graph.lockScroller()
    model.loadConstellations(data)
    graph.updateScroller()

    function focusStars(stars: Node[] = model.getNodes()) {
      graph.transitionToRect(graph.getCellsBBox(stars)!, {
        visibility: 0.8,
        timingFunction: 'ease-out',
        delay: '10ms',
        scaleGrid: 0.05,
      })
    }

    graph.on('cell:mouseup', ({ cell }) => {
      const name = cell.prop('constellation')
      var constellation = model.getConstellation(name)
      focusStars(constellation)
    })

    graph.on('blank:mousedown', () => {
      focusStars()
    })

    graph.on('cell:mouseenter', ({ cell }) => {
      const name = cell.prop('constellation')
      if (name) {
        model.highlightConstellation(name)
      }
    })

    graph.on('cell:mouseleave', ({ cell }) => {
      const name = cell.prop('constellation')
      if (name) {
        model.unhighlightConstellation(name)
      }
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
