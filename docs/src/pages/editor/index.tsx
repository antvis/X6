import React from 'react'
import { Editor } from './editor'

export default class Guide extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    new Editor(this.container)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        ref={this.refContainer}
        tabIndex={0}
        className="x6-graph-container"
      />
    )
  }
}
