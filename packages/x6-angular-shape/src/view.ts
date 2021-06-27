import { ApplicationRef, ComponentFactoryResolver, TemplateRef, ViewContainerRef } from '@angular/core';
import { NodeView, Scheduler } from '@antv/x6';
import { AngularShape } from './node';
import { ComponentPortal, DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

export class AngularShapeView extends NodeView<AngularShape> {
  protected init() {
    super.init();
  }

  getContentContainer() {
    return this.selectors.foContent as HTMLDivElement;
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag);
    return this.handleAction(ret, AngularShapeView.action, () => {
      Scheduler.scheduleTask(() => this.renderAngularContent());
    });
  }

  protected renderAngularContent() {
    this.unmountAngularContent();
    const root = this.getContentContainer();
    if (root) {
      const node = this.cell;
      const content = this.graph.hook.getAngularContent(node);
      const injector = this.graph.hook.getAngularInjector(node);
      const applicationRef = injector.get(ApplicationRef);
      const viewContainerRef = injector.get(ViewContainerRef);
      const componentFactoryResolver = injector.get(ComponentFactoryResolver);
      const domOutlet = new DomPortalOutlet(root, componentFactoryResolver, applicationRef, injector);
      if (content instanceof TemplateRef) {
        const portal = new TemplatePortal(content, viewContainerRef);
        domOutlet.attachTemplatePortal(portal);
      } else {
        try {
          const portal = new ComponentPortal(content as any, viewContainerRef);
          domOutlet.attachComponentPortal(portal);
        } catch (error) {
          throw Error(`x6-angular-shape: The param 'content' should be the instanceof TemplateRef or ComponentType! Angular: ${error}`);
        }
      }
    }
  }

  protected unmountAngularContent() {
    const root = this.getContentContainer();
    root.innerHTML = '';
    return root;
  }

  unmount() {
    this.unmountAngularContent();
    return this;
  }

  @NodeView.dispose()
  dispose() {
    this.unmountAngularContent();
  }
}

export namespace AngularShapeView {
  export const action = 'angular' as any;

  AngularShapeView.config({
    bootstrap: [action],
    actions: {
      component: action
    }
  });

  NodeView.registry.register('angular-shape-view', AngularShapeView, true);
}
