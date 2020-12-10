import React, { useCallback, useState } from 'react'
import { Toolbar } from '@antv/x6-react-components'
import {
  GatewayOutlined,
  GroupOutlined,
  PlaySquareOutlined,
  RollbackOutlined,
  UngroupOutlined,
} from '@ant-design/icons'
import { useObservableState } from '@/common/hooks/useObservableState'
import { RxInput } from '@/component/rx-component/rx-input'
import { showModal } from '@/component/modal'
import { addNodeGroup } from '@/mock/graph'
import { BehaviorSubject } from 'rxjs'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { formatGroupInfoToNodeMeta } from '@/pages/rx-models/graph-util'
import styles from './canvas-toolbar.less'

const { Item, Group } = Toolbar
interface Props {
  experimentId: string
}

enum Operations {
  UNDO_DELETE = 'UNDO_DELETE',
  GROUP_SELECT = 'GROUP_SELECT',
  RUN_SELECTED = 'RUN_SELECTED',
  NEW_GROUP = 'NEW_GROUP',
  UNGROUP = 'UNGROUP',
}

export const CanvasToolbar: React.FC<Props> = (props) => {
  const { experimentId } = props
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>(false)
  const expGraph = useExperimentGraph(experimentId)
  const [activeNodeInstance] = useObservableState(
    () => expGraph.activeNodeInstance$,
  )
  const [selectedNodes] = useObservableState(() => expGraph.selectedNodes$)
  const [selectedGroup] = useObservableState(() => expGraph.selectedGroup$)

  const onClickItem = useCallback(
    (itemName: string) => {
      switch (itemName) {
        case Operations.UNDO_DELETE:
          expGraph.undoDeleteNode()
          break
        case Operations.GROUP_SELECT:
          expGraph.toggleSelectionEnabled()
          setSelectionEnabled((enabled) => !enabled)
          break
        case Operations.RUN_SELECTED:
          expGraph.runGraph()
          break
        case Operations.NEW_GROUP: {
          const value$ = new BehaviorSubject('')
          const modal = showModal({
            title: '新建分组',
            width: 450,
            okText: '确定',
            cancelText: '取消',
            children: (
              <div
                style={{ fontSize: 12, display: 'flex', alignItems: 'center' }}
              >
                <div style={{ width: 50, marginBottom: 8 }}>组名：</div>
                <RxInput
                  value={value$}
                  onChange={(e) => {
                    value$.next(e.target.value)
                  }}
                />
              </div>
            ),
            onOk: () => {
              modal.update({ okButtonProps: { loading: true } })
              addNodeGroup(value$.getValue())
                .then((res: any) => {
                  modal.close()
                  selectedNodes!.forEach((node) => {
                    const nodeData = node.getData<any>()
                    node.setData({ ...nodeData, groupId: res.data.group.id })
                  })
                  const nodeMetas: any[] = selectedNodes!.map((node) =>
                    node.getData<any>(),
                  )
                  expGraph.addNode(
                    formatGroupInfoToNodeMeta(res.data.group, nodeMetas),
                  )
                  expGraph.unSelectNode()
                })
                .finally(() => {
                  modal.update({ okButtonProps: { loading: false } })
                })
            },
          })
          break
        }
        case Operations.UNGROUP: {
          const descendantNodes = selectedGroup!.getDescendants()
          const childNodes = descendantNodes.filter((node) => node.isNode())
          childNodes.forEach((node) => {
            const nodeData = node.getData<any>()
            node.setData({ ...nodeData, groupId: 0 })
          })
          selectedGroup!.setChildren([])
          expGraph.deleteNodes(selectedGroup!)
          expGraph.unSelectNode()
          break
        }
        default:
      }
    },
    [expGraph, activeNodeInstance, selectedNodes, experimentId, selectedGroup],
  )

  const newGroupEnabled =
    !!selectedNodes &&
    !!selectedNodes.length &&
    selectedNodes.length > 1 &&
    selectedNodes.every((node) => {
      return node.isNode() && !node.getData<any>().groupId
    })

  const unGroupEnabled = !selectedNodes?.length && !!selectedGroup

  return (
    <div className={styles.canvasToolbar}>
      <Toolbar hoverEffect={true} onClick={onClickItem}>
        <Group>
          <Item
            name={Operations.UNDO_DELETE}
            tooltip="撤销删除节点"
            icon={<RollbackOutlined />}
          />
          <Item
            name={Operations.GROUP_SELECT}
            active={selectionEnabled}
            tooltip="框选节点"
            icon={<GatewayOutlined />}
          />
        </Group>
        <Group>
          <Item
            name={Operations.NEW_GROUP}
            disabled={!newGroupEnabled}
            tooltip="新建群组"
            icon={<GroupOutlined />}
          />
          <Item
            name={Operations.UNGROUP}
            disabled={!unGroupEnabled}
            tooltip="拆分群组"
            icon={<UngroupOutlined />}
          />
        </Group>
        <Group>
          <Item
            name={Operations.RUN_SELECTED}
            disabled={!activeNodeInstance}
            tooltip="执行选择节点"
            icon={<PlaySquareOutlined />}
          />
        </Group>
      </Toolbar>
    </div>
  )
}
