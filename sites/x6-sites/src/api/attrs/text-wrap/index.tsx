import * as React from 'react'
import { Graph } from '@antv/x6'
import './index.less'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addNode({
      x: 40,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 40,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 240,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar 中文字符 lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 40,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 440,
      y: 40,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello-test-foo-bar-lint-css-jsvascript-typescript',
          textWrap: {
            width: 144,
            height: 40,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 40,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'Thisissomeveryveryverylong word. Words will break according to usual rules.',
          textWrap: {
            width: 144,
            height: 40,
            ellipsis: true,
          },
        },
      },
    })

    graph.addNode({
      x: 240,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'Thisissomeveryveryverylong word. Words will break according to usual rules.',
          textWrap: {
            width: 144,
            height: 40,
            ellipsis: true,
            breakWord: false,
          },
        },
      },
    })

    graph.addNode({
      x: 440,
      y: 128,
      width: 160,
      height: 48,
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#8f8f8f',
          strokeWidth: 1,
          rx: 5,
          ry: 5,
        },
        label: {
          textAnchor: 'left',
          refX: 8,
          text: 'hello test foo bar lint css jsvascript typescript',
          textWrap: {
            width: 144,
            height: 20,
            ellipsis: true,
          },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="attrs-text-wrap-app">
        <div ref={this.refContainer} className="app-content" />
      </div>
    )
  }
}
