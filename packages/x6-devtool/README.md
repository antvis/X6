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

![image](https://user-images.githubusercontent.com/1826685/223881189-bf99f2ad-5158-4c39-8d16-018a287ac2fe.png)


## Features

### Inspect Element in Graph

![image](https://user-images.githubusercontent.com/1826685/223881189-bf99f2ad-5158-4c39-8d16-018a287ac2fe.png)

### View and Modify Attributes of Element

![image](https://user-images.githubusercontent.com/1826685/223881189-bf99f2ad-5158-4c39-8d16-018a287ac2fe.png)

### Using select element directly in graph

![image](https://user-images.githubusercontent.com/1826685/223881189-bf99f2ad-5158-4c39-8d16-018a287ac2fe.png)



