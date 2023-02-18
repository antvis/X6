import React from 'react'
import { Cell, Graph, Model } from '@antv/x6'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Selection } from '@antv/x6-plugin-selection'
import { DataTransform } from '@antv/x6-plugin-dataTransform'
import '../index.less'

const fromDsl: Model.FromJSONData = {
  cells: [
    {
      position: {
        x: 50,
        y: 50,
      },
      size: {
        width: 100,
        height: 40,
      },
      attrs: {
        label: {
          text: 'AAA',
        },
      },
      shape: 'rect',
      id: 'a4f84953-14d6-43f2-9a34-df62adbb3994',
      zIndex: 1,
      trans: true,
    },
    {
      position: {
        x: 250,
        y: 50,
      },
      size: {
        width: 100,
        height: 40,
      },
      attrs: {
        label: {
          text: 'BBB',
        },
      },
      shape: 'rect',
      id: '5bb86bd9-ad85-4945-a914-8c4f78ec178f',
      zIndex: 2,
      trans: true,
    },
    {
      position: {
        x: 350,
        y: 150,
      },
      size: {
        width: 100,
        height: 40,
      },
      attrs: {
        label: {
          text: 'CCC',
        },
      },
      shape: 'rect',
      id: '716d4e97-721b-45fd-9f70-983f3a858442',
      zIndex: 3,
      trans: true,
    },
  ],
}

export default class Example extends React.Component<
  {},
  { graph: Graph | undefined }
> {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    this.setState({ graph })

    const selection = new Selection({ enabled: true })
    const keyboard = new Keyboard({ enabled: true })
    const dataTransform = new DataTransform<
      {
        cells: Array<Cell.Properties & { trans: boolean }>
      },
      Model.FromJSONData,
      Model.FromJSONData
    >({
      enabled: true,
      toJsonTransform(JSONData) {
        return { cells: JSONData?.cells?.map((i) => ({ ...i, trans: true })) }
      },
      fromJSONTransform(a) {
        return a
      },
    })

    graph.use(selection)
    graph.use(keyboard)
    graph.use(dataTransform)

    graph.addNode({
      x: 50,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'A' } },
    })

    graph.addNode({
      x: 250,
      y: 50,
      width: 100,
      height: 40,
      attrs: { label: { text: 'B' } },
    })

    graph.addNode({
      x: 350,
      y: 150,
      width: 100,
      height: 40,
      attrs: { label: { text: 'C' } },
    })

    keyboard.bindKey('backspace', () => {
      graph.removeCells(selection.getSelectedCells())
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  toJSON = () => {
    const { graph } = this.state
    const json = graph?.toJSON()
    json?.cells?.forEach((cell) => {
      console.log(`
      cell: ${cell.id},
      trans: ${cell.trans}
      `)
    })
  }

  toJSONWithDiff = () => {
    const { graph } = this.state
    console.log(graph?.toJSON({ diff: true }))
  }

  toJSONWithPlugin = () => {
    const { graph } = this.state
    const transform =
      graph?.getPlugin<
        DataTransform<{ cells: Array<Cell.Properties & { trans: boolean }> }>
      >('dataTransform')
    const json = transform?.toJSON()
    console.log(json)
  }

  fromJSON = () => {
    const { graph } = this.state
    graph?.fromJSONTransform?.(fromDsl)
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
        <button onClick={this.toJSON}>to JSON</button>
        <button onClick={this.fromJSON}>from JSON</button>
        <button onClick={this.toJSONWithDiff}>to JSON with diff</button>
        <button onClick={this.toJSONWithPlugin}>
          to JSON with transform plugin
        </button>
      </div>
    )
  }
}
