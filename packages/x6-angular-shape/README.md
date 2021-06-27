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

graph.addNode({
  shape: 'angular-shape',
  x: 32,
  y: 48,
  width: 180,
  height: 40,
  content: DemoComponent,
});
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

  addNode(): void {
    graph.addNode({
      shape: 'angular-shape',
      x: 32,
      y: 48,
      width: 180,
      height: 40,
      content: this.demoTpl,
    });
  }
}
```

