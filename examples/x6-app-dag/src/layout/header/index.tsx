import React, { useState } from 'react'
import { Layout, Modal, Typography } from 'antd'
import { useObservableState } from '@/common/hooks/useObservableState'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { GithubOutlined } from '@ant-design/icons'
import { SimpleLogo } from './logo'
import { ExperimentTitle } from './experiment-title'

import css from './index.less'

const { Header } = Layout
const { Title, Paragraph, Text } = Typography

interface IProps {
  experimentId: string
}

export const GuideHeader: React.FC<IProps> = (props) => {
  const expGraph = useExperimentGraph(props.experimentId)
  const [activeExperiment] = useObservableState(expGraph.experiment$)
  const [designShow, setDesignShow] = useState(true)

  const openGithub = () => {
    window.open(
      'https://github.com/antvis/X6/tree/master/examples/x6-app-dag',
      '_blank',
    )
  }

  return (
    <>
      <Header className={css.header}>
        <div className={css.headerLeft}>
          <SimpleLogo />
          <ExperimentTitle experimentName={activeExperiment.name} />
        </div>
        <div className={css.headerRight}>
          <div className={css.doc}>
            <span
              style={{ marginRight: 16, cursor: 'pointer' }}
              onClick={() => setDesignShow(true)}
            >
              设计指南
            </span>
            <GithubOutlined onClick={openGithub} />
          </div>
        </div>
        <Modal
          width={540}
          visible={designShow}
          footer={null}
          onCancel={() => setDesignShow(false)}
        >
          <Typography>
            <Title level={3}>DAG图</Title>
            <Paragraph>
              DAG 是 Directed Acyclic Graph
              的缩写，即有向无环图，它是指图中一个点经过两种路线到达另一个点没有闭环。
              它原本是计算机领域一种常用数据结构，因为独特的拓扑结构所带来的优异特性，经常被用于处理动态规划、导航中寻求最短路径、数据压缩等多种算法场景。
            </Paragraph>
            <Title level={5}>使用场景</Title>
            <Paragraph>DAG 图常用来描述业务流程，典型场景：</Paragraph>
            <Paragraph>
              <ul>
                <li>
                  <Text strong>人工智能产品：</Text>可以通过 DAG
                  图可以将一个复杂的人工智能实验流程给图形化出来，大大降低理解成本。
                </li>
                <li>
                  <Text strong>系统架构：</Text>
                  表达一个系统架构各个层各个实例之间的关系，有明确的分层。
                </li>
                <li>
                  <Text strong>交易系统：</Text>表达资金、交易等流转情况。
                </li>
              </ul>
            </Paragraph>
            <Paragraph style={{ textAlign: 'right' }}>
              <Text>设计师：不过</Text>
            </Paragraph>
          </Typography>
        </Modal>
      </Header>
    </>
  )
}
