---
title: Angular Nodes
order: 6
redirect_from:
  - /en/docs
  - /en/docs/tutorial
  - /en/docs/tutorial/intermediate
---

:::info{title="This chapter mainly introduces knowledge related to Angular nodes. By reading, you can learn"}

- How to use Angular to render node content
- How to update node content
- FAQ

:::

## Rendering Nodes

We provide a standalone package `@antv/x6-angular-shape` for rendering Angular components/templates as nodes.

:::warning{title=Note}
Version compatibility: X6 3.x must use x6-angular-shape 3.x.
:::

### Component Rendering

```ts
@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements AfterViewInit, OnChanges {
  @Input() value: string;
}
```

```ts
import { register } from '@antv/x6-angular-shape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    register({
      shape: 'custom-angular-component-node',
      width: 120,
      height: 20,
      content: NodeComponent,
      injector: this.injector,
    });

    this.graph.addNode({
      shape: 'custom-angular-component-node',
      x: 100,
      y: 100,
      data: {
        // Input parameters must be placed here
        ngArguments: {
          value: 'Oh my god, what a mess',
        },
      },
    });
  }
}
```

### TemplateRef Rendering

```html
<ng-template #template let-data="ngArguments">
  <section class="template-container">
    <span class="value">{{ data.value }}</span>
  </section>
</ng-template>
```

```ts
import { register } from '@antv/x6-angular-shape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('template') template: TemplateRef<{}>;

  ngAfterViewInit(): void {
    register({
      shape: 'custom-angular-template-node',
      width: 120,
      height: 20,
      content: this.template,
      injector: this.injector,
    });

    this.graph.addNode({
      shape: 'custom-angular-template-node',
      x: 100,
      y: 100,
      data: {
        ngArguments: {
          value: 'Why is the magic failing?',
        },
      },
    });
  }
}
```

## Updating Nodes

Whether using Component or TemplateRef, the update method is the same.

```ts
node.setData({
  ngArguments: {
    value: 'A few frames from the past in the evening breeze',
  },
});
```

## Is there a demo?

Yes, because the rendering of nodes in X6 is decoupled from the framework, the `x6-angular-shape` package is not directly modified in the source code but developed in a separate Angular environment. The demo also provides performance tests for various node types. For more details, please refer to [Eve-Sama/x6-angular-shape](https://github.com/Eve-Sama/x6-angular-shape) and [Performance comparison between X6 and G6, as well as discussions on FPS thresholds for multiple node types in X6](https://github.com/antvis/X6/issues/3266).

## FAQ

### Why can't input properties be placed directly in data and must be placed in ngArguments? And why is it not called ngInput?

Not all properties in `node.data` are input properties, so it is inappropriate to iterate over all properties in `data` for assignment. The reason it is called `ngArguments` is mainly due to two considerations:

- 1. The 1.x version has already used this, and maintaining this API can reduce the upgrade cost for users.
- The concept of `Input` actually comes from `Component`, while in `TemplateRef` it is `context`. Abstracting a concept of `Arguments` based on the two is more general.

### Are there any new features in version 2.x of x6-angular-shape compared to version 1.x?

The implementation approach is quite similar to before, but there are indeed a few points worth mentioning.

#### More Focused Demo

The demo in version 1.x included a series of cases such as rendering components, drawing connections, clearing, etc. While it seemed like an extension, it was actually overwhelming. The demo for version 2.x of `x6-angular-shape` is more focused, concentrating on the usage and performance testing of shapes. For unrelated content, please refer to the X6 official website.

#### More Stable Functionality

In version 1.x, although functionality was implemented, the consideration of usage scenarios was not comprehensive. For example, changes to `ngArguments` did not affect the `TemplateRef` scenario. While it worked for `Component`, it could not trigger `ngOnChanges`. In the new version, these issues will no longer exist.

### Version Requirements

Your Angular version must be at least 14 or above. Below version 14, some features need to be implemented using hacks, which can be cumbersome. This is not currently provided, but if needed, you can raise an issue, and I will explain how to implement it.
