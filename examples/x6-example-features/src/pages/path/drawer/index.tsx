import React from 'react'
import { Helmet } from 'react-helmet'
import { PathDrawer } from './drawer'
import '../../index.less'
import './drawer.less'

export default class Example extends React.Component {
  private container: SVGSVGElement

  componentDidMount() {
    new PathDrawer({
      target: this.container,
      pathAttributes: {
        class: 'example-path',
        fill: '#e5e5e5',
        stroke: '#23272d',
        'stroke-width': 2,
      },
      snapRadius: 10,
    })
  }

  refContainer = (container: SVGSVGElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <Helmet>
          <title>Path Drawer</title>
          <meta http-equiv="x-ua-compatible" content="IE=Edge" />
        </Helmet>
        <h1>Path Drawer</h1>
        <div className="x6-graph" style={{ width: 500, height: 400 }}>
          <svg ref={this.refContainer} width="500" height="400" />
        </div>
      </div>
    )
  }
}
