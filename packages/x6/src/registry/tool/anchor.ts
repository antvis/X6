import { Dom, FunctionExt } from '../../util'
import { Attr } from '../attr'
import { Point } from '../../geometry'
import { Edge } from '../../model/edge'
import { Node } from '../../model/node'
import { EdgeView } from '../../view/edge'
import { CellView } from '../../view/cell'
import { ToolsView } from '../../view/tool'
import * as Util from './util'

class Anchor extends ToolsView.ToolItem<EdgeView, Anchor.Options> {
  protected get type() {
    return this.options.type!
  }

  protected onRender() {
    Dom.addClass(
      this.container,
      this.prefixClassName(`edge-tool-${this.type}-anchor`),
    )

    this.toggleArea(false)
    this.update()
  }

  update() {
    const type = this.type
    const edgeView = this.cellView
    const terminalView = edgeView.getTerminalView(type)
    if (terminalView) {
      this.updateAnchor()
      this.updateArea()
      this.container.style.display = ''
    } else {
      this.container.style.display = 'none'
    }
    return this
  }

  protected updateAnchor() {
    const childNodes = this.childNodes
    if (!childNodes) {
      return
    }

    const anchorNode = childNodes.anchor
    if (!anchorNode) {
      return
    }

    const type = this.type
    const edgeView = this.cellView
    const options = this.options
    const position = edgeView.getTerminalAnchor(type)
    const customAnchor = edgeView.cell.prop([type, 'anchor'])
    anchorNode.setAttribute(
      'transform',
      `translate(${position.x}, ${position.y})`,
    )

    const anchorAttrs = customAnchor
      ? options.customAnchorAttrs
      : options.defaultAnchorAttrs

    if (anchorAttrs) {
      Object.keys(anchorAttrs).forEach((attrName) => {
        anchorNode.setAttribute(attrName, anchorAttrs[attrName] as string)
      })
    }
  }

  protected updateArea() {
    const childNodes = this.childNodes
    if (!childNodes) {
      return
    }

    const areaNode = childNodes.area
    if (!areaNode) {
      return
    }

    const type = this.type
    const edgeView = this.cellView
    const terminalView = edgeView.getTerminalView(type)
    if (terminalView) {
      const terminalCell = terminalView.cell as Node
      const magnet = edgeView.getTerminalMagnet(type)
      let padding = this.options.areaPadding || 0
      if (!Number.isFinite(padding)) {
        padding = 0
      }

      let bbox
      let angle
      let center
      if (terminalView.isEdgeElement(magnet)) {
        bbox = terminalView.getBBox()
        angle = 0
        center = bbox.getCenter()
      } else {
        bbox = terminalView.getUnrotatedBBoxOfElement(magnet as SVGElement)
        angle = terminalCell.getAngle()
        center = bbox.getCenter()
        if (angle) {
          center.rotate(-angle, terminalCell.getBBox().getCenter())
        }
      }

      bbox.inflate(padding)

      Dom.attr(areaNode, {
        x: -bbox.width / 2,
        y: -bbox.height / 2,
        width: bbox.width,
        height: bbox.height,
        transform: `translate(${center.x}, ${center.y}) rotate(${angle})`,
      })
    }
  }

  protected toggleArea(visible?: boolean) {
    if (this.childNodes) {
      const elem = this.childNodes.area as HTMLElement
      if (elem) {
        elem.style.display = visible ? '' : 'none'
      }
    }
  }

  protected onMouseDown(evt: JQuery.MouseDownEvent) {
    if (this.guard(evt)) {
      return
    }
    evt.stopPropagation()
    evt.preventDefault()
    this.graph.view.undelegateEvents()
    if (this.options.documentEvents) {
      this.delegateDocumentEvents(this.options.documentEvents)
    }
    this.focus()
    this.toggleArea(this.options.restrictArea)
    this.cell.startBatch('move-anchor', {
      ui: true,
      toolId: this.cid,
    })
  }

  protected resetAnchor(anchor?: Edge.TerminalCellData['anchor']) {
    const type = this.type
    const cell = this.cell
    if (anchor) {
      cell.prop([type, 'anchor'], anchor, {
        rewrite: true,
        ui: true,
        toolId: this.cid,
      })
    } else {
      cell.removeProp([type, 'anchor'], {
        ui: true,
        toolId: this.cid,
      })
    }
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    const terminalType = this.type
    const edgeView = this.cellView
    const terminalView = edgeView.getTerminalView(terminalType)
    if (terminalView == null) {
      return
    }

    const e = this.normalizeEvent(evt)
    const terminalCell = terminalView.cell
    const terminalMagnet = edgeView.getTerminalMagnet(terminalType)!
    let coords = this.graph.clientToLocal(e.clientX, e.clientY)

    const snapFn = this.options.snap
    if (typeof snapFn === 'function') {
      const tmp = FunctionExt.call(
        snapFn,
        edgeView,
        coords,
        terminalView,
        terminalMagnet,
        terminalType,
        edgeView,
        this,
      )
      coords = Point.create(tmp)
    }

    if (this.options.restrictArea) {
      if (terminalView.isEdgeElement(terminalMagnet)) {
        const pointAtConnection = (terminalView as EdgeView).getClosestPoint(
          coords,
        )
        if (pointAtConnection) {
          coords = pointAtConnection
        }
      } else {
        const bbox = terminalView.getUnrotatedBBoxOfElement(
          terminalMagnet as SVGElement,
        )
        const angle = (terminalCell as Node).getAngle()
        const origin = terminalCell.getBBox().getCenter()
        const rotatedCoords = coords.clone().rotate(angle, origin)
        if (!bbox.containsPoint(rotatedCoords)) {
          coords = bbox
            .getNearestPointToPoint(rotatedCoords)
            .rotate(-angle, origin)
        }
      }
    }

    let anchor
    const anchorFn = this.options.anchor
    if (typeof anchorFn === 'function') {
      anchor = FunctionExt.call(
        anchorFn,
        edgeView,
        coords,
        terminalView,
        terminalMagnet,
        terminalType,
        edgeView,
        this,
      ) as Edge.TerminalCellData['anchor']
    }

    this.resetAnchor(anchor)
    this.update()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onMouseUp(evt: JQuery.MouseUpEvent) {
    this.graph.view.delegateEvents()
    this.undelegateDocumentEvents()
    this.blur()
    this.toggleArea(false)
    const edgeView = this.cellView
    if (this.options.removeRedundancies) {
      edgeView.removeRedundantLinearVertices({ ui: true, toolId: this.cid })
    }
    this.cell.stopBatch('move-anchor', { ui: true, toolId: this.cid })
  }

  protected onDblClick() {
    const anchor = this.options.resetAnchor
    if (anchor) {
      this.resetAnchor(anchor === true ? undefined : anchor)
    }
    this.update()
  }
}

namespace Anchor {
  export interface Options extends ToolsView.ToolItem.Options {
    type?: Edge.TerminalType
    snapRadius?: number
    areaPadding?: number
    restrictArea?: boolean
    resetAnchor?: boolean | Edge.TerminalCellData['anchor']
    removeRedundancies?: boolean
    defaultAnchorAttrs?: Attr.SimpleAttrs
    customAnchorAttrs?: Attr.SimpleAttrs
    snap?: (
      this: EdgeView,
      pos: Point,
      terminalView: CellView,
      terminalMagnet: Element | null,
      terminalType: Edge.TerminalType,
      edgeView: EdgeView,
      toolView: Anchor,
    ) => Point.PointLike
    anchor?: (
      this: EdgeView,
      pos: Point,
      terminalView: CellView,
      terminalMagnet: Element | null,
      terminalType: Edge.TerminalType,
      edgeView: EdgeView,
      toolView: Anchor,
    ) => Edge.TerminalCellData['anchor']
  }
}

namespace Anchor {
  Anchor.config<Anchor.Options>({
    tagName: 'g',
    markup: [
      {
        tagName: 'circle',
        selector: 'anchor',
        attrs: {
          cursor: 'pointer',
        },
      },
      {
        tagName: 'rect',
        selector: 'area',
        attrs: {
          'pointer-events': 'none',
          fill: 'none',
          stroke: '#33334F',
          'stroke-dasharray': '2,4',
          rx: 5,
          ry: 5,
        },
      },
    ],
    events: {
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
      dblclick: 'onDblClick',
    },
    documentEvents: {
      mousemove: 'onMouseMove',
      touchmove: 'onMouseMove',
      mouseup: 'onMouseUp',
      touchend: 'onMouseUp',
      touchcancel: 'onMouseUp',
    },
    customAnchorAttrs: {
      'stroke-width': 4,
      stroke: '#33334F',
      fill: '#FFFFFF',
      r: 5,
    },
    defaultAnchorAttrs: {
      'stroke-width': 2,
      stroke: '#FFFFFF',
      fill: '#33334F',
      r: 6,
    },
    areaPadding: 6,
    snapRadius: 10,
    resetAnchor: true,
    restrictArea: true,
    removeRedundancies: true,
    anchor: Util.getAnchor,
    snap(pos, terminalView, terminalMagnet, terminalType, edgeView, toolView) {
      const snapRadius = toolView.options.snapRadius || 0
      const isSource = terminalType === 'source'
      const refIndex = isSource ? 0 : -1
      const ref =
        this.cell.getVertexAt(refIndex) ||
        this.getTerminalAnchor(isSource ? 'target' : 'source')
      if (ref) {
        if (Math.abs(ref.x - pos.x) < snapRadius) pos.x = ref.x
        if (Math.abs(ref.y - pos.y) < snapRadius) pos.y = ref.y
      }
      return pos
    },
  })
}

export const SourceAnchor = Anchor.define<Anchor.Options>({
  name: 'source-anchor',
  type: 'source',
})

export const TargetAnchor = Anchor.define<Anchor.Options>({
  name: 'target-anchor',
  type: 'target',
})
