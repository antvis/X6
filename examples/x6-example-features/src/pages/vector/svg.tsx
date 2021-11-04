import React from 'react'
import { SVG } from '@antv/x6-vector'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const svg = new SVG()
    svg.rect(100, 100)
    svg.appendTo(this.container)
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
