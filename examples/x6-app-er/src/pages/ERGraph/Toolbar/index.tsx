import React, { useState } from 'react';
import { Modal, Typography, Popover } from 'antd';
import {
  CompressOutlined,
  OneToOneOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  GithubOutlined,
  AntDesignOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import styles from './index.less';

interface Props {
  className?: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitContent: () => void;
  onRealContent: () => void;
}

const { Title, Paragraph, Text } = Typography;

const GraphToolbar: React.FC<Props> = (props) => {
  const { className, onZoomIn, onZoomOut, onFitContent, onRealContent } = props;
  const [designShow, setDesignShow] = useState(true);

  const onViewSource = () => {
    window.open(
      'https://github.com/antvis/X6/tree/master/examples/x6-app-er',
      '_blank',
    );
  };

  return (
    <ul className={classNames(styles.handler, className)}>
      <Popover
        overlayClassName={styles.popover}
        content="放大"
        placement="left"
      >
        <li onClick={onZoomIn} className={styles.item}>
          <ZoomInOutlined />
        </li>
      </Popover>
      <Popover
        overlayClassName={styles.popover}
        content="缩小"
        placement="left"
      >
        <li onClick={onZoomOut} className={styles.item}>
          <ZoomOutOutlined />
        </li>
      </Popover>
      <Popover
        overlayClassName={styles.popover}
        content="实际尺寸"
        placement="left"
      >
        <li onClick={onRealContent} className={styles.item}>
          <OneToOneOutlined />
        </li>
      </Popover>
      <Popover
        overlayClassName={styles.popover}
        content="适应画布"
        placement="left"
      >
        <li onClick={onFitContent} className={styles.item}>
          <CompressOutlined />
        </li>
      </Popover>
      <Popover
        overlayClassName={styles.popover}
        content="查看源码"
        placement="left"
      >
        <li onClick={onViewSource} className={styles.item}>
          <GithubOutlined />
        </li>
      </Popover>
      <Popover
        overlayClassName={styles.popover}
        content="设计指南"
        placement="left"
      >
        <li onClick={() => setDesignShow(true)} className={styles.item}>
          <AntDesignOutlined />
        </li>
      </Popover>
      <Modal
        visible={designShow}
        footer={null}
        onCancel={() => setDesignShow(false)}
      >
        <Typography>
          <Title level={3}>ER 图</Title>
          <Paragraph>
            实体关系图也称ER模型（是指以实体、关系、属性三个基本概念概括数据的基本结构，从而描述静态数据结构的概念模型），
            全称为实体联系模型或实体关系模型，是概念数据模型的高层描述所使用的数据模型或模式图。
          </Paragraph>
          <Title level={5}>使用场景</Title>
          <Paragraph>
            一般在逻辑和物理数据库设计中使用，包括信息工程和空间建模。也可以用在两个或更多实体相互如何关联
          </Paragraph>
          <Paragraph>
            <ul>
              <li>
                <Text strong>信息系统设计中：</Text>
                在概念结构设计阶段用来描述信息需求或要存储在数据库中的信息类型，作为用户与分析员之间有效的交流工具。
              </li>
              <li>
                <Text strong>描述感兴趣区域的任何本体：</Text>
                对使用的术语和它们的联系的概述和分类，用实体、联系和属性这三个概念来理解现实问题。
              </li>
            </ul>
          </Paragraph>
          <Paragraph style={{ textAlign: 'right' }}>
            <Text>设计师：源子</Text>
          </Paragraph>
        </Typography>
      </Modal>
    </ul>
  );
};

export default GraphToolbar;
