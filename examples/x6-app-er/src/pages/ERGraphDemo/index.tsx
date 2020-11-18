import React from 'react';
import ERGraph from '../ERGraph';
import { NodeConfig, EdgeConfig } from '@/pages/xflow';
import { mockEntityData, mockRelationData } from './mock';
import { EntityCanvasModel, RelationCanvasModel } from './interface';
import Entity from './Entity';
// import Relation from './Relation';

export default class EREditorDemo extends React.PureComponent<{}, {}> {
  calReanderData = () => {
    const nodes: NodeConfig[] = mockEntityData.map(
      (entity: EntityCanvasModel) => {
        const { entityId, x, y, width, height } = entity;
        const nodeData: NodeConfig = {
          x,
          y,
          width,
          height,
          id: entityId,
          render: (data: EntityCanvasModel) => {
            return <Entity entity={data} />;
          },
          data: entity,
        };
        return nodeData;
      },
    );

    const edges: EdgeConfig[] = mockRelationData.map(
      (relation: RelationCanvasModel) => {
        const { relationId, sourceEntityId, targetEntityId } = relation;
        const edgeData: EdgeConfig = {
          id: relationId,
          source: sourceEntityId,
          target: targetEntityId,
          label: '1:N',
          // render: (data: RelationCanvasModel) => {
          //   return null;
          // },
          data: relation,
        };
        return edgeData;
      },
    );

    return { nodes, edges };
  };

  render() {
    const { nodes, edges } = this.calReanderData();
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ERGraph
          data={{
            nodes,
            edges,
          }}
          // graphOptions={{}}
        />
      </div>
    );
  }
}
