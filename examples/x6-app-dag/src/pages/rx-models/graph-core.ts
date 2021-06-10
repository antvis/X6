/* eslint-disable class-methods-use-this */
import { Graph, Cell, Node, Edge } from '@antv/x6'
import { Collection } from '@antv/x6/es/model/collection'
import { BehaviorSubject, fromEventPattern, Subscription, merge } from 'rxjs'
import { debounceTime, map, tap, scan } from 'rxjs/operators'
import './graph-core.less'

type X6GraphOptions = ConstructorParameters<typeof Graph>[0]

export type ConnectionRemovedArgs = Collection.EdgeEventArgs['edge:removed']

// 渲染画布参数
interface RenderParams {
  wrapper?: HTMLElement // 外层容器
  container?: HTMLElement // 画布容器
  nodes?: Node.Metadata[]
  edges?: Node.Metadata[]
}

interface Options extends X6GraphOptions {
  wrapper?: HTMLElement
  container?: HTMLElement
  nodes?: any[]
  edges?: any[]
}

interface ContextMenuInfo {
  type: 'edge' | 'graph' | 'node'
  data: any
}

function setCellsSelectedStatus(cells: Cell[], selected: boolean) {
  cells.forEach((cell) => {
    const data = cell.getData<object>() || {}
    cell.setData({ ...data, selected })
  })
}

export class GraphCore<
  N extends Node<Node.Properties> = Node<Node.Properties>,
  E extends Edge<Edge.Properties> = Edge<Edge.Properties>,
> {
  wrapper?: HTMLElement

  container?: HTMLElement

  nodeMetas?: any[] // 传入的 nodes 原始信息

  edgeMetas?: any[] // 传入的 edges 原始信息

  options: Exclude<Options, 'wrapper' | 'nodes' | 'edges'>

  graph?: Graph

  // 当前画布右键点击信息
  contextMenuInfo$: BehaviorSubject<ContextMenuInfo> =
    new BehaviorSubject<ContextMenuInfo>(null as any)

  // 选中的节点
  selectedNodes$: BehaviorSubject<N[]> = new BehaviorSubject<N[]>([])

  // 待复制的节点 id
  copyableNodeId$: BehaviorSubject<string> = new BehaviorSubject<string>('')

  // 窗口大小 resize 的订阅
  private windowResizeSub?: Subscription

  // 右键菜单的订阅
  private contextMenuSub?: Subscription

  // 节点右键菜单的订阅
  private nodeContextMenuSub?: Subscription

  // 选中节点的订阅
  private selectNodeSub?: Subscription

  // 产生连线的订阅
  private connectNodeSub?: Subscription

  // 连线已删除的订阅
  private connectionRemovedSub?: Subscription

  // 节点移动的订阅
  private moveNodesSub?: Subscription

  // 删除节点或连线的订阅
  private deleteNodeOrEdgeSub?: Subscription

  // 复制节点的订阅
  private copyNodeSub?: Subscription

  constructor(options: Options) {
    const { wrapper, container, nodes, edges, ...others } = options
    this.setMeta(options)
    this.options = others
  }

  setMeta(params: Pick<Options, 'wrapper' | 'container' | 'nodes' | 'edges'>) {
    const { wrapper, container, nodes, edges } = params
    if (wrapper) {
      this.setWrapper(wrapper)
    }
    if (container) {
      this.setContainer(container)
    }
    if (nodes) {
      this.setNodes(nodes)
    }
    if (edges) {
      this.setEdges(edges)
    }
  }

  get isMetaValid(): boolean {
    const { wrapper, container, nodeMetas, edgeMetas } = this
    return !!wrapper && !!container && !!nodeMetas && !!edgeMetas
  }

  get nodes(): N[] {
    return (this.graph?.getNodes() || []) as N[]
  }

  setWrapper(wrapper: HTMLElement) {
    this.wrapper = wrapper
  }

  setContainer(container: HTMLElement) {
    this.container = container
    this.options.container = container
  }

  setNodes(nodes: any[]) {
    this.nodeMetas = nodes
  }

  setEdges(edges: any[]) {
    this.edgeMetas = edges
  }

  // 渲染
  render(params: RenderParams) {
    this.setMeta(params)
    if (this.isMetaValid) {
      const { wrapper, options, nodeMetas, edgeMetas } = this
      const width = wrapper!.clientWidth
      const height = wrapper!.clientHeight
      const graph = new Graph({ ...options, width, height })
      this.graph = graph
      nodeMetas!.forEach((nodeMeta) => this.renderNode(nodeMeta))
      edgeMetas!.forEach((edgeMeta) => this.renderEdge(edgeMeta))
      this.afterLayout()
      if (graph.isFrozen()) {
        graph.unfreeze()
      }
      requestAnimationFrame(() => {
        graph.centerContent()
      })

      // 处理窗口缩放
      this.windowResizeSub = fromEventPattern(
        (handler) => {
          window.addEventListener('resize', handler)
        },
        (handler) => {
          window.removeEventListener('resize', handler)
        },
      ).subscribe(this.resizeGraph)

      // 处理右键菜单
      const nodeContextMenuObs = fromEventPattern<ContextMenuInfo>(
        (handler) => {
          graph.on('node:contextmenu', (data) => {
            handler({ type: 'node', data })
          })
        },
        (handler) => {
          graph.off('node:contextmenu', handler)
        },
      )

      const edgeContextMenuObs = fromEventPattern<ContextMenuInfo>(
        (handler) => {
          graph.on('edge:contextmenu', (data) => {
            handler({ type: 'edge', data })
          })
        },
        (handler) => {
          graph.off('edge:contextmenu', handler)
        },
      )
      const graphContextMenuObs = fromEventPattern<ContextMenuInfo>(
        (handler) => {
          graph.on('blank:contextmenu', (data) => {
            handler({ type: 'graph', data })
          })
        },
        (handler) => {
          graph.off('edge:contextmenu', handler)
        },
      )

      this.nodeContextMenuSub = nodeContextMenuObs.subscribe((data) => {
        this.onNodeContextMenu(data)
      })

      this.contextMenuSub = merge<ContextMenuInfo>(
        nodeContextMenuObs,
        edgeContextMenuObs,
        graphContextMenuObs,
      ).subscribe((data) => {
        if (this.validateContextMenu(data)) {
          this.contextMenuInfo$.next(data)
          this.onContextMenu(data)
        }
      })

      // 处理节点选中事件
      this.selectNodeSub = fromEventPattern<{ removed: N[]; selected: N[] }>(
        (handler) => {
          graph.on('selection:changed', handler)
        },
        (handler) => {
          graph.off('selection:changed', handler)
        },
      ).subscribe((args) => {
        const { removed, selected } = args
        setCellsSelectedStatus(removed, false)
        setCellsSelectedStatus(selected, true)
        this.onSelectNodes(selected)
      })

      // 处理产生连线事件
      this.connectNodeSub = fromEventPattern(
        (handler) => {
          graph.on('edge:connected', handler)
        },
        (handler) => {
          graph.off('edge:connected', handler)
        },
      ).subscribe((args) => {
        this.onConnectNode(args)
      })

      // 处理连线删除事件
      this.connectionRemovedSub = fromEventPattern<ConnectionRemovedArgs>(
        (handler) => {
          graph.on('edge:removed', handler)
        },
        (handler) => {
          graph.off('edge:removed', handler)
        },
        // eslint-disable-next-line consistent-return
      ).subscribe((args) => {
        this.onConnectionRemoved(args)
      })

      // 处理节点移动事件
      let moveStarted: boolean = false // 因为需要对移动事件做分片，区分两次移动事件，所以引入一个记录移动开始的变量
      this.moveNodesSub = fromEventPattern(
        (handler) => {
          graph.on('node:change:position', handler)
        },
        (handler) => {
          graph.off('node:change:position', handler)
        },
      )
        .pipe(
          tap((args) => {
            this.onMoveNodeStart(args)
          }),
          scan((accum, args: any) => {
            const currentAccum = !moveStarted ? [] : accum
            const { node } = args
            const { id } = node
            const matchItemIndex = currentAccum.findIndex(
              (item) => item.id === id,
            )
            if (matchItemIndex > -1) {
              currentAccum.splice(matchItemIndex, 1, { id, data: args })
            } else {
              currentAccum.push({ id, data: args })
            }
            return currentAccum
          }, [] as { id: string; data: any }[]),
          tap(() => {
            if (!moveStarted) {
              moveStarted = true
            }
          }),
          debounceTime(300),
          tap(() => {
            if (moveStarted) {
              moveStarted = false
            }
          }),
          map((items) => items.map((item) => item.data)),
        )
        .subscribe((movedNodes: any[]) => {
          this.onMoveNodes(movedNodes)
        })

      // 处理删除节点或连线事件
      this.deleteNodeOrEdgeSub = fromEventPattern(
        (handler) => {
          graph.bindKey(['delete', 'backspace'], handler)
        },
        () => {
          graph.unbindKey(['delete', 'backspace'])
        },
      ).subscribe(() => {
        const selectedCells = graph.getSelectedCells()
        const selectedNodes = selectedCells.filter((cell) =>
          cell.isNode(),
        ) as N[]
        const selectedEdges = selectedCells.filter((cell) =>
          cell.isEdge(),
        ) as E[]
        this.onDeleteNodeOrEdge({ nodes: selectedNodes, edges: selectedEdges })
      })

      // 处理节点复制事件
      this.copyNodeSub = fromEventPattern(
        (handler) => {
          graph.bindKey(['command+c', 'ctrl+c', 'command+v', 'ctrl+v'], handler)
        },
        () => {
          graph.unbindKey(['command+c', 'ctrl+c', 'command+v', 'ctrl+v'])
        },
      ).subscribe((args: any) => {
        const [, action] = args
        const selectedCells: N[] = (graph.getSelectedCells() as N[]).filter(
          (cell) => this.validateNodeCopyable(cell),
        )
        const copyableNodeId = this.copyableNodeId$.getValue()
        let copyableNode: N
        if (copyableNodeId) {
          copyableNode = graph.getCellById(copyableNodeId) as N
        }
        switch (action) {
          case 'command+c':
          case 'ctrl+c':
            if (selectedCells?.length) {
              this.setCopyableNodeId(selectedCells[0].id) // 当前只支持单节点的复制粘贴
            }
            break
          case 'command+v':
          case 'ctrl+v':
            // @ts-ignore
            if (copyableNode) {
              this.onCopyNode(copyableNode)
            }
            break
          default:
        }
      })
    } else {
      this.throwRenderError()
    }
  }

  renderNode(nodeMeta: any): N | undefined {
    return this.graph!.addNode(nodeMeta) as N
  }

  renderEdge(edgeMeta: any): E | undefined {
    return this.graph!.addEdge(edgeMeta) as E
  }

  afterLayout() {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] call afterLayout')
    }
  }

  resizeGraph = () => {
    const { graph, wrapper } = this
    if (graph && wrapper) {
      requestAnimationFrame(() => {
        const width = wrapper.clientWidth
        const height = wrapper.clientHeight
        graph.resize(width, height)
      })
    }
  }

  validateContextMenu(data: ContextMenuInfo): boolean {
    return !!data
  }

  onContextMenu(data: ContextMenuInfo): any {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] context menu info:', data)
    }
  }

  onNodeContextMenu(data: ContextMenuInfo): any {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] context menu info:', data)
    }
  }

  onSelectNodes(nodes: N[]) {
    this.selectedNodes$.next(nodes)
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] select nodes:', nodes)
    }
  }

  onConnectNode(args: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] connect node:', args)
    }
  }

  onConnectionRemoved(args: ConnectionRemovedArgs) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] delete connection:', args)
    }
  }

  onMoveNodeStart(args: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] move node start:', args)
    }
  }

  onMoveNodes(args: any[]) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] move nodes:', args)
    }
  }

  // 按下删除键的回调，默认参数为当前选中的节点和边
  onDeleteNodeOrEdge(args: { nodes: N[]; edges: E[] }) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] delete node or edge:', args)
    }
  }

  // 校验节点是否可复制，为 true 则可被用于复制
  validateNodeCopyable(node: N) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] validate node copyable:', node)
    }
    return true
  }

  // 按下粘贴键的回调，默认参数为待复制的节点
  onCopyNode(copyNode: N) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GraphCore] copy node:', copyNode)
    }
  }

  /* 以下为主动触发的方法 */
  addNode = (nodeMeta: any) => {
    this.nodeMetas?.push(nodeMeta)
    return this.renderNode(nodeMeta)
  }

  addEdge = (edgeMeta: any) => {
    this.edgeMetas?.push(edgeMeta)
    return this.renderEdge(edgeMeta)
  }

  getNodeById = (nodeId: string): N | undefined => {
    const node = this.graph?.getCellById(nodeId) as N
    if (node?.isNode()) {
      return node
    }
    return undefined
  }

  getNodes = (): N[] => {
    return (this.graph?.getNodes() as N[]) || []
  }

  getEdgeById = (nodeId: string): E | undefined => {
    const edge = this.graph?.getCellById(nodeId) as E
    if (edge?.isEdge()) {
      return edge
    }
    return undefined
  }

  getEdges = (): E[] => {
    return (this.graph?.getEdges() as E[]) || []
  }

  getCellById = (cellId: string): N | E | undefined => {
    const cell = this.graph?.getCellById(cellId) as N | E
    if (cell?.isNode() || cell?.isEdge()) {
      return cell
    }
    return undefined
  }

  getCells = (): (N | E)[] => {
    return (this.graph?.getCells() as (N | E)[]) || []
  }

  updateNodeById = (nodeId: string, handler: (node?: N) => void) => {
    handler(this.getNodeById(nodeId))
  }

  updateNodes = (handler: (nodes: N[]) => void) => {
    handler(this.getNodes())
  }

  updateEdgeById = (edgeId: string, handler: (node?: E) => void) => {
    const edge = this.graph?.getCellById(edgeId) as E
    if (edge?.isEdge()) {
      handler(edge)
    } else {
      handler(undefined)
    }
  }

  updateEdges = (handler: (edges: E[]) => void) => {
    const edges = (this.graph?.getEdges() as E[]) || []
    handler(edges)
  }

  // 删除节点
  deleteNodes = (nodes: (Node | string)[] | Node | string) => {
    const target = ([] as (Node | string)[]).concat(nodes)
    // @ts-ignore
    this.nodeMetas = this.nodeMetas.filter(
      (nodeMeta) => !target.includes(nodeMeta.id),
    )
    this.graph?.removeCells(target)
  }

  // 删除边
  deleteEdges = (edges: (Edge | string)[] | Edge | string) => {
    const target = ([] as (Edge | string)[]).concat(edges)
    const targetIds = target.map((i) => (typeof i === 'string' ? i : i.id))
    // @ts-ignore
    this.edgeMetas = this.edgeMetas.filter(
      (edgeMeta) => !targetIds.includes(edgeMeta.id),
    )
    this.graph?.removeCells(target)
  }

  // 清空右键菜单信息
  clearContextMenuInfo = () => {
    this.contextMenuInfo$.next(null as any)
  }

  // 缩放画布
  zoom = (factor: number | 'fit' | 'real') => {
    if (typeof factor === 'number') {
      this.graph?.zoom(factor)
    } else if (factor === 'fit') {
      this.graph?.zoomToFit({ padding: 12 })
    } else if (factor === 'real') {
      this.graph?.scale(1)
      this.graph?.centerContent()
    }
  }

  // 切换可框选模式
  toggleSelectionEnabled = (enabled?: boolean) => {
    const { graph } = this
    if (graph) {
      const needEnableRubberBand: boolean =
        typeof enabled === 'undefined' ? !graph.isRubberbandEnabled() : enabled
      if (needEnableRubberBand) {
        graph.disablePanning()
        graph.enableRubberband()
        // graph.scroller.widget?.setCursor('crosshair', { silent: true })
      } else {
        graph.enablePanning()
        graph.disableRubberband()
        // graph.scroller.widget?.setCursor('grab', { silent: true })
      }
    }
  }

  // 选中节点
  selectNodes = <T extends string | number>(ids: T | T[]) => {
    const { graph } = this
    if (graph) {
      const target = ([] as any[]).concat(ids).map((i) => i.toString())
      graph.cleanSelection()
      graph.select(target)
      if (!Array.isArray(ids)) {
        const cell = graph.getCellById(ids as string)
        graph.scrollToCell(cell)
      }
    }
  }

  // 清除选中节点
  unSelectNode = () => {
    const { graph } = this
    if (graph) {
      graph.cleanSelection()
    }
  }

  // redo
  redo = () => {
    const { graph } = this
    if (graph) {
      graph.redo()
    }
  }

  // undo
  undo = () => {
    const { graph } = this
    if (graph) {
      graph.undo()
    }
  }

  // 设置待复制的节点 id
  setCopyableNodeId = (id: string) => {
    this.copyableNodeId$.next(id)
  }

  // 抛出渲染中遇到的阻断
  throwRenderError = () => {
    if (!this.wrapper) {
      throw new Error('Wrapper element is needed.')
    }
    if (!this.container) {
      throw new Error('Container element is needed.')
    }
    if (!this.nodeMetas) {
      throw new Error('NodeMetas could not be empty')
    }
    if (!this.edgeMetas) {
      throw new Error('EdgeMetas could not be empty')
    }
  }

  // 注销
  dispose() {
    this.windowResizeSub?.unsubscribe()
    this.contextMenuSub?.unsubscribe()
    this.nodeContextMenuSub?.unsubscribe()
    this.selectNodeSub?.unsubscribe()
    this.connectNodeSub?.unsubscribe()
    this.connectionRemovedSub?.unsubscribe()
    this.moveNodesSub?.unsubscribe()
    this.deleteNodeOrEdgeSub?.unsubscribe()
    this.copyNodeSub?.unsubscribe()

    // ! 这一步要注意放在图的事件订阅都取消了之后
    if (this.wrapper) {
      const graphScroller = this.wrapper.querySelector('.x6-graph-scroller')
      if (graphScroller) {
        graphScroller.innerHTML = ''
        graphScroller.setAttribute('style', '')
        graphScroller.setAttribute('class', '')

        if (this.container) {
          this.container.innerHTML = ''
          this.container.setAttribute('style', '')
          this.container.setAttribute('class', '')
        }
      }
      this.graph?.dispose()
    }
  }
}
