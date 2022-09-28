(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.group.collapsable"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.group.collapsable"]||[]).push([[0],{70:function(v,p,n){v.exports=n(88)},76:function(v,p,n){},80:function(v,p,n){},81:function(v,p,n){"use strict";n.r(p),n.d(p,"host",function(){return A}),n.d(p,"getCodeSandboxParams",function(){return e}),n.d(p,"getStackblitzPrefillConfig",function(){return D});const A="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/group/collapsable";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
    "@types/react": "^16.9.19",
    "@types/react-dom": "^16.9.5",
    "typescript": "^4.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,isBinary:!1},"public/index.html":{content:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,isBinary:!1},"src/app.css":{content:`.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
}

.app-content {
  flex: 1;
  height: 360px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph } from '@antv/x6'
import { Group } from './shape'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const createGroup = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
    ) => {
      const group = new Group({
        id,
        x,
        y,
        width,
        height,
        attrs: {
          body: { fill },
          label: { text: id },
        },
      })
      graph.addNode(group)
      return group
    }

    const createNode = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
    ) => {
      return graph.addNode({
        id,
        x,
        y,
        width,
        height,
        attrs: {
          body: {
            fill: fill || 'blue',
            stroke: 'none',
          },
          label: {
            text: id,
            fill: '#fff',
            fontSize: 12,
          },
        },
      })
    }

    const createEdge = (
      id: string,
      source: string,
      target: string,
      vertices?: { x: number; y: number }[],
    ) => {
      return graph.addEdge({
        id,
        source,
        target,
        vertices,
        label: id,
      })
    }

    const a = createGroup('a', 100, 40, 480, 280, '#91d5ff')
    const aa = createGroup('aa', 180, 100, 160, 140, '#47C769')
    const aaa = createGroup('aaa', 200, 160, 120, 40, '#3199FF')
    const c = createNode('c', 450, 200, 50, 50, 'orange')

    a.addChild(aa)
    aa.addChild(aaa)
    a.addChild(c)

    createNode('d', 680, 80, 50, 50, 'black')

    createEdge('edge1', 'aa', 'c')
    createEdge('edge3', 'c', 'd')
    aa.addChild(
      createEdge('edge2', 'aa', 'aaa', [
        { x: 60, y: 140 },
        { x: 60, y: 220 },
      ]),
    )

    graph.on('node:collapse', ({ node }: { node: Group }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const collapse = (parent: Group) => {
        const cells = parent.getChildren()
        if (cells) {
          cells.forEach((cell) => {
            if (collapsed) {
              cell.hide()
            } else {
              cell.show()
            }

            if (cell instanceof Group) {
              if (!cell.isCollapsed()) {
                collapse(cell)
              }
            }
          })
        }
      }

      collapse(node)
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,isBinary:!1},"src/index.css":{content:`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,isBinary:!1},"src/index.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/shape.ts":{content:`import { Node } from '@antv/x6'

export class Group extends Node {
  private collapsed: boolean = false
  private expandSize: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      this.resize(100, 32)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this.collapsed = target
  }
}

Group.config({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#ffffff',
      stroke: 'none',
    },
    buttonGroup: {
      refX: 8,
      refY: 8,
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: '#f5f5f5',
      stroke: '#ccc',
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: '#808080',
    },
    label: {
      fontSize: 12,
      fill: '#fff',
      refX: 32,
      refY: 10,
    },
  },
})
`,isBinary:!1},"tsconfig.json":{content:`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`,isBinary:!1}}}}function D(){return{title:"tutorial/basic/group/collapsable",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
    "@types/react": "^16.9.19",
    "@types/react-dom": "^16.9.5",
    "typescript": "^4.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,"public/index.html":`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,"src/app.css":`.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
}

.app-content {
  flex: 1;
  height: 360px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph } from '@antv/x6'
import { Group } from './shape'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
    })

    const createGroup = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
    ) => {
      const group = new Group({
        id,
        x,
        y,
        width,
        height,
        attrs: {
          body: { fill },
          label: { text: id },
        },
      })
      graph.addNode(group)
      return group
    }

    const createNode = (
      id: string,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: string,
    ) => {
      return graph.addNode({
        id,
        x,
        y,
        width,
        height,
        attrs: {
          body: {
            fill: fill || 'blue',
            stroke: 'none',
          },
          label: {
            text: id,
            fill: '#fff',
            fontSize: 12,
          },
        },
      })
    }

    const createEdge = (
      id: string,
      source: string,
      target: string,
      vertices?: { x: number; y: number }[],
    ) => {
      return graph.addEdge({
        id,
        source,
        target,
        vertices,
        label: id,
      })
    }

    const a = createGroup('a', 100, 40, 480, 280, '#91d5ff')
    const aa = createGroup('aa', 180, 100, 160, 140, '#47C769')
    const aaa = createGroup('aaa', 200, 160, 120, 40, '#3199FF')
    const c = createNode('c', 450, 200, 50, 50, 'orange')

    a.addChild(aa)
    aa.addChild(aaa)
    a.addChild(c)

    createNode('d', 680, 80, 50, 50, 'black')

    createEdge('edge1', 'aa', 'c')
    createEdge('edge3', 'c', 'd')
    aa.addChild(
      createEdge('edge2', 'aa', 'aaa', [
        { x: 60, y: 140 },
        { x: 60, y: 220 },
      ]),
    )

    graph.on('node:collapse', ({ node }: { node: Group }) => {
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const collapse = (parent: Group) => {
        const cells = parent.getChildren()
        if (cells) {
          cells.forEach((cell) => {
            if (collapsed) {
              cell.hide()
            } else {
              cell.show()
            }

            if (cell instanceof Group) {
              if (!cell.isCollapsed()) {
                collapse(cell)
              }
            }
          })
        }
      }

      collapse(node)
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,"src/index.css":`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,"src/index.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,"src/shape.ts":`import { Node } from '@antv/x6'

export class Group extends Node {
  private collapsed: boolean = false
  private expandSize: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      this.resize(100, 32)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this.collapsed = target
  }
}

Group.config({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#ffffff',
      stroke: 'none',
    },
    buttonGroup: {
      refX: 8,
      refY: 8,
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: '#f5f5f5',
      stroke: '#ccc',
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: '#808080',
    },
    label: {
      fontSize: 12,
      fill: '#fff',
      refX: 32,
      refY: 10,
    },
  },
})
`,"tsconfig.json":`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`}}}},86:function(v,p,n){},88:function(v,p,n){"use strict";n.r(p);var A=n(0),e=n.n(A),D=n(20),R=n.n(D),y=n(1),C=n(2),w=n(3),N=n(4),L=n(42),M=function(c){Object(w.a)(t,c);var i=Object(N.a)(t);function t(){var r;Object(y.a)(this,t);for(var a=arguments.length,s=new Array(a),o=0;o<a;o++)s[o]=arguments[o];return r=i.call.apply(i,[this].concat(s)),r.collapsed=!1,r.expandSize=void 0,r}return Object(C.a)(t,[{key:"postprocess",value:function(){this.toggleCollapse(!1)}},{key:"isCollapsed",value:function(){return this.collapsed}},{key:"toggleCollapse",value:function(a){var s=a??!this.collapsed;s?(this.attr("buttonSign",{d:"M 1 5 9 5 M 5 1 5 9"}),this.expandSize=this.getSize(),this.resize(100,32)):(this.attr("buttonSign",{d:"M 2 5 8 5"}),this.expandSize&&this.resize(this.expandSize.width,this.expandSize.height)),this.collapsed=s}}]),t}(L.b);M.config({markup:[{tagName:"rect",selector:"body"},{tagName:"text",selector:"label"},{tagName:"g",selector:"buttonGroup",children:[{tagName:"rect",selector:"button",attrs:{"pointer-events":"visiblePainted"}},{tagName:"path",selector:"buttonSign",attrs:{fill:"none","pointer-events":"none"}}]}],attrs:{body:{refWidth:"100%",refHeight:"100%",strokeWidth:1,fill:"#ffffff",stroke:"none"},buttonGroup:{refX:8,refY:8},button:{height:14,width:16,rx:2,ry:2,fill:"#f5f5f5",stroke:"#ccc",cursor:"pointer",event:"node:collapse"},buttonSign:{refX:3,refY:2,stroke:"#808080"},label:{fontSize:12,fill:"#fff",refX:32,refY:10}}});var W=n(76),X=function(c){Object(w.a)(t,c);var i=Object(N.a)(t);function t(){var r;Object(y.a)(this,t);for(var a=arguments.length,s=new Array(a),o=0;o<a;o++)s[o]=arguments[o];return r=i.call.apply(i,[this].concat(s)),r.container=void 0,r.refContainer=function(l){r.container=l},r}return Object(C.a)(t,[{key:"componentDidMount",value:function(){var a=new L.a({container:this.container,grid:!0}),s=function(d,m,h,g,x,E){var f=new M({id:d,x:m,y:h,width:g,height:x,attrs:{body:{fill:E},label:{text:d}}});return a.addNode(f),f},o=function(d,m,h,g,x,E){return a.addNode({id:d,x:m,y:h,width:g,height:x,attrs:{body:{fill:E||"blue",stroke:"none"},label:{text:d,fill:"#fff",fontSize:12}}})},l=function(d,m,h,g){return a.addEdge({id:d,source:m,target:h,vertices:g,label:d})},u=s("a",100,40,480,280,"#91d5ff"),b=s("aa",180,100,160,140,"#47C769"),Y=s("aaa",200,160,120,40,"#3199FF"),J=o("c",450,200,50,50,"orange");u.addChild(b),b.addChild(Y),u.addChild(J),o("d",680,80,50,50,"black"),l("edge1","aa","c"),l("edge3","c","d"),b.addChild(l("edge2","aa","aaa",[{x:60,y:140},{x:60,y:220}])),a.on("node:collapse",function(O){var d=O.node;d.toggleCollapse();var m=d.isCollapsed(),h=function g(x){var E=x.getChildren();E&&E.forEach(function(f){m?f.hide():f.show(),f instanceof M&&(f.isCollapsed()||g(f))})};h(d)})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),j=n(95),T=n(91),G=n(96),k=n(97),S=n(94),Z=n(77),I=n(51),K=n(80),z=n(81),V=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},P=function(c){Object(w.a)(t,c);var i=Object(N.a)(t);function t(){return Object(y.a)(this,t),i.apply(this,arguments)}return Object(C.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(j.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(T.a,{component:V}))),e.a.createElement(S.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(z.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(G.a,null))),e.a.createElement(S.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(I.getParameters)(z.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(k.a,null)))))}}]),t}(e.a.Component),H=n(92),B=n(65),Q=n(86),U=function(c){Object(w.a)(t,c);var i=Object(N.a)(t);function t(r){var a;return Object(y.a)(this,t),a=i.call(this,r),a.refContainer=function(s){a.container=s},t.restoreIframeSize(),a}return Object(C.a)(t,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){a.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var s=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(s+16,"px"),a.style.border="0",a.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(P,null),this.props.children)}}]),t}(e.a.Component);(function(c){var i=window.location.pathname,t="x6-iframe-size";function r(){var o=localStorage.getItem(t),l;if(o)try{l=JSON.parse(o)}catch(u){}else l={};return l}function a(){var o=window.frameElement;if(o){var l=o.style,u={width:l.width,height:l.height},b=r();b[i]=u,localStorage.setItem(t,JSON.stringify(b))}}c.saveIframeSize=a;function s(){var o=window.frameElement;if(o){var l=r(),u=l[i];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}c.restoreIframeSize=s})(U||(U={}));var $=n(87),F=function(i){var t=i.children;return e.a.createElement(H.a.ErrorBoundary,null,e.a.createElement(B.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(U,null,t))};R.a.render(e.a.createElement(F,null,e.a.createElement(X,null)),document.getElementById("root"))}},[[70,1,2]]]);
