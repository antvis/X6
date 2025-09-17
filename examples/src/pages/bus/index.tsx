import React from 'react'
import { Graph, Cell } from '@antv/x6'
import { Bus, Connector, Component, Fader, Aux } from './shapes'
import '../index.less'
import './index.less'

export default class Example extends React.Component {
  private container!: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 800,
      translating: {
        restrict: true,
      },
      connecting: {
        connectionPoint: {
          name: 'boundary',
          args: { selector: 'body' },
        },
        anchor: {
          name: 'orth',
        },
        edgeAnchor: {
          name: 'orth',
        },
      },

      interacting: {
        edgeMovable: false,
        edgeLabelMovable: false,
      },
      highlighting: {
        default: {
          name: 'className',
          args: {
            className: 'active',
          },
        },
      },
    })

    function getCellOutbounds(cell: Cell) {
      return [cell].concat(
        graph.model.getNeighbors(cell, { outgoing: true, indirect: true }),
        graph.model.getConnectedEdges(cell, { outgoing: true, indirect: true }),
      )
    }

    function highlight(cell: Cell) {
      getCellOutbounds(cell).forEach((cell) => {
        const view = graph.findViewByCell(cell)
        if (view) {
          view.highlight()
        }
      })
    }

    function unhighlight(cell: Cell) {
      getCellOutbounds(cell).forEach((cell) => {
        const view = graph.findViewByCell(cell)
        if (view) {
          view.unhighlight()
        }
      })
    }

    graph.on('cell:mouseenter', ({ cell }) => highlight(cell))
    graph.on('cell:mouseleave', ({ cell }) => unhighlight(cell))
    graph.on('cell:mousedown', ({ cell }) => unhighlight(cell))

    var bus1 = Bus.create(600, 'Sub-group 1', '#333333')
    var bus2 = Bus.create(625, 'Sub-group 2', '#333333')
    var bus3 = Bus.create(650, 'Sub-group 3', '#333333')
    var bus4 = Bus.create(675, 'Sub-group 4', '#333333')
    var bus5 = Bus.create(700, 'Mix Left', '#ff5964')
    var bus6 = Bus.create(725, 'Mix Right', '#b5d99c')
    var bus7 = Bus.create(750, 'Post-fade Aux', '#35a7ff')
    var bus8 = Bus.create(775, 'Pre-fade Aux', '#6b2d5c')

    var component1 = Component.create(850, 80, 80, 80, 'Stereo Mix').addPort({
      group: 'out',
    })
    var component2 = Component.create(840, 230, 100, 30, 'Pre Aux').addPort({
      group: 'out',
    })
    var component3 = Component.create(840, 180, 100, 30, 'Post Aux').addPort({
      group: 'out',
    })
    var component4 = Component.create(450, 100, 90, 100, 'Output Routing')
    var component5 = Component.create(450, 350, 90, 100, 'Output Routing')
    var component6 = Component.create(
      100,
      130,
      150,
      40,
      'Input Channel',
    ).addPort({ group: 'in' })
    var component7 = Component.create(100, 380, 150, 40, 'Sub-group 1')

    var fader1 = Fader.create(350, 110)
    var fader2 = Fader.create(350, 360)
    var aux1 = Aux.create(420, 220, 'Post-fade Aux')
    var aux2 = Aux.create(350, 260, 'Pre-fade Aux')
    var aux3 = Aux.create(420, 470, 'Post-fade Aux')
    var aux4 = Aux.create(350, 510, 'Pre-fade Aux')

    var connector1 = Connector.create(bus1, component7)
    var connector2 = Connector.create(fader2, component5)
    var connector3 = Connector.create(connector2, aux3)
    var connector4 = Connector.create(fader1, component4)
    var connector5 = Connector.create(connector4, aux1)
    var connector6 = Connector.create(component7, fader2)
    var connector7 = Connector.create(connector6, aux4)
    var connector8 = Connector.create(component6, fader1)
    var connector9 = Connector.create(connector8, aux2)
    var connector10 = Connector.create(bus5, [component1, -10])
    var connector11 = Connector.create(bus6, [component1, 10])
    var connector12 = Connector.create(bus7, component3)
    var connector13 = Connector.create(bus8, component2)
    var connector14 = Connector.create([component4, -40], bus1)
    var connector15 = Connector.create([component4, -24], bus2)
    var connector16 = Connector.create([component4, -8], bus3)
    var connector17 = Connector.create([component4, 8], bus4)
    var connector18 = Connector.create([component4, 24], bus5)
    var connector19 = Connector.create([component4, 40], bus6)
    var connector20 = Connector.create([component5, -20], bus5)
    var connector21 = Connector.create([component5, 20], bus6)
    var connector22 = Connector.create(aux1, bus7)
    var connector23 = Connector.create(aux2, bus8)
    var connector24 = Connector.create(aux3, bus7)
    var connector25 = Connector.create(aux4, bus8)

    // Special Marker
    connector1.attr('line', {
      sourceMarker: {
        type: 'path',
        d: 'M -2 -8 15 0 -2 8 z',
      },
    })

    // Vertices
    connector1.setVertices([{ x: 175, y: 320 }])
    connector3.setVertices([{ x: 400, y: 485 }])
    connector5.setVertices([{ x: 400, y: 235 }])
    connector7.setVertices([{ x: 310, y: 525 }])
    connector9.setVertices([{ x: 310, y: 275 }])

    // Embed vertices
    component7.embed(connector1)
    aux3.embed(connector3 as any)
    aux1.embed(connector5 as any)
    aux4.embed(connector7 as any)
    aux2.embed(connector9 as any)

    graph.model.resetCells([
      bus1,
      bus2,
      bus3,
      bus4,
      bus5,
      bus6,
      bus7,
      bus8,
      component1,
      component2,
      component3,
      component4,
      component5,
      component6,
      component7,
      fader1,
      fader2,
      aux1,
      aux2,
      aux3,
      aux4,
      connector1,
      connector2,
      connector3,
      connector4,
      connector5,
      connector6,
      connector7,
      connector8,
      connector9,
      connector10,
      connector11,
      connector12,
      connector13,
      connector14,
      connector15,
      connector16,
      connector17,
      connector18,
      connector19,
      connector20,
      connector21,
      connector22,
      connector23,
      connector24,
      connector25,
    ] as any)
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
