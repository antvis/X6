import React from 'react';
import { Popover } from 'antd';
import {
  CompressOutlined,
  OneToOneOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  GithubOutlined,
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

const GraphToolbar: React.FC<Props> = (props) => {
  const { className, onZoomIn, onZoomOut, onFitContent, onRealContent } = props;

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
    </ul>
  );
};

export default GraphToolbar;
