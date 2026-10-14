import type { Graph } from '../../graph'
import type { Point } from './type'

/**
 * Overlay hosted inside the graph container (same sanctioned pattern as X6's own snapline
 * plugin): absolutely positioned, non-interactive except for the delete badge.
 * Markers are placed with client-space coordinates so panning/zooming needs no extra math.
 */
export class Overlay {
  private container: HTMLElement
  private root: HTMLDivElement
  private preview: HTMLDivElement
  private badge: HTMLDivElement
  private onBadgeClick: (() => void) | null = null

  constructor(graph: Graph, className?: string) {
    this.container = graph.container as HTMLElement

    this.root = document.createElement('div')
    this.root.className = className
      ? `x6-pe-overlay ${className}`
      : 'x6-pe-overlay'

    this.preview = document.createElement('div')
    this.preview.className = 'x6-pe-preview'
    this.preview.style.display = 'none'

    this.badge = document.createElement('div')
    this.badge.className = 'x6-pe-delete'
    this.badge.textContent = '×'
    this.badge.style.display = 'none'
    this.badge.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      e.preventDefault()
    })
    this.badge.addEventListener('click', (e) => {
      e.stopPropagation()
      e.preventDefault()
      const callback = this.onBadgeClick
      this.hideBadge()
      if (callback) callback()
    })

    this.root.appendChild(this.preview)
    this.root.appendChild(this.badge)

    if (getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative'
    }
    this.container.appendChild(this.root)
  }

  private toContainerPoint(clientX: number, clientY: number): Point {
    const rect = this.container.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  showPreview(client: Point) {
    const p = this.toContainerPoint(client.x, client.y)
    this.preview.style.left = `${p.x}px`
    this.preview.style.top = `${p.y}px`
    this.preview.style.display = 'block'
  }

  hidePreview() {
    this.preview.style.display = 'none'
  }

  showBadge(client: Point, onDelete: () => void) {
    const p = this.toContainerPoint(client.x, client.y)
    this.badge.style.left = `${p.x}px`
    this.badge.style.top = `${p.y}px`
    this.badge.style.display = 'block'
    this.onBadgeClick = onDelete
  }

  hideBadge() {
    this.badge.style.display = 'none'
    this.onBadgeClick = null
  }

  hideAll() {
    this.hidePreview()
    this.hideBadge()
  }

  destroy() {
    this.root.remove()
  }
}
