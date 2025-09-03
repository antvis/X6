import type { Graph } from '../../graph'

export interface MiniMapViewGeometry extends Record<string, number> {
  top: number
  left: number
  width: number
  height: number
}

export interface MinimapEventData {
  frameId?: number
  action: 'zooming' | 'panning'
  clientX: number
  clientY: number
  scrollLeft: number
  scrollTop: number
  zoom: number
  scale: { sx: number; sy: number }
  geometry: MiniMapViewGeometry
  translateX: number
  translateY: number
}

export interface MiniMapOptions {
  container: HTMLElement
  width: number
  height: number
  padding: number
  scalable?: boolean
  minScale?: number
  maxScale?: number
  createGraph?: (options: Graph.Options) => Graph
  graphOptions?: Graph.Options
}
