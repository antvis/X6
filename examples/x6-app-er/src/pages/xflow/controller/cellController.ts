import { Graph } from '@antv/x6';
import '@antv/x6-react-shape';
import X6BaseGraph from '../graph/baseGraph';
import Node from '../graph/node';
import Edge from '../graph/edge';
import { NodeConfig, EdgeConfig } from '../interface/graph-core';
import _ from 'lodash';

const x6ReactShape = 'react-shape';

export default class CellController {
  private graph: Graph;

  /** 记录画布中的节点 */
  public nodes: Node[] = [];
  /** 记录画布中的连线 */
  public edges: Edge[] = [];

  constructor(x6BaseGraph: X6BaseGraph) {
    this.graph = x6BaseGraph.graph;
  }

  /**
   * 批量添加节点
   * @template T
   * @param {T[]} nodesData 节点数据集合
   * @memberof CellController
   */
  public addNodes<T extends NodeConfig>(nodesData: T[]) {
    nodesData.forEach((nodeData: T) => {
      this.addNode(nodeData);
    });
  }

  /**
   * 添加单个节点
   * @template T
   * @param {T} nodeData 节点数据
   * @memberof CellController
   */
  public addNode<T extends NodeConfig>(nodeData: T) {
    const { id, x, y, width, height, render, data, ...rest } = nodeData;
    const newNode: Node = this.graph.addNode({
      id,
      x: x ? x : 0,
      y: y ? y : 0,
      width: width ? width : 100,
      height: height ? height : 60,
      data: data ? data : undefined,
      shape: x6ReactShape,
      component: (node: Node) => {
        return render && render(node && node.getData());
      },
      ...rest,
    });
    this.nodes.push(newNode);
  }

  /**
   * 更新节点
   * @param {Node} node 节点实例
   * @param {NodeConfig} newNodeData 节点最新数据
   * @memberof CellController
   */
  public updateNode(node: Node, newNodeData: NodeConfig) {
    // !!! 现在仅支持data数据不一致才认为更新
    if (!_.isEqual(node.data, newNodeData.data)) {
      // 重设节点数据, 触发x6更新节点逻辑
      node.setData(newNodeData.data);
      // node.setPosition(newNodeData.x, newNodeData.y)
      // node.setSize(newNodeData.width, newNodeData.height)
    }
  }

  /**
   * 批量删除节点
   * @param {Node[]} removeNodes
   * @memberof CellController
   */
  public removeNodes(removeNodes: Node[]) {
    if (_.size(removeNodes) > 0) {
      this.graph.removeCells(removeNodes);
      this.nodes = _.pullAll(this.nodes, removeNodes);
    }
  }

  /**
   * 单个删除节点
   * @param {(Node | string)} node
   * @memberof CellController
   */
  public removeNode(removeNode: Node | string) {
    if (!removeNode) {
      return;
    }
    if (removeNode instanceof Node) {
      this.removeNodes([removeNode]);
    } else {
      const findNode = this.findNodeById(removeNode);
      if (findNode) {
        this.removeNodes([findNode]);
      }
    }
    // !!! 待补充: 删除节点时是否需要将与之关联的连线都删除, 这里可以加一个标记
  }

  /**
   * 批量添加连线
   * @template T
   * @param {T[]} edgesData 边数据集合
   * @memberof CellController
   */
  public addEdges<T extends EdgeConfig>(edgesData: T[]) {
    edgesData.forEach((edgeData: T) => {
      this.addEdge(edgeData);
    });
  }

  /**
   * 添加单个连线
   * @template T
   * @param {T} edgeData 边数据
   * @memberof CellController
   */
  public addEdge<T extends EdgeConfig>(edgeData: T) {
    const { id, source, target, render, data, ...rest } = edgeData;

    const sourceNode = _.find(this.nodes, (node: Node) => node.id === source);
    const targetNode = _.find(this.nodes, (node: Node) => node.id === target);
    if (!source || !target) {
      throw new Error('edge must has source and target!');
    }

    const newEdge: Edge = this.graph.addEdge({
      id: id ? id : `${source}-${target}`,
      data: data ? data : undefined,
      source: sourceNode,
      target: targetNode,
      // label: (edge: Edge) => {
      //   return render && render(edge && edge.data)
      // },
      attrs: {
        line: {
          stroke: '#B4BDCF',
          strokeWidth: 1,
        },
      },
      ...rest,
    });
    this.edges.push(newEdge);
  }

  /**
   * 更新边
   * @param {Edge} edge 边实例
   * @param {EdgeConfig} newEdgeData 边最新数据
   * @memberof CellController
   */
  public updateEdge(edge: Edge, newEdgeData: EdgeConfig) {
    // !!! 现在仅支持data数据不一致才认为更新, 需要扩展
    if (!_.isEqual(edge.data, newEdgeData.data)) {
      edge.setData(newEdgeData.data);
    }
  }

  /**
   * 批量删除边
   * @param {Edge[]} removeEdges
   * @memberof CellController
   */
  public removeEdges(removeEdges: Edge[]) {
    this.graph.removeCells(removeEdges);
    this.edges = _.pullAll(this.edges, removeEdges);
  }

  /**
   * 单个删除边
   * @param {(Edge | string)} removeEdge
   * @memberof CellController
   */
  public removeEdge(removeEdge: Edge | string) {
    if (!removeEdge) {
      return;
    }
    if (removeEdge instanceof Edge) {
      this.graph.removeCells([removeEdge]);
      this.removeEdges([removeEdge]);
    } else {
      const findEdge = this.findEdgeById(removeEdge);
      if (findEdge) {
        this.removeEdges([findEdge]);
      }
    }
  }

  /**
   * 根据节点id获取节点
   * @param {string} id 节点id
   * @returns {(Node | undefined)}
   * @memberof CellController
   */
  public findNodeById(id: string): Node | undefined {
    return this.nodes.find((node: Node) => node.id === id);
  }

  /**
   * 根据连线id获取连线
   * @param {string} id 边id
   * @returns {(Edge | undefined)}
   * @memberof CellController
   */
  public findEdgeById(id: string): Edge | undefined {
    return this.edges.find((edge: Edge) => edge.id === id);
  }
}
