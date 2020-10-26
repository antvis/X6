import React, { useCallback } from 'react';
import { dialogLog } from 'ai-lib';
import { copy2clipboard } from '@/common/utils';
import { makeNodeInstanceLogSupplier } from '@/pages/rx-models/experiment-node-log-supplier';
import styles from './profile.less';

interface ProfileData {
  nodeInstanceId: string;
  nodeDefineId: number; // 查看组件详情用
  name: string;
  author: string;
  codeName?: string;
  description?: string;
  thumbUp?: number;
  thumbDown?: number;
  isLiked?: boolean;
  isUnlinked?: boolean;
  isAuthor?: boolean;
}

interface Props {
  experimentId: string;
  profileData: ProfileData;
}

export const Profile: React.FC<Props> = (props) => {
  const { experimentId, profileData = {} as ProfileData } = props;
  const { name, nodeInstanceId, author, nodeDefineId } = profileData;

  const onLog = useCallback(() => {
    const observable = makeNodeInstanceLogSupplier(
      experimentId,
      nodeInstanceId,
    );
    dialogLog.show({ supplier: observable });
  }, [experimentId, nodeInstanceId]);

  const onCopy = useCallback(() => {
    copy2clipboard(nodeInstanceId);
  }, [nodeInstanceId]);

  return (
    <div className={styles.profile}>
      <div className={styles.line}>
        <span className={`${styles.left} ${styles.pointer}`} onClick={onCopy}>
          <span className={styles.label}>{name}</span>
          <span className={styles.id}>（id: {nodeInstanceId}）</span>
        </span>
        <span className={styles.right}>
          <span className={`${styles.pointer} ${styles.blue}`} onClick={onLog}>
            查看日志
          </span>
        </span>
      </div>
      <div className={styles.line}>
        <span className={`${styles.label} ${styles.left} ${styles.blue}`}>
          算法作者：{author}
        </span>
        <a
          className={`${styles.right} ${styles.blue}  ${styles.pointer}`}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://pai.alipay.com/component/detail/${nodeDefineId}`}
        >
          组件详情
        </a>
      </div>
    </div>
  );
};
