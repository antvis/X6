import React, { Component } from 'react';
import { Spin, Empty } from 'antd';
import { get, isBoolean, each } from 'lodash-es';
import { safeJson } from '@/common/utils';
import { Form } from './form';
import styles from './index.less';

/**
 * 1. 过滤出字段选择控件的字段, 改写成pai的配置, 包括 param/uuid/portuuid/, 其他的都放在args里面. 隐藏高级属性.
 * 2. 根据 codename 获取 aiStudio 的 bundle配置.
 * 3. 渲染 aiStudio面板
 * 4. 写一个字段选择控件
 * 5. 字段onchange时触发保存args的逻辑
 * 5.
 */

interface Props {
  node: any;
  controls: UIControl.Controls;
}

interface State {
  UI: any;
  args: any;
  error: string;
  ready: boolean;
  needInit: boolean;
}

interface ParsedArgs {
  sysArgs: any;
  algoArgs: any;
  paiArgs: any;
}

export class ConfForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { controls: uiControls } = props;
    const controls = get(uiControls, 'tabs[0].groups[0].controls', []);
    let needInit = false;
    // 解析参数
    const args = controls.reduce(
      (acc: ParsedArgs, item: { name: string; value: any }) => {
        const { name, value = '' } = item;

        if (name === 'algo___args') {
          acc.algoArgs = safeJson(value, {});
          if (!isBoolean(value)) {
            if (value.length === 0) {
              needInit = true;
            }
          }
        } else if (name === 'sys___args') {
          acc.sysArgs = safeJson(value, {});
          if (!isBoolean(value)) {
            if (value.length === 0) {
              needInit = true;
            }
          }
        } else {
          acc.paiArgs[name] = value;
        }
        return acc;
      },
      { sysArgs: {}, algoArgs: {}, paiArgs: {} },
    );

    each(args.sys, (val, key) => {
      args.aistudio[key] = val;
    });

    this.state = {
      args,
      needInit,
      UI: [],
      ready: false,
      error: '',
    };
  }

  componentDidMount() {
    const { node } = this.props;
    const { codeName } = node;
    this.fetch(codeName);
  }

  fetch = async (codeName: boolean) => {
    const response = await getDataFromCache({
      key: `aistudio-bundle-${codeName}`,
    });

    if (response && response.success) {
      const { result = {} } = response.data;
      const { valueString } = result;
      try {
        const bundle = JSON.parse(valueString);
        if (bundle && bundle.UI) {
          this.setState({
            UI: bundle.UI,
            ready: true,
          });
        }
      } catch (error) {
        console.error(valueString);
        this.setState({
          error: '组件加载失败',
          ready: false,
        });
      }
    }
  };

  render = () => {
    const { UI = [], ready, args, needInit, error } = this.state;

    const { node } = this.props;
    const { nodeInstanceId } = node;

    if (error) {
      return (
        <div className={`${styles.errorWrap} ${styles.panel}`}>
          <Empty
            description={
              <div className={styles.errorTips}>
                <b> {error}, 请依次尝试：</b>
                <p> 1.刷新页面重新登陆</p>
                <p> 2.从左侧拖一个新组件</p>
                <p> 3.在答疑群反馈</p>
              </div>
            }
          />
        </div>
      );
    }
    if (!ready) {
      return (
        <div className={styles.panel}>
          <Spin spinning>
            <div className={styles.loading} />
          </Spin>
        </div>
      );
    }

    return (
      <div className={styles.panel}>
        <div className={styles.body}>
          <Form
            UI={UI}
            node={node}
            args={args}
            needInit={needInit}
            key={nodeInstanceId}
          />
        </div>
      </div>
    );
  };
}
