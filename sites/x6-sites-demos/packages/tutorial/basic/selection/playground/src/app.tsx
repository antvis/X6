import React from 'react'
import { Graph, JQuery } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
    })

    this.graph.addNode({
      x: 320,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
    })

    const source = this.graph.addNode({
      x: 80,
      y: 50,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 240,
      y: 200,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSettingChanged = (options: State) => {
    this.graph.toggleMultipleSelection(options.multiple)
    this.graph.toggleSelectionMovable(options.movable)
    this.graph.toggleRubberband(options.rubberband)
    this.graph.toggleStrictRubberband(options.strict)
    this.graph.setSelectionFilter(options.filter)
    this.graph.setRubberbandModifiers(options.modifiers as any)
    this.graph.setSelectionDisplayContent(
      options.content
        ? (selection) => {
            return `${selection.length} node${
              selection.length > 1 ? 's' : ''
            } selected.`
          }
        : null,
    )

    JQuery(this.graph.selection.widget.container).toggleClass(
      'my-selection',
      options.className,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
        </div>
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
