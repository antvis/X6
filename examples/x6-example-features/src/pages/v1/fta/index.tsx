import React from 'react'
import { joint } from '@antv/x6'
import {
  Connector,
  IntermediateEvent,
  UndevelopedEvent,
  BasicEvent,
  ExternalEvent,
  ConditioningEvent,
} from './shapes'
import '../../index.less'
import '../index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new joint.Graph({
      container: this.container,
      width: 1000,
      height: 800,
      sorting: 'sorting-approximate',
      defaultConnectionPoint: { name: 'boundary', args: { extrapolate: true } },
      defaultConnector: { name: 'rounded' },
      defaultRouter: { name: 'orth' },
      async: true,
      interactive: false,
      frozen: true,
    })

    var events = [
      IntermediateEvent.create('Fall from Scaffolding').gate('inhibit'),
      IntermediateEvent.create('Fall from the Scaffolding', 'and').gate('and'),
      IntermediateEvent.create('Safety Belt Not Working', 'or').gate('or'),
      IntermediateEvent.create('Fall By Accident', 'or').gate('or'),
      IntermediateEvent.create('Broken By Equipment', 'or').gate('or'),
      IntermediateEvent.create('Did not Wear Safety Belt', 'or').gate('or'),
      UndevelopedEvent.create('Slip and Fall'),
      UndevelopedEvent.create('Lose Balance'),
      UndevelopedEvent.create('Upholder Broken'),
      BasicEvent.create('Safety Belt Broken'),
      BasicEvent.create('Forgot to Wear'),
      ExternalEvent.create('Take off When Walking'),
      ConditioningEvent.create('Height and Ground Condition'),
    ]

    var links = [
      Connector.create(events[0], events[1]),
      Connector.create(events[1], events[2]),
      Connector.create(events[1], events[3]),
      Connector.create(events[2], events[4]),
      Connector.create(events[2], events[5]),
      Connector.create(events[3], events[6]),
      Connector.create(events[3], events[7]),
      Connector.create(events[4], events[8]),
      Connector.create(events[4], events[9]),
      Connector.create(events[5], events[10]),
      Connector.create(events[5], events[11]),
      Connector.create(events[0], events[12]),
    ]

    // function layout() {
    //   const autoLayoutElements: joint.Node[] = []
    //   const manualLayoutElements: joint.Node[] = []
    //   graph.model.getNodes().forEach(cell => {
    //     if (cell instanceof ConditioningEvent) {
    //       manualLayoutElements.push(cell)
    //     } else {
    //       autoLayoutElements.push(cell)
    //     }
    //   })

    //   // Automatic Layout
    //   joint.layout.DirectedGraph.layout(
    //     graph.model.getSubGraph(autoLayoutElements),
    //     {
    //       setVertices: true,
    //       marginX: 20,
    //       marginY: 20,
    //     },
    //   )
    //   // Manual Layout
    //   manualLayoutElements.forEach(node => {
    //     const neighbor = graph.model.getNeighbors(node, { incoming: true })[0]
    //     if (!neighbor) {
    //       return
    //     }

    //     const neighborPosition = neighbor.getBBox().getBottomRight()
    //     node.setPosition(
    //       neighborPosition.x + 20,
    //       neighborPosition.y - node.getSize().height / 2 - 20,
    //     )
    //   })
    // }

    graph.model.resetCells([...events, ...links] as any)
    graph.unfreeze()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
