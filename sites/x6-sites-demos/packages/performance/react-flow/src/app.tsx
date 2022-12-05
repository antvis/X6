import React, { useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './custom-node';
import './app.css'

const createMockData = (nodeNum: number, edgeNum: number) => {
  const nodes = []
  const edges = []
  for (let i = 0; i < nodeNum; i += 1) {
    const x = Math.floor(Math.random() * 800)
    const y = Math.floor(Math.random() * 800)
    nodes.push({
      id: `node_${i}`,
      type: 'customNode',
      position: { x, y },
      style: { border: '1px solid #777', padding: 10 },
    })
  }
  for (let i = 0; i < edgeNum; i += 1) {
    const sourceId = `node_${Math.floor(Math.random() * nodeNum)}`
    const targetId = `node_${Math.floor(Math.random() * nodeNum)}`
    edges.push({
      id: `edge_${i}`,
      source: sourceId,
      sourceHandle: 'b',
      target: targetId,
      targetHandle: 'a',
    })
  }

  return { nodes, edges }
}

const nodeTypes = {
  customNode: CustomNode,
};

const CustomNodeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const { nodes, edges } = createMockData(1000, 1000)
    setNodes(nodes as any);

    setEdges(edges as any);
  }, [setNodes, setEdges]);

  return (
    <div className="app">
      <div className="app-content">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          fitView
          attributionPosition="bottom-left"
        >
        </ReactFlow>
      </div>
    </div>
    
  );
};

export default CustomNodeFlow;