import { Graph } from '@antv/x6';
import X6BaseGraph from '../graph/baseGraph';
import { EventArg } from '../interface/graph-core';

export default class EventController {
  private x6BaseGraph: X6BaseGraph;
  private graph: Graph;

  // 是否删除X6自动生成的无实际业务含义的连线(用户在画布上拖拽生成连线, 这条连线是没有业务含义的)
  private isDeleteX6DefaultEdge!: boolean;

  constructor(x6BaseGraph: X6BaseGraph) {
    this.x6BaseGraph = x6BaseGraph;
    this.graph = x6BaseGraph.graph;
  }

  public registerEvent = (events: EventArg[]) => {
    events &&
      events.forEach((event: EventArg) => {
        switch (event.eventName) {
          case 'scale': {
            this.graph.on('scale', ({ sx, sy, ox, oy }) => {
              const scale = sx;
              event.handler && event.handler({ scale });
            });
            break;
          }
          case 'graph:mouseenter': {
            this.graph.on('graph:mouseenter', ({ e }) => {
              event.handler && event.handler();
            });
            break;
          }
          case 'graph:mouseleave': {
            this.graph.on('graph:mouseleave', ({ e }) => {
              event.handler && event.handler();
            });
            break;
          }
          case 'blank:mouseDown': {
            this.graph.on('blank:mousedown', ({ e, x, y }) => {
              event.handler && event.handler({ x, y });
            });
            break;
          }
          case 'blank:mouseUp': {
            this.graph.on('blank:mouseup', ({ e, x, y }) => {
              event.handler && event.handler({ x, y });
            });
            break;
          }
          case 'node:added': {
            this.graph.on('node:added', ({ node }) => {
              // if (!this.x6BaseGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ node });
              // }
              this.x6BaseGraph.bringNodesToFront([node]);
            });
            break;
          }
          case 'node:removed': {
            this.graph.on('node:removed', ({ node }) => {
              // if (!this.x6BaseGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ node })
              // }
            });
            break;
          }
          case 'edge:added': {
            this.graph.on('edge:added', ({ edge }) => {
              // if (!this.x6BaseGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ edge })
              // }
              // this.x6BaseGraph.bringCellsToBack([edge])
            });
            break;
          }
          case 'edge:removed': {
            this.graph.on('edge:removed', ({ edge }) => {
              if (this.isDeleteX6DefaultEdge) {
                return;
              }
              // if (!this.x6BaseGraph.isDataDrivenUpdate) {
              //   event.handler && event.handler({ edge })
              // }
            });
            break;
          }
          case 'node:mousedown': {
            this.graph.on('node:mousedown', ({ e, view, x, y }) => {
              event.handler && event.handler({ node: view.cell, x, y });
            });
            break;
          }
          case 'node:mousemove': {
            this.graph.on('node:mousemove', ({ e, view, x, y }) => {
              event.handler && event.handler({ node: view.cell, x, y });
            });
            break;
          }
          case 'node:mouseup': {
            this.graph.on('node:mouseup', ({ e, view, x, y }) => {
              event.handler && event.handler({ node: view.cell, x, y });
            });
            break;
          }
          case 'node:click': {
            this.graph.on('node:click', ({ view }) => {
              event.handler && event.handler({ node: view.cell });
            });
            break;
          }
          case 'node:dbclick': {
            this.graph.on('node:dblclick', ({ view }) => {
              event.handler && event.handler({ node: view.cell });
            });
            break;
          }
          case 'edge:connected': {
            this.graph.on('edge:connected', ({ edge }) => {
              // if (!this.x6BaseGraph.isDataDrivenUpdate) {
              //   // 拖拽连线过程中画布会出现一条连线, 该连线无实际业务含义, 需要删除
              //   if (!edge.data && edge.id.toString().startsWith('cell-', 0)) {
              //     this.isDeleteX6DefaultEdge = true;
              //     this.graph.removeCells([edge]);
              //     this.isDeleteX6DefaultEdge = false;
              //   }
              //   event.handler && event.handler({ edge });
              // }
            });
            break;
          }
          case 'selection:changed': {
            this.graph.on(
              'selection:changed',
              ({ selected, removed, added }) => {
                event.handler && event.handler({ selected, removed, added });
                this.x6BaseGraph.bringCellsToFront(selected);
              },
            );
            break;
          }
          default: {
            break;
          }
        }
      });
  };
}
