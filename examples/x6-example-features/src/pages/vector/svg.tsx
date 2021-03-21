import React from 'react'
import { Svg } from '@antv/x6-vector'
import '../index.less'

console.log(Svg)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    new Svg().appendTo(this.container)
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
