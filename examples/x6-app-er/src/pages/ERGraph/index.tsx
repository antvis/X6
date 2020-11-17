import React from 'react';
import './index.less';
import { BaseGraph, GraphData, GraphOptions } from '../xflow/index';
import GraphToolbar from './Toolbar/index';

interface Props {
  /** 画布数据 */
  data: GraphData;
  /** 画布配置项 */
  graphOptions?: GraphOptions;
}

export default class EREditor extends React.PureComponent<Props, {}> {
  private baseGraph!: BaseGraph;
  private graphContainer!: HTMLDivElement;
  private minimapContainer!: HTMLDivElement;

  componentDidMount() {
    const { data, graphOptions } = this.props;

    /** 初始化画布 */
    this.baseGraph = new BaseGraph({
      ...graphOptions,
      container: this.graphContainer,
      grid: {
        visible: false,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        minScale: 0.5,
        maxScale: 2,
      },
    });

    /** 渲染画布内容 */
    this.baseGraph.updateGraph(data);

    /** 注册监听事件 */
    this.registerEvent();
  }

  componentDidUpdate(prevProps: Props) {
    // !!! updateGraph会对画布元素做Diff, 不会重复渲染, 但是如果能控制updateGraph次数, 是更好的
    this.baseGraph.updateGraph(this.props.data);
  }

  private registerEvent = () => {
    this.baseGraph.registerEvent([
      {
        eventName: 'scale',
        handler: (scale: number) => {},
      },
    ]);
  };

  onHandleToolbar = (action: 'in' | 'out' | 'fit' | 'real') => {
    switch (action) {
      case 'in':
        this.baseGraph.zoomGraph(0.1);
        break;
      case 'out':
        this.baseGraph.zoomGraph(-0.1);
        break;
      case 'fit':
        this.baseGraph.zoomGraph('fit');
        break;
      case 'real':
        this.baseGraph.zoomGraph('real');
        break;
      default:
    }
  };

  private refContainer = (container: HTMLDivElement) => {
    this.graphContainer = container;
  };

  private refMinimapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container;
  };

  render() {
    return (
      <div className="er-editor-demo-container">
        <div
          ref={this.refContainer}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <div ref={this.refMinimapContainer} className="minimap-container" />
        <GraphToolbar
          onZoomIn={() => this.onHandleToolbar('in')}
          onZoomOut={() => this.onHandleToolbar('out')}
          onFitContent={() => this.onHandleToolbar('fit')}
          onRealContent={() => this.onHandleToolbar('real')}
        />
      </div>
    );
  }
}
