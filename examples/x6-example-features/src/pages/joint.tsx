import React from 'react'
import { joint } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({ container: this.container })
    const node = new joint.Node({
      markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
    })

    graph.model.addCell(node)

    console.log(graph)
    // console.log(new joint.Cell())

    console.log(
      new joint.Node({
        markup:
          '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>',
      }),
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return <div ref={this.refContainer} className="graph" />
  }
}
