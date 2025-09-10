import React from 'react'
import { Graph, Rectangle } from '../../../../src'
import { render } from './render'
import { createEffect } from './effect'
import { GridCard } from './grid-card'
import { BBoxCard } from './bbox-card'
import { AttributeCard } from './attribute-card'
import { BackgroundCard } from './background-card'
import { FitToContentCard } from './fit-card'
import { ScaleContentToFitCard } from './scale-card'
import '../index.less'
import './index.less'

type Props = Record<string, never>
interface State {
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

export class GraphExample extends React.Component<Props, State> {
  private container!: HTMLDivElement
  private graph: Graph
  private effect: ReturnType<typeof createEffect>

  constructor(props: Props) {
    super(props)
    this.container = null!
    this.graph = null!
    this.effect = null!
  }

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
    this.graph = new Graph({
      container: this.container,
      width: 600,
      height: 400,
      grid: { visible: true },
      connecting: {
        connectionPoint: 'anchor',
      },
    })

    render(this.graph)
    this.effect = createEffect(this.graph)
    this.updateContentBBox()

    const options = this.graph.options
    this.setState((prevState) => ({
      attrs: {
        ...prevState.attrs,
        width: options.width,
        height: options.height,
        originX: options.x,
        originY: options.y,
      },
    }))

    let attrs = {}
    const getAttrs = (partial: Partial<State['attrs']>) => {
      attrs = {
        ...this.state.attrs,
        ...attrs,
        ...partial,
      }
      return attrs as State['attrs']
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
      .on('translate', ({ tx, ty }) => {
        this.effect.hideAll()
        this.setState({
          attrs: getAttrs({
            originX: tx,
            originY: ty,
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

  onBackgroundChanged = (options: Graph.BackgroundManager.Options) => {
    this.graph.drawBackground(options)
  }

  onGridChanged = (options: Graph.GridManager.Options) => {
    this.graph.drawGrid(options)
  }

  onGridSizeChanged = (size: number) => {
    this.graph.setGridSize(size)
  }

  onGraphSizeChanged = (width: number, height: number) => {
    this.graph.resize(width, height)
  }

  onGraphOriginChanged = (ox: number, oy: number) => {
    this.graph.translate(ox, oy)
    this.setState((prevState) => ({
      attrs: {
        ...prevState.attrs,
        originX: ox,
        originY: oy,
      },
    }))
  }

  onGraphScaleChanged = (sx: number, sy: number) => {
    this.graph.scale(sx, sy)
    this.setState((prevState) => ({
      attrs: {
        ...prevState.attrs,
        scaleX: sx,
        scaleY: sy,
      },
    }))
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
      <div className="x6-example-wrap">
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
        <div ref={this.refContainer} className="x6-graph" />
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
      </div>
    )
  }
}
