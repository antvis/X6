/* tslint:disable no-this-assignment */
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { ANT_PREFIX } from '@/constants/global'
import classnames from 'classnames'
import { BehaviorSubject, fromEventPattern, timer, Subscription } from 'rxjs'
import { filter, take } from 'rxjs/operators'
import { round } from 'lodash-es'
import produce from 'immer'
import { ConfigProvider, message, Tooltip } from 'antd'
import { RERENDER_EVENT } from '@/constants/graph'
import { GraphCore, ConnectionRemovedArgs } from './graph-core'
import {
  BaseNode,
  X6DemoGroupNode,
  X6DemoNode,
} from '../common/graph-common/shape/node'
import {
  BaseEdge,
  GuideEdge,
  X6DemoGroupEdge,
} from '../common/graph-common/shape/edge'
import { NodeElement } from '../dag-canvas/elements/node-element'
import { NodeGroup } from '../dag-canvas/elements/node-group'
import { NExecutionStatus, NExperiment, NExperimentGraph } from './typing'
import {
  expandGroupAccordingToNodes,
  formatGraphData,
  formatNodeInfoToNodeMeta,
} from './graph-util'
import { queryGraph, addNode, copyNode } from '@/mock/graph'
import { queryGraphStatus, runGraph, stopGraphRun } from '@/mock/status'

export function parseStatus(data: NExecutionStatus.ExecutionStatus) {
  const { execInfo, instStatus } = data
  Object.entries(execInfo).forEach(([id, val]) => {
    // 更新execInfo中的执行状态，后端可能不同步
    // eslint-disable-next-line no-param-reassign
    val.jobStatus = instStatus[id]
  })
  return data
}

type NodeMeta = ReturnType<typeof formatGraphData>['nodes'][number]

type EdgeMeta = ReturnType<typeof formatGraphData>['edges'][number]

interface NodeDataMap {
  [nodeInstanceId: string]: NExperimentGraph.Node
}

class ExperimentGraph extends GraphCore<BaseNode, BaseEdge> {
  // 重新声明节点元信息的类型
  nodeMetas?: NodeMeta[]

  // 重新声明边的元信息的类型
  edgeMetas?: EdgeMeta[]

  // 等待渲染的节点，由于初次渲染 group 时需要 group 内的节点和边都渲染完成，因此放到 afterLayout 里面渲染 group
  pendingNodes: BaseNode[] = []

  // 实验 id
  experimentId: string

  // 实验图加载状态
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  // 实验图运行状态
  running$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  // 实验数据
  experiment$: BehaviorSubject<NExperiment.Experiment> = new BehaviorSubject<
    NExperiment.Experiment
  >(null as any)

  // 实验图数据
  experimentGraph$: BehaviorSubject<
    NExperimentGraph.ExperimentGraph
  > = new BehaviorSubject<NExperimentGraph.ExperimentGraph>(null as any)

  // 当前选中节点
  activeNodeInstance$: BehaviorSubject<
    NExecutionStatus.ActiveNode
  > = new BehaviorSubject<NExecutionStatus.ActiveNode>(null as any)

  // 当前执行状态
  executionStatus$: BehaviorSubject<
    NExecutionStatus.ExecutionStatus
  > = new BehaviorSubject<NExecutionStatus.ExecutionStatus>(null as any)

  // 当前弹窗
  activeModal$: BehaviorSubject<
    NExperimentGraph.ModalParams | undefined
  > = new BehaviorSubject<NExperimentGraph.ModalParams | undefined>(null as any)

  // 当前选中的群组
  selectedGroup$: BehaviorSubject<
    X6DemoGroupNode | undefined
  > = new BehaviorSubject<X6DemoGroupNode | undefined>(undefined)

  // 图数据的订阅
  experimentGraphSub?: Subscription

  // 查询执行状态的定时器订阅
  executionStatusQuerySub?: Subscription

  // 主动触发的重新渲染订阅
  reRenderSub?: Subscription

  constructor(expId: string) {
    super({
      frozen: true,
      selecting: {
        enabled: true,
        rubberband: false,
        multiple: true,
        strict: true,
        showNodeSelectionBox: false,
        selectNodeOnMoved: false,
      },
      keyboard: {
        enabled: true,
      },
      connecting: {
        snap: { radius: 10 },
        dangling: false,
        highlight: true,
        connector: 'pai',
        sourceAnchor: 'bottom',
        targetAnchor: 'center',
        connectionPoint: 'anchor',
        createEdge() {
          return new GuideEdge({
            attrs: {
              line: {
                strokeDasharray: '5 5',
                stroke: '#808080',
                strokeWidth: 1,
                targetMarker: {
                  name: 'block',
                  args: {
                    size: '6',
                  },
                },
              },
            },
          })
        },
        validateEdge: (args) => {
          const { edge } = args
          return !!(edge?.target as any)?.port
        },
        // 是否触发交互事件
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'in'
        },
        // 显示可用的链接桩
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          // 不允许连接到自己
          if (sourceView === targetView) {
            return false
          }

          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }

          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }

          // 判断目标链接桩是否可连接
          const portId = targetMagnet.getAttribute('port')!
          const node = targetView!.cell as X6DemoNode
          const port = node.getPort(portId)
          return !(port && port.connected)
        },
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      highlighting: {
        nodeAvailable: {
          name: 'className',
          args: {
            className: 'available',
          },
        },
        magnetAvailable: {
          name: 'className',
          args: {
            className: 'available',
          },
        },
        magnetAdsorbed: {
          name: 'className',
          args: {
            className: 'adsorbed',
          },
        },
      },
      onPortRendered(args) {
        const { port } = args
        const { contentSelectors } = args
        const container = contentSelectors && contentSelectors.content

        const placement = port.group === 'in' ? 'top' : 'bottom'

        if (container) {
          ReactDOM.render(
            (
              <ConfigProvider prefixCls={ANT_PREFIX}>
                <Tooltip
                  title={(port as any).description}
                  placement={placement}
                >
                  <span
                    className={classnames('ais-port', {
                      connected: (port as any).connected,
                    })}
                  />
                </Tooltip>
              </ConfigProvider>
            ) as any,
            container as any,
          )
        }
      },
    })
    this.experimentId = expId
    this.initialize()
  }

  // 获取实验和图及执行状态信息
  async initialize() {
    // tslint:disable-next-line: no-this-assignment
    const { experimentId } = this
    this.loading$.next(true)
    try {
      await this.loadExperiment(experimentId)
      await this.loadExperimentGraph(experimentId)
      await this.loadExecutionStatus(experimentId)
      this.loading$.next(false)
    } catch (e) {
      this.loading$.next(false)
      console.error('加载实验错误', e)
    }
  }

  // 切换实验
  async changeExperiment(id: string) {
    this.experimentId = id
    await this.initialize()
  }

  // 获取实验
  async loadExperiment(experimentId: string) {
    try {
      const res = {
        projectName: 'sre_mpi_algo_dev',
        gmtCreate: '2020-08-18 02:21:41',
        description: '用户流失数据建模demo',
        name: '建模流程DEMO实验',
        id: 353355,
      }
      this.experiment$.next(res)
      return { success: true }
    } catch (e) {
      console.error('加载实验错误', e)
      return { success: false } as any
    }
  }

  // 获取图
  async loadExperimentGraph(experimentId: string) {
    const graphRes = await queryGraph(experimentId)
    this.experimentGraph$.next(graphRes.data as any)
  }
  // 更新图元
  async updateExperimentGraph(
    nodes: NExperimentGraph.Node[] = [],
    links: NExperimentGraph.Link[] = [],
  ) {
    const oldGraph = this.experimentGraph$.getValue()
    const newGraph = produce(oldGraph, (nextGraph: any) => {
      if (nodes.length) {
        nextGraph.nodes.push(...nodes)
      }
      if (links.length) {
        nextGraph.links.push(...links)
      }
    })
    this.experimentGraph$.next(newGraph as any)
  }
  // 删除图元
  async delExperimentGraphElement(
    nodes: string[] = [],
    links: NExperimentGraph.Link[] = [],
  ) {
    const oldGraph = this.experimentGraph$.getValue()
    const newGraph = produce(oldGraph, (nextGraph: any) => {
      if (nodes.length) {
        nextGraph.nodes = oldGraph.nodes.filter(
          (node) => !nodes.includes(node.id.toString()),
        )
      } else {
        nextGraph.links = oldGraph.links.filter((link) => {
          return !links.find((delLink) => {
            return (
              delLink.inputPortId.toString() === link.inputPortId.toString() &&
              delLink.outputPortId.toString() === link.outputPortId.toString()
            )
          })
        })
      }
    })
    this.experimentGraph$.next(newGraph as any)
  }

  // 获取执行状态
  loadExecutionStatus = async (experimentId: string) => {
    this.executionStatusQuerySub?.unsubscribe()
    // 每三秒查询一次执行状态
    this.executionStatusQuerySub = timer(0, 5000).subscribe(
      async (resPromise) => {
        const execStatusRes = await queryGraphStatus()
        this.executionStatus$.next(execStatusRes.data as any)
        this.updateEdgeStatus()
        // 执行完成时停止查询状态
        const { status } = execStatusRes.data
        if (status === 'default') {
          this.running$.next(false)
          this.executionStatusQuerySub?.unsubscribe()
        } else {
          this.running$.next(true)
        }
      },
    )
  }

  // 判断画布是否准备完成（主要用于 react 组件中）
  isGraphReady() {
    return !!this.graph
  }

  // 渲染画布
  renderGraph = (wrapper: HTMLElement, container: HTMLElement) => {
    this.experimentGraphSub = this.experimentGraph$
      .pipe(
        filter((x) => !!x), // 过滤出有效数据
        take(1), // 只做一次挂载渲染
      )
      .subscribe((graphData) => {
        if (!this.graph) {
          const { nodes, edges } = formatGraphData(graphData)
          super.render({
            wrapper,
            container,
            nodes,
            edges,
          })
        }
      })

    // 监听主动触发的重新渲染事件，避免从 IDE 返回后画布消失
    this.reRenderSub = fromEventPattern(
      (handler) => {
        window.addEventListener(RERENDER_EVENT, handler)
      },
      (handler) => {
        window.removeEventListener(RERENDER_EVENT, handler)
      },
    ).subscribe(this.handlerResize as any)
  }

  renderNode(nodeMeta: NodeMeta): BaseNode | undefined {
    const { experimentId } = this
    const { data } = nodeMeta
    const { type, includedNodes = [] } = data as any
    if (type === 'node') {
      const node = this.graph!.addNode(
        new X6DemoNode({
          ...nodeMeta,
          shape: 'ais-rect-port',
          component: <NodeElement experimentId={experimentId} />,
        }),
      ) as BaseNode
      if ((nodeMeta.data as any).hide) {
        this.pendingNodes.push(node)
      }
      return node
    }
    if (type === 'group' && includedNodes?.length) {
      const group = this.graph!.addNode(
        new X6DemoGroupNode({
          ...nodeMeta,
          shape: 'react-shape',
          component: <NodeGroup experimentId={experimentId} />,
        }),
      ) as BaseNode
      includedNodes.forEach((normalNode: any) => {
        const targetNode = this.getNodeById(normalNode.id)
        group.addChild(targetNode!)
      })
      return group
    }
    return undefined
  }

  afterLayout() {
    super.afterLayout()
    this.pendingNodes.forEach((node) => {
      node.hide()
    })
    this.pendingNodes = []
  }

  renderEdge(edgeMeta: EdgeMeta): BaseEdge | undefined {
    const { type } = edgeMeta
    if (type === 'group') {
      return this.graph!.addEdge(new X6DemoGroupEdge(edgeMeta)) as BaseEdge
    }
    return this.graph!.addEdge(new GuideEdge(edgeMeta)) as BaseEdge
  }

  validateContextMenu = (info: NExperimentGraph.ContextMenuInfo): boolean => {
    return !(
      info.type === 'edge' && (info?.data?.edge as BaseEdge)?.isGroupEdge()
    )
  }

  onSelectNodes(nodes: BaseNode[]) {
    const selectedNodes: X6DemoNode[] = nodes.filter(
      (cell) => cell.isNode() && !cell.isGroup(),
    ) as X6DemoNode[]
    const selectedGroups: X6DemoGroupNode[] = nodes.filter(
      (cell) => cell.isNode() && cell.isGroup(),
    )
    if (selectedNodes.length === 1) {
      // 当只选中了一个节点时，激活当前选中项
      const cell = selectedNodes[0]
      const nodeData = cell.getData()
      const currentActiveNode = this.activeNodeInstance$.getValue()
      if (currentActiveNode?.id !== (nodeData as any)?.id) {
        this.activeNodeInstance$.next(nodeData as any)
      }
    } else {
      this.selectedNodes$.next(selectedNodes)
      this.activeNodeInstance$.next(null as any) // 当没选中任何东西时，清空选中的节点信息
    }
    if (selectedGroups.length === 1) {
      this.selectedGroup$.next(selectedGroups[0])
    } else {
      this.selectedGroup$.next(undefined)
    }
  }

  handlerResize = (e: CustomEvent<string>) => {
    if (e.detail === this.experimentId) {
      this.resizeGraph()
    }
  }

  async onConnectNode(args: any) {
    const { edge = {}, isNew } = args
    const { source, target } = edge as any
    if (isNew) {
      // 处理边虚线样式更新的问题。
      const node = args.currentCell as BaseNode
      const portId = edge.getTargetPortId()
      if (node && portId) {
        // 触发 port 重新渲染
        node.setPortProp(portId, 'connected', true)
        // 更新连线样式
        edge.attr({
          line: {
            strokeDasharray: '',
            targetMarker: '',
            stroke: '#808080',
          },
        })
        const data = {
          source: source.cell,
          target: target.cell,
          outputPortId: source.port,
          inputPortId: target.port,
        }
        edge.setData(data)
        this.updateExperimentGraph([], [data])
      }
    }

    return { success: true }
  }

  // eslint-disable-next-line class-methods-use-this
  onConnectionRemoved(args: ConnectionRemovedArgs) {
    try {
      const { edge } = args
      const { target } = edge
      const { cell: nodeId, port: portId } = target as any
      if (nodeId) {
        const targetCell = this.getNodeById(nodeId)!
        if (targetCell) {
          // 触发 port 重新渲染
          targetCell.setPortProp(portId, 'connected', false)
        }
      }
    } catch (error) {
      console.warn(error)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onMoveNodeStart(args: any) {
    const { node }: { node: BaseNode } = args
    const parent = node.getParent()
    const parentData = parent?.getData<any>()
    if (parentData && !parentData?.isCollapsed) {
      expandGroupAccordingToNodes({ moveNodes: [node] })
    }
  }

  async onMoveNodes(movedNodes: any[]) {
    const targetNodes = movedNodes.filter((arg) => {
      const { node } = arg
      return !node.isGroup()
    })
    if (targetNodes?.length) {
      const newPos = targetNodes.map((moveNode: any) => {
        const { current, node } = moveNode
        const { x, y } = current
        const { id } = node
        this.updateNodeById(id, (node?: BaseNode) => {
          node!.setData({ x, y })
        })
        return {
          nodeInstanceId: id,
          posX: round(x),
          posY: round(y),
        }
      })
      const oldGraph = this.experimentGraph$.getValue()
      const newGraph = produce(oldGraph, (nextGraph: any) => {
        newPos.forEach((position) => {
          const { nodeInstanceId, posX, posY } = position
          const matchNode = nextGraph.nodes.find(
            (item: any) => item.id.toString() === nodeInstanceId.toString(),
          )
          if (matchNode) {
            matchNode.positionX = posX
            matchNode.positionY = posY
          }
        })
      })
      this.experimentGraph$.next(newGraph)
    }
  }

  onDeleteNodeOrEdge(args: { nodes: BaseNode[]; edges: GuideEdge[] }) {
    const { nodes, edges } = args
    const normalNodes: X6DemoNode[] = nodes.filter(
      (node) => !node.isGroup(),
    ) as X6DemoNode[]
    if (normalNodes?.length) {
      this.requestDeleteNodes(normalNodes.map((node) => node.id))
    }
    if (edges?.length) {
      this.requestDeleteEdges(edges)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  validateNodeCopyable(cell: BaseNode) {
    return cell?.isNode() && !cell!.isGroup()
  }

  // eslint-disable-next-line consistent-return
  onCopyNode(node: X6DemoNode) {
    try {
      const nodeData = node.getData<any>()
      const res = copyNode(nodeData)
      const newNode = formatNodeInfoToNodeMeta(res as any)
      this.addNode(newNode)
      this.clearContextMenuInfo()
    } catch (error) {
      message.error('复制节点失败，请重试')
    }
  }

  // 更新边的执行状态
  updateEdgeStatus = () => {
    if (this.graph) {
      const { graph } = this
      const executionStatus = this.executionStatus$.getValue()
      const { instStatus } = executionStatus
      const nodeIds = Object.keys(instStatus)
      const runningNodeIds = nodeIds
        .filter((id) => instStatus[id] === 'running')
        .map((i) => i.toString())
      this.updateEdges((edges) => {
        edges.forEach((edge) => {
          const {
            target: { cell: nodeId },
            id,
          } = edge as any
          const view = graph?.findViewByCell(id)
          if (!view) {
            return
          }
          if (runningNodeIds.includes(nodeId.toString())) {
            view!.addClass('edgeProcessing')
          } else {
            view!.removeClass('edgeProcessing')
          }
        })
      })
    }
  }

  // 运行画布或节点
  runGraph = async () => {
    try {
      // tslint:disable-next-line: no-this-assignment
      const { experimentId, nodeMetas = [] } = this
      await runGraph(nodeMetas)
      this.running$.next(true)
      this.clearContextMenuInfo()
      this.loadExecutionStatus(experimentId) // 发起执行状态查询
      return { success: true }
    } catch (e) {
      console.error(`执行失败`, e)
      return { success: false }
    }
  }

  // 停止实验的执行
  stopRunGraph = async () => {
    try {
      const { experimentId } = this
      const stopRes = await stopGraphRun()
      this.running$.next(false)
      this.clearContextMenuInfo()
      this.loadExecutionStatus(experimentId) // 发起执行状态查询
      return stopRes
    } catch (e) {
      console.error(`停止失败`, e)
      return { success: false }
    }
  }

  // 设置自定义算法组件节点
  setActiveAlgoData = (data: any) => {
    if (!data) {
      this.activeNodeInstance$.next(null as any)
      return
    }
    const oldData = this.activeNodeInstance$.getValue()
    this.activeNodeInstance$.next({ ...oldData, ...data }) // 完成两种格式的融合，数据结构更复杂以后，这一句可以变成一个专门的方法
  }

  // 发起请求增加节点
  requestAddNode = async (param: {
    nodeMeta: any
    clientX: number
    clientY: number
  }) => {
    // tslint:disable-next-line: no-this-assignment
    const { graph } = this
    if (graph) {
      const { nodeMeta, clientX, clientY } = param
      const pos = graph.clientToLocal(clientX, clientY)
      const nodeRes = await addNode({ ...nodeMeta, ...pos })
      this.updateExperimentGraph([nodeRes])
      const newNode = formatNodeInfoToNodeMeta(nodeRes as any)
      this.addNode(newNode)
      return { success: true }
    }
    return { success: false } as any
  }

  // 发起请求删除节点
  requestDeleteNodes = async (ids: string[] | string) => {
    const nodeInstanceIds = ([] as string[]).concat(ids)
    if (this.graph && nodeInstanceIds.length) {
      this.deleteNodes(nodeInstanceIds)
      this.clearContextMenuInfo()
      // 如果被选中节点中包含当前打开的配置面板的节点，则取消激活
      const activeNodeInstance = this.activeNodeInstance$.getValue()
      if (
        activeNodeInstance &&
        nodeInstanceIds
          .map((i) => i.toString())
          .includes(activeNodeInstance.id.toString())
      ) {
        this.activeNodeInstance$.next(null as any)
      }
      this.delExperimentGraphElement(nodeInstanceIds, [])
      return { success: true }
    }
    return { success: false }
  }

  // 发起请求删除边
  requestDeleteEdges = async (edges: BaseEdge | BaseEdge[]) => {
    const targetEdges: BaseEdge[] = ([] as any[]).concat(edges)
    console.log(targetEdges)
    this.deleteEdges(targetEdges)
    this.delExperimentGraphElement(targetEdges.map((cell) => cell.getData()))
    return { success: true }
  }

  // 撤销删除节点
  undoDeleteNode = async () => {
    this.undo()
  }

  // 重命名节点
  renameNode = async (nodeInstanceId: string, newName: string) => {
    const renameRes = await { success: true }
    if (renameRes.success) {
      const cell = this.getCellById(nodeInstanceId)
      const data: object = cell!.getData()
      const newData = { ...data, name: newName }
      cell!.setData(newData)
      this.updateExperimentGraph([newData as any])
    }
    return renameRes
  }

  // 缩放特定比例
  zoomGraph = (factor: number) => {
    this.zoom(factor)
  }

  // 缩放到适应画布
  zoomGraphToFit = () => {
    this.zoom('fit')
  }

  // 缩放到实际尺寸
  zoomGraphRealSize = () => {
    this.zoom('real')
  }

  // 从右键菜单删除边
  deleteEdgeFromContextMenu = async (edge: BaseEdge) => {
    await this.requestDeleteEdges(edge)
    this.clearContextMenuInfo()
  }

  // 清除选中节点
  unSelectNode = () => {
    const { graph } = this
    if (graph) {
      graph.cleanSelection()
    }
    this.selectedGroup$.next(null as any)
    this.selectedNodes$.next([])
  }

  // 打开弹窗
  async setModal(params: NExperimentGraph.ModalParams | undefined) {
    this.activeModal$.next(params)
  }

  dispose() {
    this.experimentGraphSub?.unsubscribe()
    this.executionStatusQuerySub?.unsubscribe()
    this.reRenderSub?.unsubscribe()
    super.dispose()
  }
}

export const gModelMap = new Map<string, ExperimentGraph>() // 存储实验图的 model

export const useExperimentGraph = (experimentId: number | string) => {
  const expId = experimentId.toString()
  let existedExperimentGraph = gModelMap.get(expId)
  if (!existedExperimentGraph) {
    existedExperimentGraph = new ExperimentGraph(expId)
    gModelMap.set(expId, existedExperimentGraph)
  }
  return existedExperimentGraph
}

export const useUnmountExperimentGraph = (experimentId: string) => {
  useEffect(() => {
    return () => {
      const existedExperimentGraph = gModelMap.get(experimentId)
      if (existedExperimentGraph) {
        existedExperimentGraph.dispose()
        gModelMap.delete(experimentId)
      }
    }
  }, [experimentId])
}
