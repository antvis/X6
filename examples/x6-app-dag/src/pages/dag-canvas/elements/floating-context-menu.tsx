import React from 'react'
import { useObservableState } from '@/common/hooks/useObservableState'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { EdgeContextMenu } from './context-menu/edge-context-menu'
import { GraphContextMenu } from './context-menu/graph-context-menu'
import { NodeContextMenu } from './context-menu/node-context-menu'
import css from './floating-context-menu.less'

interface ContextMenuProps {
  experimentId: string
  menuType: 'node' | 'edge' | 'graph'
  menuData: any
}

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  const { experimentId, menuType, menuData } = props

  switch (menuType) {
    case 'edge':
      return <EdgeContextMenu experimentId={experimentId} data={menuData} />
    case 'graph':
      return <GraphContextMenu experimentId={experimentId} data={menuData} />
    case 'node':
      return <NodeContextMenu experimentId={experimentId} data={menuData} />
    default:
      return null
  }
}

interface Props {
  experimentId: string
}

export const FloatingContextMenu: React.FC<Props> = (props) => {
  const { experimentId } = props
  const expGraph = useExperimentGraph(experimentId)
  const [contextMenuInfo] = useObservableState(() => expGraph.contextMenuInfo$)

  if (!contextMenuInfo?.type) {
    return null
  }

  return (
    <div className={css.mask}>
      <ContextMenu
        experimentId={experimentId}
        menuData={contextMenuInfo.data}
        menuType={contextMenuInfo.type}
      />
    </div>
  )
}
