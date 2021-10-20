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
      const ngArguments =
        (node.data?.ngArguments as { [key: string]: any }) || {}
      if (content instanceof TemplateRef) {
        const portal = new TemplatePortal(content, viewContainerRef, {
          ngArguments,
        })
        domOutlet.attachTemplatePortal(portal)
      } else {
        const portal = new ComponentPortal(content, viewContainerRef)
        const componentRef = domOutlet.attachComponentPortal(portal)
        Object.keys(ngArguments).forEach(
          (v) => (componentRef.instance[v] = ngArguments[v]),
        )
        componentRef.changeDetectorRef.detectChanges()
      }
    }
  }

  protected unmountAngularContent() {
    const root = this.getContentContainer()
    root.innerHTML = ''
    return root
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
