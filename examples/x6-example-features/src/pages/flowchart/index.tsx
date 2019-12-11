import React from 'react'
import { SplitBox } from '@antv/x6-components'
import { Graph, DomEvent } from '@antv/x6'
import { Sidebar } from './sidebar'
import { GraphToolbar } from './toolbar'
import { createGraph, demo } from './util'
import { Setting } from './setting'
import './index.less'

export default class FlowChart extends React.Component {
  private graph: Graph
  private container: HTMLDivElement

  componentDidMount() {
    DomEvent.disableContextMenu(this.container)
    this.graph = createGraph(this.container)
    demo(this.graph)
    this.setState({ inited: true })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="flowchart-wrap">
        <SplitBox
          split="vertical"
          minSize={200}
          maxSize={-320}
          defaultSize={240}
          primary="first"
        >
          <div className="flowchart-sidebar">
            <div className="flowchart-sidebar-title">流程节点</div>
            <div className="flowchart-sidebar-content">
              {this.graph && <Sidebar graph={this.graph} />}
            </div>
          </div>
          <SplitBox
            split="vertical"
            minSize={200}
            maxSize={-320}
            defaultSize={240}
            primary="second"
          >
            <div className="flowchart-main">
              <div className="flowchart-toolbar">
                {this.graph && <GraphToolbar graph={this.graph} />}
              </div>
              <div className="flowchart-graph">
                <div className="graph" ref={this.refContainer} />
              </div>
            </div>
            {this.graph && <Setting graph={this.graph} />}
          </SplitBox>
        </SplitBox>
      </div>
    )
  }
}
