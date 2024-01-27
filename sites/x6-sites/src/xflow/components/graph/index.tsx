import { XFlow, XFlowGraph, Background, useGraphStore } from '@antv/xflow'
import React, { useEffect, useState, useCallback } from 'react'
import { Card, Row, Col, Checkbox } from 'antd'
import './index.less'

const Page = () => {
  const [options, setOptions] = useState({
    readonly: false,
    zoomable: false,
    embedable: false,
    pannable: false,
    restrict: false,
  })

  return (
    <XFlow>
      <span style={{ display: 'flex' }}>
        <div className="xflow-graph-content-setting">
          <Setting setOptions={setOptions} options={options} />
        </div>
        <div className="xflow-graph-content-graph">
          <XFlowGraph
            readonly={options.readonly}
            zoomable={options.zoomable}
            pannable={options.pannable}
            embedable={options.embedable}
            embedOptions={{
              frontOnly: true,
              findParent: 'bbox',
              validate: () => true,
            }}
            restrict={options.restrict}
            centerView
            fitView
            minScale={0.5}
            maxScale={5}
            connectionOptions={{
              snap: true,
              allowBlank: false,
              allowLoop: false,
              highlight: true,
              connectionPoint: 'anchor',
              anchor: 'center',
            }}
            connectionEdgeOptions={{
              attrs: {
                line: {
                  stroke: '#C2C8D5',
                  strokeWidth: 1,
                },
              },
              animated: true,
              zIndex: -1,
            }}
            selectOptions={{
              multiple: true,
              strict: true,
              rubberband: true,
              modifiers: 'shift',
              showNodeSelectionBox: true,
            }}
            magnetAdsorbedHighlightOptions={{
              name: 'stroke',
              args: {
                attrs: {
                  fill: '#5F95FF',
                  stroke: '#5F95FF',
                },
              },
            }}
          />
        </div>
      </span>
      <Background color="#F2F7FA" />
    </XFlow>
  )
}

export default Page

const ports = {
  groups: {
    group1: {
      position: 'top',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
    group2: {
      position: 'right',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
    group3: {
      position: 'bottom',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
    group4: {
      position: 'left',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
  },
  items: [
    { id: 'group1', group: 'group1' },
    { id: 'group2', group: 'group2' },
    { id: 'group3', group: 'group3' },
    { id: 'group4', group: 'group4' },
  ],
}

const Setting = ({ setOptions }) => {
  const initData = useGraphStore((state) => state.initData)

  const setInitData = useCallback(() => {
    initData({
      nodes: [
        {
          id: '1',
          x: 32,
          y: 32,
          width: 100,
          height: 40,
          label: 'Hello',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
              rx: 6,
              ry: 6,
            },
          },
          ports: {
            ...ports,
          },
        },
        {
          id: '2',
          x: 160,
          y: 180,
          width: 60,
          height: 60,
          label: 'World',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
          ports: {
            ...ports,
          },
        },
        {
          id: '3',
          x: 300,
          y: 180,
          width: 100,
          height: 40,
          label: 'Text',
          attrs: {
            body: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
              fill: '#fff',
            },
          },
          ports: {
            ...ports,
          },
        },
      ],
      edges: [
        {
          source: {
            cell: '1',
            port: 'group2',
          },
          target: {
            cell: '2',
            port: 'group1',
          },
          attrs: {
            line: {
              stroke: '#8f8f8f',
              strokeWidth: 1,
            },
          },
        },
      ],
    })
  }, [initData])

  useEffect(() => {
    setInitData()
  }, [setInitData])

  return (
    <div>
      <Card title="XFlowGraph 配置" bordered={false}>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, readonly: e.target.checked }))
              }
            >
              readonly
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, zoomable: e.target.checked }))
              }
            >
              zoomable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, pannable: e.target.checked }))
              }
            >
              pannable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, embedable: e.target.checked }))
              }
            >
              embedable
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, restrict: e.target.checked }))
              }
            >
              restrict
            </Checkbox>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
