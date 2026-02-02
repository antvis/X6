import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Graph, Rectangle } from '@antv/x6'
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

export const GraphExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)
  const effectRef = useRef<ReturnType<typeof createEffect> | null>(null)

  const [contentBBox, setContentBBox] = useState(new Rectangle())
  const [attrs, setAttrs] = useState({
    width: 0,
    height: 0,
    originX: 0,
    originY: 0,
    scaleX: 1,
    scaleY: 1,
  })

  const updateContentBBox = useCallback(() => {
    if (graphRef.current) {
      const bbox = graphRef.current.getContentBBox()
      setContentBBox(bbox)
      effectRef.current?.updateContentBbox(bbox)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 600,
      height: 400,
      grid: { visible: true },
      connecting: {
        connectionPoint: 'anchor',
      },
    })

    render(graph)
    const effect = createEffect(graph)
    effectRef.current = effect
    graphRef.current = graph

    const bbox = graph.getContentBBox()
    setContentBBox(bbox)
    effect.updateContentBbox(bbox)

    const options = graph.options
    setAttrs((prev) => ({
      ...prev,
      width: options.width,
      height: options.height,
      originX: options.x,
      originY: options.y,
    }))

    graph
      .on('scale', ({ sx, sy }) => {
        effect.hideAll()
        setAttrs((prev) => ({
          ...prev,
          scaleX: sx,
          scaleY: sy,
        }))
      })
      .on('translate', ({ tx, ty }) => {
        effect.hideAll()
        setAttrs((prev) => ({
          ...prev,
          originX: tx,
          originY: ty,
        }))
      })
      .on('resize', ({ width, height }) => {
        effect.hideAll()
        setAttrs((prev) => ({
          ...prev,
          width,
          height,
        }))
      })
      .on('cell:change:*', () => {
        updateContentBBox()
      })

    return () => {
      graph.dispose()
      graphRef.current = null
      effectRef.current = null
    }
  }, [updateContentBBox])

  const onBackgroundChanged = (options: Graph.BackgroundManager.Options) => {
    graphRef.current?.drawBackground(options)
  }

  const onGridChanged = (options: Graph.GridManager.Options) => {
    graphRef.current?.drawGrid(options)
  }

  const onGridSizeChanged = (size: number) => {
    graphRef.current?.setGridSize(size)
  }

  const onGraphSizeChanged = (width: number, height: number) => {
    graphRef.current?.resize(width, height)
  }

  const onGraphOriginChanged = (ox: number, oy: number) => {
    graphRef.current?.translate(ox, oy)
    setAttrs((prev) => ({
      ...prev,
      originX: ox,
      originY: oy,
    }))
  }

  const onGraphScaleChanged = (sx: number, sy: number) => {
    graphRef.current?.scale(sx, sy)
    setAttrs((prev) => ({
      ...prev,
      scaleX: sx,
      scaleY: sy,
    }))
  }

  const onFitOptionsChanged = (options: any) => {
    if (graphRef.current && effectRef.current) {
      if (!options.allowNewOrigin) {
        delete options.allowNewOrigin
      }
      effectRef.current.removeAll()
      graphRef.current.fitToContent(options)
      effectRef.current.afterFit(graphRef.current, options)
    }
  }

  const onScaleContentChanged = (options: any) => {
    if (graphRef.current && effectRef.current) {
      effectRef.current.removeAll()
      graphRef.current.scaleContentToFit(options)
      effectRef.current.afterScaleToFit(graphRef.current, options)
    }
  }

  return (
    <div className="x6-example-wrap">
      <div className="left-side">
        <BackgroundCard onChange={onBackgroundChanged} />
        <GridCard onChange={onGridChanged} onGridSizeChange={onGridSizeChanged} />
        <BBoxCard
          x={contentBBox.x}
          y={contentBBox.y}
          width={contentBBox.width}
          height={contentBBox.height}
        />
      </div>
      <div ref={containerRef} className="x6-graph" />
      <div className="right-side">
        <AttributeCard
          attrs={attrs}
          onSizeChange={onGraphSizeChanged}
          onOriginChange={onGraphOriginChanged}
          onScaleChange={onGraphScaleChanged}
        />
        <FitToContentCard onChange={onFitOptionsChanged} />
        <ScaleContentToFitCard onChange={onScaleContentChanged} />
      </div>
    </div>
  )
}
