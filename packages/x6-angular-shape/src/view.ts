import {
  ApplicationRef,
  ComponentFactoryResolver,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import { NodeView, Scheduler } from '@antv/x6'
import {
  ComponentPortal,
  DomPortalOutlet,
  TemplatePortal,
} from '@angular/cdk/portal'
import { AngularShape } from './node'

export class AngularShapeView extends NodeView<AngularShape> {
  protected init() {
    super.init()
  }

  getContentContainer() {
    return this.selectors.foContent as HTMLDivElement
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, AngularShapeView.action, () => {
      Scheduler.scheduleTask(() => this.renderAngularContent())
    })
  }

  protected renderAngularContent() {
    this.unmountAngularContent()
    const root = this.getContentContainer()
    if (root) {
      const node = this.cell
      const { injector, content } = this.graph.hook.getAngularContent(node)
      const applicationRef = injector.get(ApplicationRef)
      const viewContainerRef = injector.get(ViewContainerRef)
      const componentFactoryResolver = injector.get(ComponentFactoryResolver)
      const domOutlet = new DomPortalOutlet(
        root,
        componentFactoryResolver,
        applicationRef,
        injector,
      )
      if (content instanceof TemplateRef) {
        let portal;
        if (node.data != null){
          portal = new TemplatePortal(content, viewContainerRef, {data: node.data});
        }else{
           portal = new TemplatePortal(content, viewContainerRef);
        }
        domOutlet.attachTemplatePortal(portal)
      } else {
        let portal;
        if (node.data != null){
          portal = new ComponentPortal(content, viewContainerRef, node.data);
        }else{
          portal = new ComponentPortal(content, viewContainerRef);
        }
        domOutlet.attachComponentPortal(portal);
      }
    }
  }

  protected unmountAngularContent() {
    const root = this.getContentContainer()
    root.innerHTML = ''
    return root
  }

  unmount() {
    this.unmountAngularContent()
    return this
  }

  @NodeView.dispose()
  dispose() {
    this.unmountAngularContent()
  }
}

export namespace AngularShapeView {
  export const action = 'angular' as any

  AngularShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register('angular-shape-view', AngularShapeView, true)
}
