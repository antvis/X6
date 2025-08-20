---
title: Upgrade to Version 2.x
order: 5
redirect_from:
  - /en/docs
  - /en/docs/tutorial
---

Compared to version 1.x, the changes to the external API and configuration are minimal, allowing for an upgrade to version 2.0 at a low cost.

## Upgrade Reference

### package.json

```json
{
  "@antv/x6": "^2.0.0",
  "@antv/x6-plugin-minimap": "^2.0.0", // Install this package if using minimap functionality
  "@antv/x6-plugin-scroller": "^2.0.0", // Install this package if using scrollable canvas functionality
  "@antv/x6-plugin-snapline": "^2.0.0", // Install this package if using alignment line functionality
  "@antv/x6-plugin-dnd": "^2.0.0", // Install this package if using drag-and-drop functionality
  "@antv/x6-plugin-stencil": "^2.0.0", // Install this package if using stencil functionality
  "@antv/x6-plugin-transform": "^2.0.0", // Install this package if using shape transformation functionality
  "@antv/x6-react-components": "^2.0.0", // Install this package if using accompanying UI components
  "@antv/x6-react-shape": "^2.0.0", // Install this package if using React rendering functionality
  "@antv/x6-vue-shape": "^2.0.0" // Install this package if using Vue rendering functionality
}
```

### Configuration Changes

| Property Name  | Change                | Description                                                                |
|----------------|-----------------------|----------------------------------------------------------------------------|
| virtual        | Added                 | Whether to enable visual area rendering capability, default value is `false`. |
| async          | Default value changed to `true` | Default asynchronous rendering for improved performance.                     |
| sorting        | Removed               | Sorting is done in the most performance-optimized way; if special sorting is needed, the order of input data must be controlled externally. |
| frozen         | Removed               | The new asynchronous rendering mode does not require `frozen`.              |
| checkView      | Removed               | Built-in visual area rendering capability, enabling `virtual` configuration. |
| transforming   | Removed               | Default uses optimal configuration, no external configuration needed.       |
| knob           | Removed               | Not widely used, removed in version 2.0.                                   |
| resizing       | Removed               | Use the transform plugin.                                                  |
| rotating       | Removed               | Use the transform plugin.                                                  |
| selecting      | Removed               | Use the selection plugin.                                                  |
| clipboard      | Removed               | Use the clipboard plugin.                                                  |
| snapline       | Removed               | Use the snapline plugin.                                                   |
| history        | Removed               | Use the history plugin.                                                    |
| scroller       | Removed               | Use the scroller plugin.                                                  |
| keyboard       | Removed               | Use the keyboard plugin.                                                  |

### API Changes

| Method Name                | Change | Description                                |
|----------------------------|--------|--------------------------------------------|
| graph.getCell              | Removed | Replaced with `getCellById`.              |
| graph.resizeGraph          | Removed | Replaced with `resize`.                    |
| graph.resizeScroller       | Removed | Replaced with `resize`.                    |
| graph.getArea              | Removed | Replaced with `getGraphArea`.              |
| graph.resizePage           | Removed | Provided by the `scroller` plugin.        |
| graph.scrollToPoint        | Removed | Provided by the `scroller` plugin.        |
| graph.scrollToContent      | Removed | Provided by the `scroller` plugin.        |
| graph.scrollToCell         | Removed | Provided by the `scroller` plugin.        |
| graph.transitionToPoint    | Removed | Provided by the `scroller` plugin.        |
| graph.transitionToRect     | Removed | Provided by the `scroller` plugin.        |
| graph.isFrozen             | Removed | In the new rendering mode, `frozen` related methods are not needed. |
| graph.freeze               | Removed | In the new rendering mode, `frozen` related methods are not needed. |
| graph.unfreeze             | Removed | In the new rendering mode, `frozen` related methods are not needed. |
| graph.isAsync              | Removed | Removed `async` related methods.          |
| graph.setAsync             | Removed | Removed `async` related methods.          |
| graph.isViewMounted        | Removed | Infrequently used method, removed in version 2.0. |
| graph.getMountedViews      | Removed | Infrequently used method, removed in version 2.0. |
| graph.getUnmountedViews    | Removed | Infrequently used method, removed in version 2.0. |
| graph.getClientMatrix      | Removed | Infrequently used method, removed in version 2.0. |
| graph.getPageOffset        | Removed | Infrequently used method, removed in version 2.0. |
| graph.removeTools          | Removed | Infrequently used method, removed in version 2.0. |
| graph.hideTools            | Removed | Infrequently used method, removed in version 2.0. |
| graph.showTools            | Removed | Infrequently used method, removed in version 2.0. |
| graph.printPreview         | Removed | Infrequently used method, removed in version 2.0. |
| cell.animate               | Removed | Will be provided by the `animation` plugin in the future. |
| cell.animateTransform      | Removed | Will be provided by the `animation` plugin in the future. |
| edge.sendToken             | Removed | Will be provided by the `animation` plugin in the future. |

### Using x6-react-shape

For details on using `x6-react-shape`, please refer to the [documentation](/en/tutorial/intermediate/react).

### Using x6-vue-shape

For details on using `x6-vue-shape`, please refer to the [documentation](/en/tutorial/intermediate/vue).

### Using x6-angular-shape

For details on using `x6-angular-shape`, please refer to the [documentation](/en/tutorial/intermediate/angular).

### Plugin Usage

For details on using plugins, please refer to the [documentation](/en/tutorial/plugins/transform).
