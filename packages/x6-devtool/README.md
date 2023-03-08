# X6 Devtool
> A devtool for @antv/x6 in chrome, it's still WIP, you can load it in unpack way;

## Quick Start

### Import unpacked plugin
![image](https://user-images.githubusercontent.com/15213473/150081309-61f9c451-c35e-4dab-a23c-ed5e425e7ec5.png)

1. Open the Extension Management page by navigating to chrome://extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the 'devtool' directory.

### Connect with X6 Graph;

#### In X6

```javascript
// init window hook
window.__x6_instances__ = [];

var graph = new Graph({...blablabla});

window.__x6_instances__.push(graph);

```

### Using devtool

After these steps, the tab 'AntV X6' should show in devtools' tab, select it and choose a canvas

![image](https://user-images.githubusercontent.com/15213473/150081267-fb22d227-3946-4f08-88e8-55086d047da0.png)


## Features

### Inspect Element in Graph

![image](https://user-images.githubusercontent.com/15213473/150081777-225f785d-60da-4cf6-b443-e8013414b65c.png)

### View and Modify Attributes of Element

![image](https://user-images.githubusercontent.com/15213473/150082189-e915f886-4c60-42a3-b4c6-a731541a0e79.png)

### Using select element directly in graph

![image](https://user-images.githubusercontent.com/15213473/150082485-46b5c750-de64-42f7-882b-a3ff4db95826.png)



