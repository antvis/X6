import { Graph } from '@antv/x6';
import {
  BaseGraph,
  GraphOptions,
  GraphData,
  NodeConfig,
  EdgeConfig,
  EventArg,
} from '../interface/graph-core';
import Node from '../graph/node';
import Edge from '../graph/edge';
import { CellController, EventController } from '../controller/index';
import _ from 'lodash';
import ReactDOM from 'react-dom';

export default class X6BaseGraph implements BaseGraph {
  public graph!: Graph;
  public cellController!: CellController;
  public eventController!: EventController;

  constructor(graphOptions: GraphOptions) {
    /** 创建X6画布实例 */
    const defaultCfg = this.getDefaultCfg();
    this.graph = new Graph({
      ...defaultCfg,
      ...graphOptions,
    });

    this.init();
  }

  private init() {
    this.cellController = new CellController(this);
    this.eventController = new EventController(this);
  }

  /**
   * 获取画布默认配置项
   * @returns {Partial<GraphOptions>}
   * @memberof X6BaseGraph
   */
  public getDefaultCfg(): Partial<GraphOptions> {
    const defaultCfg: Partial<GraphOptions> = {
      /** 无限画布设置 */
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      /** 画布网格 */
      grid: {
        visible: true,
        size: 20,
        type: 'doubleMesh',
        args: [
          {
            color: '#888',
            // thickness: 1,
          },
          // {
          //   color: '#ddd',
          //   thickness: 1,
          //   factor: 4,
          // },
        ],
      },
      /** 全局连线配置 */
      // connecting: {
      //   anchor: 'midSide',
      //   router: {
      //     name: 'er',
      //   },
      //   // connector: {
      //   //   name: 'smooth',
      //   // },
      // },
      connecting: {
        connector: {
          name: 'rounded',
        },
        router: {
          name: 'er',
          args: {
            direction: 'H',
          },
        },
      },
      /** 对齐线 */
      snapline: {
        enabled: true,
      },
      /** 滚轮缩放 */
      // mousewheel: {
      //   enabled: true,
      //   zoomAtMousePosition: false,
      //   factor: 1.1,
      // },
      keyboard: {
        enabled: true,
      },
      clipboard: {
        enabled: true,
      },
    };
    return defaultCfg;
  }

  /**
   * 更新画布内容
   * @param {GraphData} graphData 画布元素数据
   * @memberof X6BaseGraph
   */
  public updateGraph(graphData: GraphData) {
    if (!graphData) {
      throw new Error('graphData must be defined first!');
    }

    const { addNodesData, addEdgesData } = this.graphContentDiff(graphData);

    this.graph.batchUpdate('updateGraph', () => {
      if (addNodesData && addNodesData.length > 0) {
        this.cellController.addNodes(addNodesData);
      }
      if (addEdgesData && addEdgesData.length > 0) {
        this.cellController.addEdges(addEdgesData);
      }
    });
  }

  /**
   * 画布缩放
   * @param {number} factor 缩放比例尺
   * @memberof X6BaseGraph
   */
  public zoomGraph(factor: number | 'fit' | 'real') {
    if (typeof factor === 'number') {
      this.graph.zoom(factor);
    } else if (factor === 'fit') {
      this.graph.zoomToFit({ padding: 12 });
    } else if (factor) {
      this.graph.scale(1);
      this.graph.centerContent();
    }
  }

  /**
   * 移动节点到画布中央
   * @param {(Node | string)} node
   * @memberof X6BaseGraph
   */
  public focusNodeToGraphCenter(node: Node | string) {
    if (node instanceof Node) {
      this.graph.centerCell(node);
    } else {
      const temp = this.cellController.findNodeById(node);
      if (temp) {
        this.graph.centerCell(temp);
      }
    }
  }

  /**
   * 将Nodes置于画布最前方
   * @param {Node[]} nodes
   * @memberof X6BaseGraph
   */
  public bringNodesToFront(nodes: Node[]) {
    nodes.forEach((node: Node) => {
      node.toBack();
    });
  }

  /**
   * 将Nodes置于画布最后方
   * @param {Node[]} nodess
   * @memberof X6BaseGraph
   */
  public bringNodesToBack(nodes: Node[]) {
    nodes.forEach((node: Node) => {
      node.toBack();
    });
  }

  /**
   * 清空画布内容
   * @memberof X6BaseGraph
   */
  public clearGraph() {
    // todo
  }

  /**
   * 注册监听事件
   * @param {EventArg[]} events
   * @memberof X6BaseGraph
   */
  public registerEvent(events: EventArg[]) {
    this.eventController.registerEvent(events);
  }

  /** 画布内容Diff */
  private graphContentDiff(graphData: GraphData) {
    const { nodes: nodesData, edges: edgesData } = graphData;

    // 新增节点数据
    const addNodesData: NodeConfig[] = [];
    nodesData.forEach((nodeData: NodeConfig) => {
      const findNode = this.cellController.findNodeById(nodeData.id);
      if (!findNode) {
        addNodesData.push(nodeData);
      }
    });

    // 保持、更新、移除的节点
    const retainNodes: Node[] = [];
    const updateNodes: Node[] = [];
    const removeNodes: Node[] = [];
    this.cellController.nodes.forEach((node: Node) => {
      const findNodeData = nodesData.find(
        (nodeData: NodeConfig) => nodeData.id === node.id,
      );
      if (!findNodeData) {
        removeNodes.push(node);
      } else {
        // !!! 目前仅支持节点data数据变化, 才认为更新
        if (_.isEqual(node.data, findNodeData.data)) {
          retainNodes.push(node);
        } else {
          updateNodes.push(node);
          this.cellController.updateNode(node, findNodeData);
        }
      }
    });

    // 新增连线数据
    const addEdgesData: EdgeConfig[] = [];
    edgesData.forEach((edgeData: EdgeConfig) => {
      if (!edgeData.id) {
        return;
      }
      const findEdge = this.cellController.findEdgeById(edgeData.id);
      if (!findEdge) {
        addEdgesData.push(edgeData);
      }
    });

    // 保持、更新、移除的连线
    const retainEdges: Edge[] = [];
    const updateEdges: Edge[] = [];
    const removeEdges: Edge[] = [];
    this.cellController.edges.forEach((edge: Edge) => {
      const findEdgeData = edgesData.find(
        (edgeData: EdgeConfig) => edgeData.id === edge.id,
      );
      if (!findEdgeData) {
        removeEdges.push(edge);
      } else {
        // !!! 目前仅支持连线data数据变化, 才认为更新
        if (_.isEqual(edge.data, findEdgeData.data)) {
          retainEdges.push(edge);
        } else {
          updateEdges.push(edge);
          this.cellController.updateEdge(edge, findEdgeData);
        }
      }
    });

    this.cellController.removeNodes(removeNodes);
    this.cellController.removeEdges(removeEdges);

    return {
      addNodesData,
      addEdgesData,
    };
  }
}
