import React, { useState, useEffect } from 'react'
import { Row, Select, Col, Button, Tooltip, Tag, Empty } from 'antd'
import { CodeOutlined } from '@ant-design/icons'
import GTree from './GTree'

const countTree = (tree) => {
  if (!tree) {
    return 0
  }
  const count = tree?.children?.reduce((a, b) => a + countTree(b), 1) || 1
  tree.count = count
  return count
}

export function convertMemoryUnit(number, digits = 2) {
  let value
  let unit
  if (number > 1000000000) {
    unit = 'GB'
    value = number / 1000000000
  } else if (number > 1000000) {
    unit = 'MB'
    value = number / 1000000
  } else if (number > 1000) {
    unit = 'KB'
    value = number / 1000
  } else {
    unit = 'B'
    value = number
  }
  value = value && value % 1 !== 0 ? value.toFixed(digits) : value
  return value + unit
}

const HeadBar = (props) => {
  const {
    data,
    setSelectedHash,
    actions,
    selectedData,
    setData,
    selectedHash,
  } = props
  const [graphAlive, setGraphAlive] = useState(true)

  useEffect(() => {
    const itv = setInterval(() => {
      actions.checkGraphAlive(selectedHash).then((res) => {
        setGraphAlive(res)
        if (res) {
          actions.getNowGraphData().then((d) => {
            if (d) {
              setData(d)
            }
          })
        }
      })
    }, 1000)

    return () => {
      clearInterval(itv)
    }
  }, [actions, setData, selectedData, selectedHash])

  useEffect(() => {
    if (!graphAlive) {
      actions.getNowGraphData().then((d) => {
        if (d) {
          setData(d)
          setSelectedHash(d[0].hash)
        }
      })
    }
  }, [actions, graphAlive, setData, setSelectedHash])

  return (
    <Row
      align="middle"
      style={{
        padding: 2,
        marginBottom: 6,
        borderBottom: '1px solid #ddd',
        background: 'rgba(0, 0, 0, 0.05)',
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0,
        zIndex: 999,
      }}
      gutter={[12, 12]}
    >
      <Col>
        <Select
          bordered={false}
          size="small"
          defaultValue={0}
          options={data.map((e, i) => ({
            label: `Graph ${i}`,
            value: e.hash,
            info: e,
          }))}
          value={selectedHash}
          onChange={(val) => {
            setSelectedHash(val)
          }}
          placeholder="Choose a graph to inspect"
          style={{ width: '100%' }}
        />
      </Col>
      {graphAlive ? (
        <Col>
          <Tag color="green">ALIVE</Tag>
        </Col>
      ) : (
        <Col>
          <Tag color="red">DEAD</Tag>
          <span>Trying to reconnect</span>
        </Col>
      )}
      {selectedData && <Col>{selectedData?.count} Shapes</Col>}
      {selectedData?.memory > 0 && (
        <Col>HeapMemory:{convertMemoryUnit(selectedData.memory)}</Col>
      )}
      {selectedData?.fps > 0 && <Col>FPS: {selectedData?.fps}</Col>}
      <Col flex={1} />
      <Col>
        <Button
          size="small"
          type="text"
          onClick={() => {
            actions.consoleEl(selectedData.hash)
          }}
        >
          <Tooltip arrowPointAtCenter title="Console X6 Graph">
            <CodeOutlined />
          </Tooltip>
        </Button>
      </Col>
    </Row>
  )
}

const Devtool = (props) => {
  const { data: initData = [], actions = {} } = props
  const [selectedData, setSelectedData] = useState(initData[0])
  const [selectedHash, setSelectedHash] = useState(initData[0].hash)
  const [data, setData] = useState(initData)

  useEffect(() => {
    return () => {
      actions.cleanAllRect()
      actions.startFPSMonitor()
    }
  }, [actions, selectedHash])

  useEffect(() => {
    const target = data.find((e) => e.hash === selectedHash)
    countTree(target)
    setSelectedData(target)
  }, [selectedHash, data])

  return (
    <div>
      <HeadBar
        data={data}
        setSelectedHash={setSelectedHash}
        selectedData={selectedData}
        selectedHash={selectedHash}
        actions={actions}
        setData={setData}
      />
      <div
        style={{
          marginTop: 48,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {selectedData ? (
          <GTree actions={actions} data={selectedData} />
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
}

export default Devtool
