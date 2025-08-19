import React from 'react'
import { Graph, Interp } from '@antv/x6'
import './index.less'

Graph.registerEdge(
  'custom-edge',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelPositiveConnector',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelNegativeConnector',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelAbsoluteConnector',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelMarker',
      },
      {
        tagName: 'rect',
        selector: 'relativeLabelBody',
      },
      {
        tagName: 'text',
        selector: 'relativeLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteReverseLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteReverseLabel',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelPositiveBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelPositive',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelNegativeBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelNegative',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelAbsoluteBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelAbsolute',
      },
    ],
    attrs: {
      line: {
        connection: true,
        fill: 'none',
        stroke: '#8f8f8f',
        strokeWidth: 2,
        strokeLinejoin: 'round',
        targetMarker: {
          tagName: 'path',
          d: 'M 10 -5 0 0 10 5 z',
        },
      },
      relativeLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      relativeLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteReverseLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteReverseLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelPositive: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelPositiveBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelNegative: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelNegativeBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelAbsolute: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelAbsoluteBody: {
        width: 140,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '＊',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      interacting: false,
    })

    const edge = graph.addEdge({
      shape: 'custom-edge',
      source: { x: 100, y: 60 },
      target: { x: 500, y: 60 },
      vertices: [{ x: 300, y: 160 }],
      attrs: {
        relativeLabel: {
          atConnectionRatio: 0.25,
          text: '0.25',
        },
        relativeLabelBody: {
          atConnectionRatio: 0.25,
        },
        absoluteLabel: {
          atConnectionLength: 150,
          text: '150',
        },
        absoluteLabelBody: {
          atConnectionLength: 150,
        },
        absoluteReverseLabel: {
          atConnectionLength: -100,
          text: '-100',
        },
        absoluteReverseLabelBody: {
          atConnectionLength: -100,
        },
        offsetLabelPositive: {
          atConnectionRatio: 0.66,
          y: 40,
          text: 'keepGradient: 0,40',
        },
        offsetLabelPositiveBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: 30, // 40 + -10
        },
        offsetLabelNegative: {
          atConnectionRatio: 0.66,
          y: -40,
          text: 'keepGradient: 0,-40',
        },
        offsetLabelNegativeBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: -50, // -40 + -10
        },
        offsetLabelAbsolute: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -40,
          y: 80,
          text: 'ignoreGradient: -40,80',
        },
        offsetLabelAbsoluteBody: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -110, // -40 + -70
          y: 70, // 80 + -10
        },
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 200, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 400, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.transition(
        'source',
        { x: 100, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 500, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'vertices/0',
        { x: 300, y: 60 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = false
    }

    contract()

    edge.on('transition:start', () => {
      currentTransitions += 1
    })

    edge.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (oscillateToggle) {
          oscillate()
        } else {
          contract()
        }
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-edge-subelement-labels-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
