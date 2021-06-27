import { Graph } from '@antv/x6';
import { Content } from './registry';
import { AngularShape } from './node';
import { Injector } from '@angular/core';

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getAngularContent(this: Graph, node: AngularShape): Content;
      getAngularInjector(this: Graph, node: AngularShape): Injector;
    }
  }

  interface Hook {
    getAngularContent(node: AngularShape): Content;
    getAngularInjector(node: AngularShape): Injector;
  }
}

Graph.Hook.prototype.getAngularContent = function (node: AngularShape) {
  let res = node.getContent();
  if (!res) {
    throw new Error(`x6-angular-shape: You have to pass param 'injector' and it should be the instance of TemplateRef or ComponentType!`);
  }
  return res;
};

Graph.Hook.prototype.getAngularInjector = function (node: AngularShape) {
  const res = node.getInjector();
  if (!res) {
    throw new Error(`x6-angular-shape: You have to pass param 'injector' and it should be the instance of Injector!`);
  }
  return res as Injector;
};
