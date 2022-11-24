import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, isConnectable }: { data: any, isConnectable: any }) => {
  return (
    <>
      <Handle
        id="a"
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
      <div>
        性能测试
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});
