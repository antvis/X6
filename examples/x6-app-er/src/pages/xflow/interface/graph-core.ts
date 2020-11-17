import { Graph as X6Graph, Node } from '@antv/x6';

export interface BaseGraph {
  /**
   * 获取画布默认配置项
   * @returns {Partial<GraphOptions>}
   * @memberof BaseGraph
   */
  getDefaultCfg(): Partial<GraphOptions>;

  /**
   * 更新画布内容
   * @param {GraphData} graphData 画布元素数据
   * @memberof BaseGraph
   */
  updateGraph(graphData: GraphData): void;

  /**
   * 画布缩放
   * @param {number} factor 缩放比例尺
   * @memberof BaseGraph
   */
  zoomGraph(factor: number | 'fit' | 'real'): void;

  /**
   * 移动节点到画布中央
   * @param {(Node | string)} node
   * @memberof BaseGraph
   */
  focusNodeToGraphCenter(node: Node | string): void;

  /**
   * 将Nodes置于画布最前方
   * @param {Node[]} cells
   * @memberof BaseGraph
   */
  bringNodesToFront(nodes: Node[]): void;

  /**
   * 将Nodes置于画布最后方
   * @param {Node[]} cells
   * @memberof BaseGraph
   */
  bringNodesToBack(nodes: Node[]): void;

  /**
   * 清空画布内容
   * @memberof BaseGraph
   */
  clearGraph(): void;

  /**
   * 注册监听事件
   * @param {EventArg[]} events 监听事件集合
   * @memberof BaseGraph
   */
  registerEvent(events: EventArg[]): void;

  /** 设计与实现分离, 扩展更多API */
}

/** 画布配置项 */
export interface GraphOptions extends X6Graph.Options {
  /** 画布容器 */
  container: HTMLElement;
  /** 用户自定义的一些参数 */
  [key: string]: any;
}

/** 画布数据 */
export interface GraphData {
  nodes: NodeConfig[];
  edges: EdgeConfig[];
}

/** 节点配置项 */
export interface NodeConfig {
  id: string;
  /** 节点x坐标 */
  x?: number;
  /** 节点y坐标  */
  y?: number;
  /** 节点宽度 */
  width?: number;
  /** 节点高度 */
  height?: number;
  /** 自定义组件样式  */
  render?: (data: any) => any;
  /** 节点额外数据信息, 建议存放具体业务数据(避免业务字段与默认需要的字段重复) */
  data?: any;
  /**  建议存储一些临时信息, 具体业务数据存放到data中 */
  [key: string]: any;
}

/** 连线配置项 */
export interface EdgeConfig {
  /** 边渲染必须的数据, 边id, 默认是"source-target" */
  id?: string;
  source: string;
  target: string;
  /** 自定义组件样式 */
  render?: (data: any) => any;
  /** 建议存储一些临时信息, 具体业务数据存放到data中 */
  [key: string]: any;
}

/** 事件对象 */
export interface EventArg {
  eventName: EventType;
  handler: Function;
}

/** 全局事件 */
export type EventType =
  | 'scale' // 画布缩放
  | 'graph:mouseenter' // 鼠标进入画布事件
  | 'graph:mouseleave' // 鼠标离开画布事件
  | 'blank:mouseDown' // 鼠标在画布空白区域按下事件
  | 'blank:mouseUp' // 鼠标在画布空白区域抬起事件
  | 'node:added' // 节点在画布中添加完成事件
  | 'node:removed' // 节点在画布中删除完成事件
  | 'edge:added' // 连线在画布中添加完成事件
  | 'edge:removed' // 连线在画布中删除完成事件
  | 'node:mousedown' // 节点在画布中开始随鼠标移动
  | 'node:mousemove' // 节点在画布中随鼠标移动
  | 'node:mouseup' // 节点在画布中随鼠标移动结束
  | 'node:click' // 节点点击事件
  | 'node:dbclick' // 节点双击事件
  | 'edge:connected' // 节点之间连线完成
  | 'selection:changed'; // 当前画布选中的节点/连线变化
