import { Drawer, Empty, Space, Tree, Typography } from 'antd'
import React, { useState, useEffect } from 'react'
import ReactJson from 'react-json-view'
import {
  BlockOutlined,
  PartitionOutlined,
  AppstoreOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons'

const iconMap = {
  group: <BlockOutlined />,
  svg: <PartitionOutlined />,
  shape: <AppstoreOutlined />,
  node: <AppstoreOutlined />,
  edge: <NodeIndexOutlined />,
}

const AttrsDrawer = ({ hash, getAttrs, onCancel, updateAttrs }) => {
  const [val, setVal] = useState(hash)
  const change = (all) => {
    const { updated_src, namespace, name } = all
    updateAttrs(
      hash,
      namespace[0] || name,
      updated_src[namespace[0] || name],
      all,
    )
  }

  useEffect(() => {
    if (hash && getAttrs) {
      getAttrs(hash).then((res) => {
        setVal(res)
      })
    } else {
      onCancel()
      getAttrs()
    }
  }, [getAttrs, hash, onCancel])

  return (
    <Drawer mask={false} onClose={onCancel} visible={hash}>
      <ReactJson
        style={{ fontSize: 12 }}
        onAdd={change}
        onEdit={change}
        onDelete={change}
        src={val}
      />
    </Drawer>
  )
}

const buildTreeData = (data = {}, isRoot) => {
  const node = {
    title: data.name || data.shape || data.type,
    type: data.type,
    key: data.hash,
    name: data.name,
    id: data.id,
    hash: data.hash,
    count: data.count,
    num: data.children?.length || 0,
  }

  if (data.children) {
    node.children = data.children.map((e) => buildTreeData(e))
  }

  if (isRoot) {
    node.type = 'svg'
    node.title = 'svg'
    // node.key = node.hash || 'svg'
    return node
  }

  return node
}

const GTree = (props) => {
  const { data, actions = {} } = props
  const [selectedKey, setSelected] = useState()

  useEffect(() => {
    actions.showRect(selectedKey, '__x6_select__', 'rgba(29, 57, 196, 0.5)')
    return () => {
      actions.cleanRect('__x6_select__')
    }
  }, [actions, selectedKey])

  if (!data) {
    return <Empty />
  }

  const treeData = buildTreeData(data, true)

  return (
    <div>
      <Tree
        selectedKeys={[selectedKey]}
        onSelect={(keys) => setSelected(keys[0])}
        showLine={{ showLeafIcon: false }}
        height={document.body.clientHeight - 45}
        titleRender={(node) => (
          <div
            onMouseEnter={() => {
              actions.showRect(node.key, '__x6_hover__')
            }}
            onMouseLeave={() => {
              actions.cleanRect('__x6_hover__')
            }}
          >
            <Space>
              {iconMap[node.type]}
              {node.title}
              {node.name && (
                <Typography.Text type="secondary">
                  name:{node.name}
                </Typography.Text>
              )}
              {node.id && (
                <Typography.Text type="secondary">id:{node.id}</Typography.Text>
              )}
              {node.num > 0 && (
                <Typography.Text type="secondary">
                  ({node.num} children / {node.count || 0} descendants)
                </Typography.Text>
              )}
            </Space>
          </div>
        )}
        treeData={[treeData]}
      />
      <AttrsDrawer
        hash={selectedKey}
        onCancel={() => setSelected()}
        getAttrs={actions.getAttrs}
        updateAttrs={actions.updateAttrs}
      />
    </div>
  )
}

export default GTree
