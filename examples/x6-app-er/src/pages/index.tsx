import React, { useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';
import ERGraphDemo from './ERGraphDemo';

interface Props extends RouteComponentProps {}

const ERGraphPage: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.erGraphDemo}>
      <ERGraphDemo />
    </div>
  );
};

export default ERGraphPage;
