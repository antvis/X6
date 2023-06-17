# X6 Devtool

> A devtool for @antv/x6 in chrome, it's still WIP, you can load it in unpack way;

## Quick Start

### Install from chrome web store

![image](https://user-images.githubusercontent.com/1826685/238003455-d341f598-1b35-4d8c-bb7c-0320cad6a4cb.png)

### Import unpacked plugin

![image](https://user-images.githubusercontent.com/15213473/150081309-61f9c451-c35e-4dab-a23c-ed5e425e7ec5.png)

1. Open the Extension Management page by navigating to chrome://extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the 'devtool' directory.

### Connect with X6 Graph;

#### In X6

```javascript
// init window hook
window.__x6_instances__ = []

var graph = new Graph({ ...blablabla })

window.__x6_instances__.push(graph)
```

### Using devtool

After these steps, the tab 'AntV X6' should show in devtools' tab, select it and choose a canvas

![image](https://user-images.githubusercontent.com/1826685/238013980-2d6018f8-7d85-473c-a043-98b1f03b6674.png)

## Features

### Inspect Element in Graph

![image](https://user-images.githubusercontent.com/1826685/238014156-e65ec2b0-f719-410e-9a10-89cdb836acde.png)

### View and Modify Attributes of Element

![image](https://user-images.githubusercontent.com/1826685/238014353-124feb8e-2049-499d-a13d-3d26f485bab6.png)
