import React from 'react'
import { joint, Rectangle } from '@antv/x6'
import { Grid } from '@antv/x6/es/research/grid'
import '../../index.less'
import '../index.less'
import './index.less'
import { render } from './render'
import { createEffect } from './effect'
import { GridCard } from './grid-card'
import { BBoxCard } from './bbox-card'
import { AttributeCard } from './attribute-card'
import { BackgroundCard } from './background-card'
import { FitToContentCard } from './fit-card'
import { ScaleContentToFitCard } from './scale-card'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private graph: joint.Graph
  private effect: ReturnType<typeof createEffect>

  state = {
    contentBBox: new Rectangle(),
    attrs: {
      width: 0,
      height: 0,
      originX: 0,
      originY: 0,
      scaleX: 1,
      scaleY: 1,
    },
  }

  componentDidMount() {
    this.graph = new joint.Graph({
      container: this.container,
      width: 600,
      height: 400,
      gridSize: 10,
      defaultConnectionPoint: { name: 'anchor' },
    })

    render(this.graph)
    this.effect = createEffect(this.graph)
    this.updateContentBBox()

    const options = this.graph.options
    this.setState({
      attrs: {
        ...this.state.attrs,
        width: options.width,
        height: options.height,
        originX: options.origin.x,
        originY: options.origin.y,
      },
    })

    let attrs = {}
    const getAttrs = (partial: Partial<Example.State['attrs']>) => {
      attrs = {
        ...this.state.attrs,
        ...attrs,
        ...partial,
      }
      return attrs as Example.State['attrs']
    }

    this.graph
      .on('scale', ({ sx, sy }) => {
        this.effect.hideAll()
        this.setState({
          attrs: getAttrs({
            scaleX: sx,
            scaleY: sy,
          }),
        })
      })
      .on('translate', ({ origin }) => {
        this.effect.hideAll()
        this.setState({
          attrs: getAttrs({
            originX: origin.x,
            originY: origin.y,
          }),
        })
      })
      .on('resize', ({ width, height }) => {
        this.effect.hideAll()
        this.setState({
          attrs: getAttrs({ width, height }),
        })
      })
      .on('cell:change:*', () => {
        this.updateContentBBox()
      })
  }

  updateContentBBox() {
    const contentBBox = this.graph.getContentBBox()
    this.setState({ contentBBox })
    this.effect.updateContentBbox(contentBBox)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onBackgroundChanged = (res: joint.Graph.BackgroundOptions) => {
    this.graph.drawBackground(res)
  }

  onGridChanged = (options: Grid.NativeItem) => {
    console.log(options)
    this.graph.setGrid(options)
    this.graph.drawGrid()
  }

  onGridSizeChanged = (size: number) => {
    this.graph.setGridSize(size)
  }

  onGraphSizeChanged = (width: number, height: number) => {
    this.graph.resize(width, height)
  }

  onGraphOriginChanged = (ox: number, oy: number) => {
    this.graph.setOrigin(ox, oy)
  }

  onGraphScaleChanged = (sx: number, sy: number) => {
    this.graph.scale(sx, sy)
  }

  onFitOptionsChanged = (options: FitToContentCard.State) => {
    if (!options.allowNewOrigin) {
      delete options.allowNewOrigin
    }

    this.effect.removeAll()
    this.graph.fitToContent(options)
    this.effect.afterFit(this.graph, options)
  }

  onScaleContentChanged = (options: ScaleContentToFitCard.State) => {
    this.effect.removeAll()
    this.graph.scaleContentToFit(options)
    this.effect.afterScaleToFit(this.graph, options)
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
        <div className="left-side">
          <BackgroundCard onChange={this.onBackgroundChanged} />
          <GridCard
            onChange={this.onGridChanged}
            onGridSizeChange={this.onGridSizeChanged}
          />
          <BBoxCard
            x={this.state.contentBBox.x}
            y={this.state.contentBBox.y}
            width={this.state.contentBBox.width}
            height={this.state.contentBBox.height}
          />
        </div>
        <div className="right-side">
          <AttributeCard
            attrs={this.state.attrs}
            onSizeChange={this.onGraphSizeChanged}
            onOriginChange={this.onGraphOriginChanged}
            onScaleChange={this.onGraphScaleChanged}
          />
          <FitToContentCard onChange={this.onFitOptionsChanged} />
          <ScaleContentToFitCard onChange={this.onScaleContentChanged} />
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}

namespace Example {
  export interface Props {}
  export interface State {
    attrs: {
      width: number
      height: number
      originX: number
      originY: number
      scaleX: number
      scaleY: number
    }
    contentBBox: Rectangle
  }
}
