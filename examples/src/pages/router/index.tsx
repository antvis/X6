import React from 'react'
import { Radio } from 'antd'
import { Graph, Edge, EdgeView } from '@antv/x6'
import '../index.less'

export class RouterExample extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private edge: Edge

  state = {
    router: 'manhattan',
    connector: 'rounded',
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 600,
    })

    const source = graph.addNode({
      shape: 'rect',
      position: { x: 50, y: 50 },
      size: { width: 140, height: 70 },
      attrs: {
        body: {
          fill: {
            type: 'linearGradient',
            stops: [
              { offset: '0%', color: '#f7a07b' },
              { offset: '100%', color: '#fe8550' },
            ],
            attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
          },
          stroke: '#ed8661',
          strokeWidth: 2,
        },
        label: {
          text: 'Source',
          fill: '#f0f0f0',
          fontSize: 18,
          fontWeight: 'lighter',
          fontVariant: 'small-caps',
        },
      },
    })

    const target = source
      .clone()
      .translate(750, 400)
      .setAttrByPath('label/text', 'Target')

    graph.addNode(target)

    this.edge = graph.addEdge({
      source,
      target,
      router: { name: this.state.router },
      connector: { name: this.state.connector },
      attrs: {
        connection: {
          stroke: '#333333',
          strokeWidth: 3,
        },
      },
    })

    var obstacle = source
      .clone()
      .translate(300, 100)
      .setAttrs({
        label: {
          text: 'Obstacle',
          fill: '#eee',
        },
        body: {
          fill: {
            stops: [{ color: '#b5acf9' }, { color: '#9687fe' }],
          },
          stroke: '#8e89e5',
          strokeWidth: 2,
        },
      })

    const update = () => {
      const edgeView = graph.findViewByCell(this.edge) as EdgeView
      edgeView.update()
    }

    obstacle.on('change:position', update)

    graph.addNode(obstacle)
    graph.addNode(obstacle.clone().translate(200, 100))
    graph.addNode(obstacle.clone().translate(-200, 150))

    // graph.on('edge:mouseenter', ({ cell, view }) => {
    //   if (cell) {
    //     console.log(cell.toJSON())
    //     view.addTools({
    //       tools: [
    //         {
    //           name: 'vertices',
    //           args: {
    //             snapRadius: 0,
    //             redundancyRemoval: false,
    //           },
    //         },
    //         {
    //           name: 'segments',
    //           args: { stopPropagation: false },
    //         },
    //       ],
    //       name: 'onhover',
    //     })
    //   }
    // })

    // graph.on('edge:mouseleave', ({ view }) => {
    //   if (view.hasTools('onhover')) {
    //     view.removeTools()
    //   }
    // })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onRouterChange = (e: any) => {
    const router = e.target.value
    this.setState({ router })
    if (router === 'none') {
      this.edge.removeRouter()
    } else {
      this.edge.setRouter(router)
    }
  }

  onConnectorChange = (e: any) => {
    const connector = e.target.value
    this.setState({ connector })
    if (connector === 'narmal') {
      this.edge.removeConnector()
    } else {
      this.edge.setConnector(connector)
    }
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <div>
            <span style={{ display: 'inline-block', width: 88 }}>
              Connector:
            </span>
            <Radio.Group
              onChange={this.onConnectorChange}
              value={this.state.connector}
            >
              <Radio.Button value="narmal">Normal</Radio.Button>
              <Radio.Button
                value="smooth"
                disabled={this.state.router !== 'none'}
              >
                Smooth
              </Radio.Button>
              <Radio.Button value="rounded">Rounded</Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ padding: '16px 0' }}>
            <span style={{ display: 'inline-block', width: 88 }}>Router:</span>
            <Radio.Group
              onChange={this.onRouterChange}
              value={this.state.router}
            >
              <Radio.Button value="none">None</Radio.Button>
              <Radio.Button value="orth">Orthogonal</Radio.Button>
              <Radio.Button value="manhattan">Manhattan</Radio.Button>
              <Radio.Button value="metro">Metro</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}

// eslint-disable-next-line
export namespace Example {
  export interface Props {}

  export interface State {
    router: string
    connector: string
  }
}
