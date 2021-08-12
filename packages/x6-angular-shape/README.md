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
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-node',
  template: `<div>{{ title }}</div>`
})
export class NodeComponent {
  @Input() title: string;
}
```
```ts
// other package from angular
import '@antv/x6-angular-shape'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('demoTpl', { static: true }) demoTpl: TemplateRef<void>;

  addAngularComponent(): void {
    Graph.registerAngularContent('demo-component', { injector: this.injector, content: NodeComponent });
    this.graph.addNode({
      data: {
        // You can pass data to the component, only if you wrap attribute with ngArguments
        ngArguments: {
          // Declare @Input() in the component, then it will be assignmented
          title: 'Angular Component'
        }
      },
      x: 40,
      y: 40,
      width: 160,
      height: 30,
      shape: 'angular-shape',
      componentName: 'demo-component'
    });
  }
}
```

### Render templateRef
```html
<ng-template #demoTpl let-data="ngArguments">
  <div>{{ data.title }}</div>
</ng-template>
```
```ts
// other package from angular
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
      data: {
        ngArguments: {
          title: 'Angular Template'
        }
      },
      x: 240,
      y: 40,
      width: 160,
      height: 30,
      shape: 'angular-shape',
      componentName: 'demo-template'
  }
}
```

### Render by callback

```ts
// other package from angular
import '@antv/x6-angular-shape'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('demoTpl', { static: true }) demoTpl: TemplateRef<void>;

  addAngularWithCallback(): void {
    Graph.registerAngularContent('demo-template', (node) => {
      const data = node.getData();
      console.log(data);
      return { injector: this.injector, content: this.demoTpl };
    });
    this.graph.addNode({
      data: {
        ngArguments: {
          title: 'Angular Callback'
        }
      },
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