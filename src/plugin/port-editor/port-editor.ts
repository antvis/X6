import { CssLoader } from '../../common'
import type { Graph, GraphPlugin } from '../../graph'
import type { Node } from '../../model'
import { collectOutlineElements, findNearestOutlinePoint } from './outline'
import { Overlay } from './overlay'
import { content } from './style/raw'
import type {
  Point,
  PortEditorOptions,
  ResolvedPortEditorOptions,
} from './type'

const DEFAULT_GROUP_CONFIG = {
  position: 'absolute',
  markup: [
    {
      tagName: 'circle',
      selector: 'circle',
    },
  ],
  attrs: {
    circle: {
      r: 4.5,
      magnet: true,
      stroke: '#5F95FF',
      strokeWidth: 1.5,
      fill: '#FFFFFF',
    },
  },
  zIndex: 2,
}

const DEFAULTS: Omit<
  ResolvedPortEditorOptions,
  'className' | 'outlineSelector'
> & {
  className?: string
  outlineSelector?: string
} = {
  group: 'pin',
  idPrefix: 'pin',
  positionUnit: 'local',
  sampleCount: 240,
  autoCreateGroup: true,
  groupConfig: DEFAULT_GROUP_CONFIG,
  deleteBadge: true,
  stopAfterAdd: false,
  blockNodeMove: true,
  blockPanning: true,
}

interface AddHit {
  node: Node
  local: Point
}

/**
 * PortEditor — interactive pin editing for AntV X6, implemented as a plugin.
 *
 * Closed loop: enter add-pin mode → move the pointer over an element's outline → click to
 * create a pin exactly there → drag a wire from that pin (native X6 magnet behaviour) →
 * hover the pin and click "×" to remove it.
 *
 * Uses public X6 API only: `graph.use()` / `node.addPort()` / `node.removePort()` /
 * `graph.options.connecting.validateMagnet`. No X6 core change is required.
 */
export class PortEditor implements GraphPlugin {
  public name = 'port-editor'

  private graph!: Graph
  private options!: ResolvedPortEditorOptions
  private overlay!: Overlay

  private adding = false
  private hit: AddHit | null = null
  private badgeTarget: { node: Node; portId: string } | null = null

  private hadPrevValidateMagnet = false
  private prevValidateMagnet: unknown = undefined
  private hadPrevInteracting = false
  private prevInteracting: unknown = undefined
  private wasPannable = false
  private pressAt: { x: number; y: number } | null = null

  private warned = new Set<string>()
  private pendingOptions?: PortEditorOptions
  private nodeByElement = new WeakMap<Element, Node>()

  /**
   * X6 never binds a native `mousemove` on cell views (there is not a single `mousemove`
   * listener in the core), so `node:mousemove` only fires while dragging. Tracking the
   * pointer over an outline therefore requires a container-level listener — that is what
   * this handler is.
   */
  private onContainerMouseMove = (e: MouseEvent) => {
    if (!this.adding) return

    // a button is held → this is a wire drag (or a node drag), not a hover: leave it to X6
    if (typeof e.buttons === 'number' && e.buttons !== 0) {
      this.hit = null
      this.overlay.hidePreview()
      return
    }

    const target = e.target as Element | null

    // hovering the badge itself must not reset the hover state
    if (
      target &&
      target.classList &&
      target.classList.contains('x6-pe-delete')
    ) {
      return
    }

    const portEl = this.findPortElement(target)
    if (portEl) {
      this.hit = null
      this.overlay.hidePreview()
      if (this.options.deleteBadge) {
        const portId = portEl.getAttribute('port')
        if (portId) {
          const node = this.nodeFromElement(portEl)
          if (node) {
            const rect = portEl.getBoundingClientRect()
            this.badgeTarget = { node, portId }
            this.overlay.showBadge(
              {
                x: rect.left + rect.width / 2 + 11,
                y: rect.top + rect.height / 2 - 11,
              },
              () => {
                const badge = this.badgeTarget
                this.badgeTarget = null
                if (badge) this.removePin(badge.node, badge.portId)
              },
            )
          }
        }
      }
      return
    }

    this.overlay.hideBadge()
    this.badgeTarget = null

    const node = this.nodeUnderPointer(e)
    if (!node) {
      this.hit = null
      this.overlay.hidePreview()
      return
    }

    const hit = this.hitTest(node, e.clientX, e.clientY)
    if (!hit) {
      this.hit = null
      this.overlay.hidePreview()
      return
    }

    this.hit = { node, local: hit.local }
    this.overlay.showPreview(hit.client)
  }

  /**
   * X6 Selection's node box is `pointer-events: auto` and covers the element outline — i.e.
   * exactly where pins live. With it enabled, pressing a pin after selecting the element
   * cannot start a wire. Warn once instead of silently rewriting the host's plugin config.
   */
  private warnAboutSelectionBox() {
    const graph = this.graph as unknown as { getPlugin?: (name: string) => any }
    if (typeof graph.getPlugin !== 'function') return
    const selection = graph.getPlugin('selection')
    if (!selection) return

    const options = (selection.options || {}) as Record<string, unknown>
    const boxInteractive =
      options.showNodeSelectionBox === true && options.pointerEvents !== 'none'
    if (boxInteractive) {
      this.warnOnce(
        'selection-box',
        'X6 Selection 的节点选框会盖住元件轮廓（引脚所在处），选中元件后按引脚可能无法起线。' +
          '建议 new Selection({ pointerEvents: "none" }) 或 showNodeSelectionBox: false。' +
          '（本插件自身的点击与落点判定走 elementsFromPoint，可穿透覆盖层）',
      )
    }
  }

  /**
   * Click handling is done on the container (not via X6's `node:click`) on purpose:
   * overlays such as X6 Selection's box (`div.x6-widget-selection-box`, which is
   * `pointer-events: auto` and sits exactly on the element outline) swallow the click, so
   * `node:click` never fires when a node is selected. Hit testing goes through
   * `elementsFromPoint`, which sees the node under the overlay.
   */
  private onContainerMouseDown = (e: MouseEvent) => {
    this.pressAt = { x: e.clientX, y: e.clientY }
  }

  private onContainerClick = (e: MouseEvent) => {
    if (!this.adding) return

    const target = e.target as Element | null
    if (target && target.classList && target.classList.contains('x6-pe-delete'))
      return
    if (this.findPortElement(target)) return

    // a drag (not a click): don't turn it into a pin
    if (this.pressAt) {
      const moved = Math.hypot(
        e.clientX - this.pressAt.x,
        e.clientY - this.pressAt.y,
      )
      if (moved > 5) return
    }

    const node = this.nodeFromClientPoint(e.clientX, e.clientY)
    if (!node) return

    const hit =
      this.hit && this.hit.node === node
        ? this.hit
        : this.hitTest(node, e.clientX, e.clientY)
    if (!hit) return

    this.addPin(node, hit.local)
    if (this.options.stopAfterAdd) this.stopAdding()
  }

  private onContainerMouseLeave = () => {
    if (!this.adding) return
    this.hit = null
    this.overlay.hidePreview()
    // the delete badge is deliberately kept: it is an explicit click target outside the node
  }

  private onGraphTransform = () => {
    // stale markers would drift once the viewport or a node moves
    this.hit = null
    this.overlay.hideAll()
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.adding) return
    if (e.key === 'Escape') this.stopAdding()
  }

  constructor(options?: PortEditorOptions) {
    this.pendingOptions = options
  }

  init(graph: Graph, options?: PortEditorOptions) {
    this.graph = graph
    this.options = {
      ...DEFAULTS,
      ...(this.pendingOptions || {}),
      ...(options || {}),
    } as ResolvedPortEditorOptions

    CssLoader.ensure(this.name, content)
    this.overlay = new Overlay(graph, this.options.className)

    graph.on('scale', this.onGraphTransform)
    graph.on('translate', this.onGraphTransform)
    graph.on('resize', this.onGraphTransform)

    this.warnAboutSelectionBox()

    return this
  }

  // #region mode

  startAdding() {
    if (this.adding || !this.graph) return this
    this.adding = true
    const container = this.graph.container as HTMLElement
    container.classList.add('x6-pe-adding')
    container.addEventListener('mousemove', this.onContainerMouseMove, true)
    container.addEventListener('mouseleave', this.onContainerMouseLeave, true)
    container.addEventListener('mousedown', this.onContainerMouseDown, true)
    container.addEventListener('click', this.onContainerClick, true)
    this.installMagnetGuard()
    this.installNodeMoveGuard()
    this.installPanningGuard()
    document.addEventListener('keydown', this.onKeyDown)
    if (this.options.onModeChange) this.options.onModeChange(true)
    return this
  }

  stopAdding() {
    if (!this.adding) return this
    this.adding = false
    this.hit = null
    this.badgeTarget = null
    this.overlay.hideAll()
    const container = this.graph.container as HTMLElement
    container.classList.remove('x6-pe-adding')
    container.removeEventListener('mousemove', this.onContainerMouseMove, true)
    container.removeEventListener(
      'mouseleave',
      this.onContainerMouseLeave,
      true,
    )
    container.removeEventListener('mousedown', this.onContainerMouseDown, true)
    container.removeEventListener('click', this.onContainerClick, true)
    this.pressAt = null
    this.restoreMagnetGuard()
    this.restoreNodeMoveGuard()
    this.restorePanningGuard()
    document.removeEventListener('keydown', this.onKeyDown)
    if (this.options.onModeChange) this.options.onModeChange(false)
    return this
  }

  isAdding() {
    return this.adding
  }

  /** Alias so the plugin plays well with `graph.enablePlugins()`. */
  enable() {
    return this.startAdding()
  }

  disable() {
    return this.stopAdding()
  }

  // #endregion

  // #region pins

  getPins(node: Node) {
    return node.getPorts().filter((port) => port.group === this.options.group)
  }

  addPin(node: Node, local: Point) {
    const model = (
      this.graph as unknown as {
        model?: { startBatch?: Function; stopBatch?: Function }
      }
    ).model
    if (model && typeof model.startBatch === 'function')
      model.startBatch('port-editor:add-pin')
    try {
      this.ensureGroup(node)
      const portId = this.nextPortId(node)
      node.addPort({
        id: portId,
        group: this.options.group,
        args: this.toPortArgs(node, local),
      })
      if (this.options.onPortAdded) {
        this.options.onPortAdded({ node, portId })
      }
      return portId
    } finally {
      if (model && typeof model.stopBatch === 'function')
        model.stopBatch('port-editor:add-pin')
    }
  }

  addPinAtClient(node: Node, clientX: number, clientY: number) {
    const hit = this.hitTest(node, clientX, clientY)
    if (!hit) return null
    return this.addPin(node, hit.local)
  }

  /** 屏幕坐标下的元件（用于拖拽落点判定）。 */
  findNodeAtClient(clientX: number, clientY: number) {
    return this.nodeFromClientPoint(clientX, clientY)
  }

  /**
   * 拖拽落点建引脚：在屏幕坐标所在元件的**最近轮廓点**上创建引脚。
   * 没落在任何元件上时返回 null。
   */
  addPinFromDrop(clientX: number, clientY: number, node?: Node) {
    const target = node || this.nodeFromClientPoint(clientX, clientY)
    if (!target) return null
    const hit = this.hitTest(target, clientX, clientY)
    if (!hit) return null
    return this.addPin(target, hit.local)
  }

  /**
   * 给 X6 Dnd 插件用的现成 `validateNode`：把「引脚模板」拖到元件上时生成引脚，
   * 并返回 false 阻止模板节点本身落地。
   *
   * ```ts
   * graph.use(new Dnd({
   *   target: graph,
   *   validateNode: portEditor.createDndDropValidator(),
   * }))
   * ```
   * 默认模板判定：`node.getData().pinTemplate === true` 或 `node.shape === 'pin-dot'`。
   */
  createDndDropValidator(options?: {
    isPinTemplate?: (node: Node) => boolean
  }) {
    const isPinTemplate =
      options && options.isPinTemplate
        ? options.isPinTemplate
        : (node: Node) => {
            const data = node.getData() as { pinTemplate?: boolean } | undefined
            return (
              (data != null && data.pinTemplate === true) ||
              node.shape === 'pin-dot'
            )
          }

    return (droppingNode: Node, ctx?: { targetGraph?: Graph }): boolean => {
      if (!isPinTemplate(droppingNode)) return true

      const targetGraph = (ctx && ctx.targetGraph) || this.graph
      const pos = droppingNode.getPosition()
      const size = droppingNode.getSize()
      // Dnd 已把模板节点放到落点，因此模板中心 ≈ 鼠标落点
      const client = targetGraph.localToClient(
        pos.x + size.width / 2,
        pos.y + size.height / 2,
      )
      this.addPinFromDrop(client.x, client.y)
      return false
    }
  }

  removePin(node: Node, portId: string) {
    if (!node.hasPort(portId)) return this
    const model = (
      this.graph as unknown as {
        model?: { startBatch?: Function; stopBatch?: Function }
      }
    ).model
    // one batch → removing a pin (and the wires X6 drops with it) is a single undo step
    if (model && typeof model.startBatch === 'function')
      model.startBatch('port-editor:remove-pin')
    try {
      node.removePort(portId)
      if (this.options.onPortRemoved) {
        this.options.onPortRemoved({ node, portId })
      }
      return this
    } finally {
      if (model && typeof model.stopBatch === 'function')
        model.stopBatch('port-editor:remove-pin')
    }
  }

  clearPins(node: Node) {
    this.getPins(node)
      .map((port) => port.id)
      .filter((id): id is string => typeof id === 'string')
      .forEach((id) => {
        this.removePin(node, id)
      })
    return this
  }

  // #endregion

  dispose() {
    if (!this.graph) return
    this.stopAdding()
    this.graph.off('scale', this.onGraphTransform)
    this.graph.off('translate', this.onGraphTransform)
    this.graph.off('resize', this.onGraphTransform)
    if (this.overlay) this.overlay.destroy()
    CssLoader.clean(this.name)
  }

  // #region internals

  /** Node whose view container is (or contains) the given DOM element. */
  private nodeFromElement(el: Element) {
    const cached = this.nodeByElement.get(el)
    if (cached) return cached

    // `x6-node` is the class X6 puts on every node view container
    const nodeEl =
      typeof el.closest === 'function' ? el.closest('.x6-node') : null
    if (!nodeEl) return null

    let found: Node | null = null
    this.graph.getNodes().forEach((node) => {
      if (found) return
      const view = node.findView(this.graph)
      if (view && view.container === nodeEl) found = node
    })

    if (found) {
      this.nodeByElement.set(el, found as Node)
      if (nodeEl !== el) this.nodeByElement.set(nodeEl, found as Node)
    }
    return found
  }

  private nodeUnderPointer(e: MouseEvent) {
    return this.nodeFromClientPoint(e.clientX, e.clientY)
  }

  private nodeFromClientPoint(clientX: number, clientY: number) {
    // `elementsFromPoint` (plural) sees *through* overlays such as X6's Dnd dragging
    // container, which is `pointer-events: auto` and therefore hides the graph from the
    // singular `elementFromPoint`.
    const stack: Element[] =
      typeof document.elementsFromPoint === 'function'
        ? (document.elementsFromPoint(clientX, clientY) as Element[])
        : ([document.elementFromPoint(clientX, clientY)].filter(
            Boolean,
          ) as Element[])

    for (let i = 0; i < stack.length; i += 1) {
      const node = this.nodeFromElement(stack[i])
      if (node) return node
    }

    // Fallback: nearest node DOM box within a small halo (handles rotated views and drops
    // that land a few pixels outside the shape).
    const halo = 8
    let best: { node: Node; distance: number } | null = null
    this.graph.getNodes().forEach((node) => {
      const view = node.findView(this.graph)
      if (!view) return
      const rect = view.container.getBoundingClientRect()
      if (
        clientX < rect.left - halo ||
        clientX > rect.right + halo ||
        clientY < rect.top - halo ||
        clientY > rect.bottom + halo
      ) {
        return
      }
      const dx = clientX - (rect.left + rect.width / 2)
      const dy = clientY - (rect.top + rect.height / 2)
      const distance = dx * dx + dy * dy
      if (!best || distance < best.distance) best = { node, distance }
    })

    return best ? (best as { node: Node }).node : null
  }

  private hitTest(node: Node, clientX: number, clientY: number) {
    const view = node.findView(this.graph)
    if (!view) return null

    const container = view.container as SVGGraphicsElement
    const elements = collectOutlineElements(
      view.container,
      this.options.outlineSelector,
    )
    if (elements.length === 0) return null

    return findNearestOutlinePoint(
      container,
      elements,
      clientX,
      clientY,
      this.options.sampleCount,
    )
  }

  private findPortElement(target: EventTarget | null) {
    const el = target as Element | null
    if (!el || typeof el.closest !== 'function') return null
    return el.closest('[port]')
  }

  private nextPortId(node: Node) {
    let index = node.getPorts().length + 1
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const id = `${this.options.idPrefix}-${index}`
      if (!node.hasPort(id)) return id
      index += 1
    }
  }

  /**
   * `normalizePercentage` (X6) treats a bare number in the open interval (0, 1) as a
   * *fraction* of the node size, so keep generated coordinates out of that window.
   */
  private sanitizeLocal(value: number) {
    if (value > 0 && value < 1) {
      return value < 0.5 ? 0 : 1
    }
    return Math.round(value * 100) / 100
  }

  private toPortArgs(node: Node, local: Point) {
    if (this.options.positionUnit === 'percent') {
      const size = node.getSize()
      const x = size.width ? ((local.x / size.width) * 100).toFixed(3) : '0'
      const y = size.height ? ((local.y / size.height) * 100).toFixed(3) : '0'
      return { x: `${x}%`, y: `${y}%` }
    }
    return { x: this.sanitizeLocal(local.x), y: this.sanitizeLocal(local.y) }
  }

  private ensureGroup(node: Node) {
    const groups = (node.prop('ports/groups') || {}) as Record<string, unknown>
    if (groups[this.options.group]) return

    if (!this.options.autoCreateGroup) {
      this.warnOnce(
        `port group "${this.options.group}" missing on node "${node.id}"`,
        `add-pin skipped: node "${node.id}" has no port group "${this.options.group}" and autoCreateGroup is false`,
      )
      return
    }

    node.prop('ports/groups', {
      ...groups,
      [this.options.group]: this.options.groupConfig,
    })
  }

  private warnOnce(key: string, message: string) {
    if (this.warned.has(key)) return
    this.warned.add(key)
    // eslint-disable-next-line no-console
    console.warn(`[x6:port-editor] ${message}`)
  }

  /**
   * In add-pin mode a press on the element body must not start a wire, but a press on an
   * *existing pin* must keep working — otherwise "click to add a pin, then wire it" is
   * impossible without leaving the mode first. X6 reads this option at call time.
   */
  private installMagnetGuard() {
    const options = this.graph.options as Record<string, any>
    if (!options.connecting) {
      options.connecting = {}
    }
    const connecting = options.connecting as Record<string, any>

    this.prevValidateMagnet = connecting.validateMagnet
    this.hadPrevValidateMagnet = typeof connecting.validateMagnet === 'function'

    connecting.validateMagnet = (args: {
      e?: MouseEvent
      magnet?: Element
    }) => {
      if (this.adding && !this.isPortMagnet(args && args.magnet)) {
        return false
      }
      if (this.hadPrevValidateMagnet && args && args.e) {
        return (this.prevValidateMagnet as (a: unknown) => boolean).call(
          this.graph,
          args,
        )
      }
      return true
    }
  }

  private isPortMagnet(magnet?: Element) {
    return !!(
      magnet &&
      typeof magnet.closest === 'function' &&
      magnet.closest('.x6-port')
    )
  }

  /**
   * While adding pins, a press on the element body must not move the node (otherwise a
   * click-to-add turns into a drag of the component). `view.can('nodeMovable')` reads
   * `graph.options.interacting` on every call, so a runtime overlay is safe and leaves no
   * trace on cell data.
   */
  private installNodeMoveGuard() {
    if (!this.options.blockNodeMove) return
    const options = this.graph.options as Record<string, any>
    this.hadPrevInteracting = 'interacting' in options
    this.prevInteracting = options.interacting

    const base = this.prevInteracting
    const resolveBase = (view: unknown): Record<string, any> => {
      let value = base
      if (typeof value === 'function') {
        value = (value as (...a: unknown[]) => unknown).call(this.graph, view)
      }
      if (typeof value === 'boolean') return value ? {} : { nodeMovable: false }
      if (value && typeof value === 'object') return { ...(value as object) }
      return {}
    }

    options.interacting = (view: unknown) => ({
      ...resolveBase(view),
      nodeMovable: false,
    })
  }

  private restoreNodeMoveGuard() {
    if (!this.options.blockNodeMove) return
    const options = this.graph.options as Record<string, any>
    if (this.hadPrevInteracting) {
      options.interacting = this.prevInteracting
    } else {
      delete options.interacting
    }
  }

  /**
   * X6 starts panning on `node:unhandled:mousedown`: when neither a magnet drag nor a node
   * drag consumes the press, the viewport pans silently. In add-pin mode that turns
   * "press the element to add a pin" into "drag the whole canvas".
   */
  private installPanningGuard() {
    if (!this.options.blockPanning) return
    const graph = this.graph as unknown as {
      isPannable?: () => boolean
      disablePanning?: () => void
    }
    this.wasPannable =
      typeof graph.isPannable === 'function' ? !!graph.isPannable() : false
    if (this.wasPannable && typeof graph.disablePanning === 'function') {
      graph.disablePanning()
    }
  }

  private restorePanningGuard() {
    if (!this.options.blockPanning) return
    const graph = this.graph as unknown as { enablePanning?: () => void }
    if (this.wasPannable && typeof graph.enablePanning === 'function') {
      graph.enablePanning()
    }
  }

  private restoreMagnetGuard() {
    const connecting = this.graph.options.connecting as Record<string, any>
    if (!connecting) return
    if (this.hadPrevValidateMagnet) {
      connecting.validateMagnet = this.prevValidateMagnet
    } else {
      delete connecting.validateMagnet
    }
  }

  // #endregion
}
