/* eslint-disable import/no-unresolved */
import React from 'react';
import { Menu } from 'antd';
// import { Icon } from '@alipay/bigfish';
import { get, isNil, each, debounce } from 'lodash-es';
import { updateParam } from '@/services/guide/node-instance';
import { EzForm } from '@/component/ez-form';
import styles from './index.less';

// parse EZform 的shcema 和 defaultValues
export const parseSchema = ({ schema = [], values = {}, disable }: any) =>
  schema.map((item: any) => {
    const { key } = item;
    return {
      ...item,
      defaultValue: isNil(values[key]) ? values[key] : item.defaultValue,
      disable: disable || item.disable,
    };
  });

interface Args {
  algoArgs: {
    [key: string]: any;
  };
  sysArgs: {
    [key: string]: any;
  };
  paiArgs: {
    [key: string]: any;
  };
}

interface Node {
  isStudio: boolean;
  experimentId: number;
  nodeInstanceId: number;
}

interface Props {
  node: Node;
  args: Args;
  UI: AistudoDefine.UI[];
  needInit: boolean;
}

interface State {
  mappingMap: any;
  argGroup: { algo: any; sys: any; pai: any };
  formValues: { [key: string]: any };
  tabKey: string;
}

export namespace AistudoDefine {
  export interface UI {
    icon: string;
    key: string;
    label: string;
    schema: Schema[];
  }

  export interface Schema {
    key: string;
    label: string;
    value?: any;
    type?: string;
    tooltip: string;
    hidden?: boolean;
    mapping?: string;
    disable?: boolean;
    required?: boolean;
    component?: string;
    defaultValue?: string;
    isSys?: boolean;
    rules?: Rule[];
    itemProps?: ItemProps;
  }

  interface ItemProps {
    enum?: EnumDef[];
    sequence?: string;
    anchor_bind?: string;
    placeholder?: string;
  }

  interface EnumDef {
    mpi: string;
    pytorch: string;
    tensorflow: string;
    [key: string]: string;
  }

  interface Rule {
    required?: boolean;
    message?: string;
    [key: string]: any;
  }

  export interface Anchors {
    input: Anchor[];
    output: Anchor[];
  }

  export interface Anchor {
    description: string;
    resourceType: string;
    sequence: number;
  }

  export interface Meta {
    codeName: string;
    engineType: string;
  }
}

const EmptyPlaceHolder = () => (
  <div className={styles.form}>
    <div className={styles.header} />
    <div className={styles.empty}>当前节点没有参数配置项.</div>
  </div>
);

export class Form extends React.Component<Props, State> {
  private schema: AistudoDefine.Schema[] = [];

  constructor(props: Props) {
    super(props);
    const { UI = [], args = {} as any, needInit } = props;
    const mappingMap = {};

    const argGroup = {
      pai: { ...args.paiArgs },
      algo: { ...args.algoArgs },
      sys: { ...args.sysArgs },
    };

    UI.forEach((tab: any = {}) => {
      const { key, schema = [] } = tab;
      let group: any;
      if (key === 'sysArgs') {
        group = argGroup.sys;
      } else {
        group = argGroup.algo;
      }

      schema.forEach((item: any) => {
        const { defaultValue, key: itemKey, mapping, type } = item;
        // 输入输出表, 根据接口获取不保存
        if (!/^input_\d$|^output_\d$/.test(itemKey)) {
          // 如果没有值则init默认值

          if (/boolean/i.test(type)) {
            const dbValue = get(group, itemKey);
            group[itemKey] = isNil(dbValue) ? defaultValue : dbValue;
          } else {
            group[itemKey] = isNil(group[itemKey])
              ? defaultValue
              : group[itemKey] || argGroup.pai[itemKey] || '';
          }

          // 记录转换关系
          if (mapping) {
            mappingMap[itemKey] = mapping;
          }

          // 将mapping后的key 转换回来
          if (group[mapping]) {
            group[itemKey] = group[mapping];
          }
        } else {
          // 删除输出表输出表的值
          delete group[itemKey];
          delete group[mapping];
        }
      });
    });

    const formValues = { ...argGroup.pai, ...argGroup.algo, ...argGroup.sys };

    this.state = {
      mappingMap,
      argGroup,
      formValues,
      tabKey: 'setting',
    };

    if (needInit) {
      // 设置默认值
      this.saveData(argGroup.algo, 'algo___args');
      this.saveData(argGroup.sys, 'sys___args');
    }
  }

  saveData = async (values: any, name: any) => {
    const { mappingMap } = this.state;
    const { node } = this.props;
    const { experimentId, nodeInstanceId, id } = node as any;

    const argsValue = {};

    each(values, (val, key) => {
      // 需要映射key的参数
      if (mappingMap[key]) {
        const mappingKey = mappingMap[key];
        argsValue[mappingKey] = val;
      } else {
        // 不需要映射的参数
        argsValue[key] = val;
      }
    });

    await updateParam({
      name,
      nodeInstanceId: nodeInstanceId || id,
      experimentId,
      value: JSON.stringify(argsValue),
    });
  };

  updateParam = debounce(this.saveData, 1500, {
    leading: false,
    maxWait: 12000,
  });

  onTabClick = ({ key }: any) => {
    this.setState({
      tabKey: key,
    });
  };

  onItemChange = (conf: any, val: any) => {
    const { formValues, argGroup, tabKey } = this.state;
    const { key } = conf;

    const updateValues = {
      ...formValues,
      [key]: val,
    };

    const argType = tabKey === 'sysArgs' ? 'sys' : 'algo';
    const updateName = tabKey === 'sysArgs' ? 'sys___args' : 'algo___args';

    const newArgGroup = {
      ...argGroup,
      [argType]: {
        ...argGroup[argType],
        [key]: val,
      },
    };

    this.setState({
      formValues: updateValues,
      argGroup: newArgGroup,
    });

    // 判断是否是PAI面板参数
    if (Object.hasOwnProperty.call(argGroup.pai, key)) {
      this.updateSysParam(key, val);
    }

    this.updateParam(newArgGroup[argType], updateName);
  };

  updateSysParam = debounce(
    async (name, value) => {
      const { node } = this.props;
      const { experimentId, nodeInstanceId } = node;

      await updateParam({
        nodeInstanceId,
        experimentId,
        name,
        value,
      });
    },
    1000,
    { leading: false, maxWait: 10000 },
  );

  renderMenu = (UI: any, tabKey: any) => {
    const clz = UI.length === 1 ? styles.hasTabs : '';

    return (
      <Menu
        className={`${styles.menu} ${clz}`}
        onClick={this.onTabClick}
        selectedKeys={[tabKey]}
        mode="horizontal"
      >
        {UI.map((tab: any) => {
          const {
            key,
            label,
            // icon,
          } = tab;
          if (tabKey === key) {
            this.schema = tab.schema;
          }
          return (
            <Menu.Item key={key}>
              {/* <Icon type={icon} /> */}
              {label}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  renderForm = () => {
    const { node } = this.props;
    const { formValues = {} } = this.state;
    const parsedSchema = parseSchema({
      schema: this.schema || [],
      values: formValues,
      disable: false,
    });

    return (
      <EzForm
        itemProps={node}
        values={formValues}
        schema={parsedSchema}
        onItemChange={this.onItemChange}
      />
    );
  };

  renderUI = (UI: any) => {
    const { tabKey = 'setting' } = this.state;
    return (
      <div className={styles.configForm}>
        {this.renderMenu(UI, tabKey)}
        {this.renderForm()}
      </div>
    );
  };

  render() {
    const { UI = [] } = this.props;

    if (UI.length === 0) {
      return <EmptyPlaceHolder />;
    }
    return <div className={styles.form}>{this.renderUI(UI)}</div>;
  }
}
