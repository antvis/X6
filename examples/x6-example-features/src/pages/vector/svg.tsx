import React from 'react'
import { SVG } from '@antv/x6-vector'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const svg = new SVG()
    const rect = svg.rect(100, 100).node
    svg.appendTo(this.container)
    rect.animate(
      [{ fill: '#000000' }, { fill: '#0000FF' }, { fill: '#00FFFF' }],
      {
        duration: 3000,
        iterations: Infinity,
      },
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Default Settings</h1>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
