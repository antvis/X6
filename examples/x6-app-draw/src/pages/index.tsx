import React, { useState, useEffect } from 'react'
import { Modal, Typography } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import FlowGraph from './Graph'
import ToolBar from './components/ToolBar'
import ConfigPanel from './components/ConfigPanel'
import '../reset.less'
import '../global.css'
import styles from './index.less'

const { Title, Paragraph, Text } = Typography

export default function () {
  const [isReady, setIsReady] = useState(false)
  const [designShow, setDesignShow] = useState(true)

  const getContainerSize = () => {
    return {
      width: document.body.offsetWidth - 581,
      height: document.body.offsetHeight - 87,
    }
  }

  useEffect(() => {
    const graph = FlowGraph.init()
    setIsReady(true)

    const resizeFn = () => {
      const { width, height } = getContainerSize()
      graph.resize(width, height)
    }
    resizeFn()

    window.addEventListener('resize', resizeFn)
    return () => {
      window.removeEventListener('resize', resizeFn)
    }
  }, [])

  const openGithub = () => {
    window.open(
      'https://github.com/antvis/X6/tree/master/examples/x6-app-draw',
      '_blank',
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span>流程图 Demo</span>
        <span>
          <span
            style={{ marginRight: 16, cursor: 'pointer' }}
            onClick={() => setDesignShow(true)}
          >
            设计指南
          </span>
          <GithubOutlined onClick={openGithub} />
        </span>
      </div>
      <div className={styles.content}>
        <div id="stencil" className={styles.sider} />
        <div className={styles.panel}>
          <div className={styles.toolbar}>{isReady && <ToolBar />}</div>
          <div id="container" className="x6-graph" />
        </div>
        <div className={styles.config}>{isReady && <ConfigPanel />}</div>
      </div>
      <Modal
        visible={designShow}
        footer={null}
        onCancel={() => setDesignShow(false)}
      >
        <Typography>
          <Title level={3}>流程图</Title>
          <Paragraph>
            流程图是表示算法、工作流或流程的一种框图表示，它以不同类型的框代表不同种类的步骤，每两个步骤之间则以箭头连接。
            这种表示方法便于说明解决已知问题的方法。流程图背后可以概括了各节点类型、其内容及其他补充用的信息。
            在设计或者记录一些简单的步骤或程序都会用得上流程图。
          </Paragraph>
          <Title level={5}>使用场景</Title>
          <Paragraph>
            流程图是流经一个系统的信息流、观点流或部件流的图形代表。在企业中，流程图主要用来说明某一过程。
            这种过程既可以是生产线上的工艺流程，也可以是完成一项任务必需的管理过程。典型场景：
          </Paragraph>
          <Paragraph>
            <ul>
              <li>
                <Text strong={true}>组织结构图：</Text>
                组织结构图是把企业组织分成若干部分,并且标明各部分之间可能存在的各种关系。例如上下级领导关系(组织机构图)，物流关系，资金流关系和资料传递关系等。
              </li>
              <li>
                <Text strong={true}>BPMN：</Text>用于以业务流程模型详细说明各种业务流程
              </li>
              <li>
                <Text strong={true}>UML：</Text>UML
                立足于对事物的实体、性质、关系、结构、状态和动态变化过程的全程描述和反映。
              </li>
              <li>
                <Text strong={true}>EPC 事件过程线图：</Text>适合诸如
                B2B、供应链流程管理、仓储物流管理等商业化业务流程。
              </li>
            </ul>
          </Paragraph>
          <Paragraph style={{ textAlign: 'right' }}>
            <Text>设计师：源子</Text>
          </Paragraph>
        </Typography>
      </Modal>
    </div>
  )
}
