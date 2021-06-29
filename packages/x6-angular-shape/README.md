# @antv/x6-angular-shape

> x6 shape for rendering angular component or templateRef

## Installation

```shell
# npm
$ npm install @antv/x6-angular-shape --save

# yarn
$ yarn add @antv/x6-angular-shape
```

## Usage

### Render component
```ts
import { Graph } from '@antv/x6'
import '@antv/x6-angular-shape'

addAngularComponent(): void {
  Graph.registerAngularContent('demo-component', { injector: this.injector, content: NodeComponent });
  this.graph.addNode({
    x: 40,
    y: 40,
    width: 160,
    height: 30,
    shape: 'angular-shape',
    componentName: 'demo-component'
  });
}
```

### Render templateRef
```html
<ng-template #demoTpl>
  <div>Angular Template</div>
</ng-template>
```
```ts
import { TemplateRef, ViewChild } from '@angular/core';
import { Graph } from '@antv/x6'
import '@antv/x6-angular-shape'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('demoTpl', { static: true }) demoTpl: TemplateRef<void>;

  addAngularTemplate(): void {
    Graph.registerAngularContent('demo-template', { injector: this.injector, content: this.demoTpl });
    this.graph.addNode({
      x: 240,
      y: 40,
      width: 160,
      height: 30,
      shape: 'angular-shape',
      componentName: 'demo-template'
    });
  }
}
```

### Render by callback

```ts
addAngularWithCallback(): void {
  Graph.registerAngularContent('demo-template', (node) => {
    const data = node.getData();
    console.log(data);
    return { injector: this.injector, content: this.demoTpl };
  });
  this.graph.addNode({
    x: 240,
    y: 40,
    width: 160,
    height: 30,
    shape: 'angular-shape',
    componentName: 'demo-template'
  });
}
```