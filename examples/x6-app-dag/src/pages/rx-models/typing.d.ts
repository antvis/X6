import { EdgeView } from '@antv/x6'

// 实验
export namespace NExperiment {
  export interface Experiment {
    description: string
    name: string
    id: number
    gmtCreate: string
  }
}

// 实验图
export namespace NExperimentGraph {
  export interface ExperimentGraph {
    nodes: Node[]
    groups: Group[]
    links: Link[]
  }

  export interface ModalParams {
    type: string
    experimentId: string
    nodeInstanceId?: number
    node?: Node
    ctx?: any
  }

  export interface ContextMenuInfo {
    type: 'edge' | 'graph'
    data: EdgeView.PositionEventArgs<any>
  }

  export interface Node {
    outPorts: OutPort[]
    inPorts: InPort[]
    catId: number
    positionX: number
    positionY: number
    codeName: string
    category: string
    name: string
    id: string
    nodeInstanceId?: number
    groupId: number
    status: number
  }

  export interface Port {
    sequence: number
    id: string
    description: string
  }

  export interface OutPort extends Port {}

  export interface InPort extends Port {}

  export interface Group {
    isCollapsed: boolean
    experimentId: number
    name: string
    id: number
  }

  export interface Link {
    inputPortId: number
    outputPortId: number
    source: number
    type?: string
    target: number
  }
}

// 执行状态
export namespace NExecutionStatus {
  // 当前选中的组件
  export interface ActiveNode {
    type: 'legacy' | 'algo'
    [k: string]: any
  }

  // 实验的执行状态
  export interface ExecutionStatus {
    instStatus: InstStatus
    execInfo: ExecInfo
    status: string
  }

  export interface InstStatus {
    [k: string]: string
  }

  export interface GroupStatus {}

  export interface ExecInfo {
    [k: string]: ExecDetail
  }

  export interface ExecDetail {
    defName: string
    quickViewData: QuickViewData
    jobStatus: string
    percentage: number
    lastTime: number
    name: string
    startTime: string
    endTime: string
  }

  export interface QuickViewData {}
}

// 模型
export namespace NModel {
  export interface Model {
    codeName: string
    isNew: boolean
    catId: number
    parentId: number
    category: string
    owner: string
    name: string
    id: number
    type: string
  }
}
