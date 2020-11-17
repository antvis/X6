(this["webpackJsonpapi.ui.menu.basic"]=this["webpackJsonpapi.ui.menu.basic"]||[]).push([[0],{110:function(E,m,n){"use strict";n.r(m),n.d(m,"host",function(){return M}),n.d(m,"getCodeSandboxParams",function(){return e}),n.d(m,"getStackblitzPrefillConfig",function(){return v});const M="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/menu/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { message } from 'antd'
import { Menu } from '@antv/x6-react-components'
import 'antd/dist/antd.css'
import '@antv/x6-react-components/es/menu/style/index.css'
import {
  UndoOutlined,
  RedoOutlined,
  ScissorOutlined,
  CopyOutlined,
  SnippetsOutlined,
  DeleteOutlined,
  DesktopOutlined,
  FullscreenOutlined,
  ControlOutlined,
} from '@ant-design/icons'

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
  }

  render() {
    return (
      <div style={{ padding: '24px 0 210px 24px' }}>
        <div style={{ display: 'inline-block' }}>
          <Menu onClick={this.onMenuClick}>
            <MenuItem onClick={this.onMenuItemClick} name="undo" hotkey="Cmd+Z">
              Undo
            </MenuItem>
            <MenuItem name="redo" hotkey="Cmd+Shift+Z">
              Redo
            </MenuItem>
            <Divider />
            <MenuItem name="cut" hotkey="Cmd+X">
              Cut
            </MenuItem>
            <MenuItem name="copy" hotkey="Cmd+C">
              Copy
            </MenuItem>
            <MenuItem name="paste" hotkey="Cmd+V" disabled={true}>
              Paste
            </MenuItem>
            <MenuItem name="delete" hotkey="Delete">
              Delete
            </MenuItem>
            <Divider />
            <SubMenu text="Appearance">
              <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                Full Screen
              </MenuItem>
              <MenuItem name="zen" hotkey="Cmd+K Z">
                Zen Mode
              </MenuItem>
              <Divider />
              <MenuItem name="side-bar">Show Side Bar</MenuItem>
              <MenuItem name="status-bar">Show Status Bar</MenuItem>
              <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
              <MenuItem name="editor-area">Show Editor Area</MenuItem>
              <MenuItem name="show-panel">Show Panel</MenuItem>
            </SubMenu>
          </Menu>
        </div>
        <div style={{ display: 'inline-block', marginLeft: 32 }}>
          <Menu hasIcon={true} onClick={this.onMenuClick}>
            <MenuItem
              onClick={this.onMenuItemClick}
              name="undo"
              icon={<UndoOutlined />}
              hotkey="Cmd+Z"
              text="Undo"
              active={true}
            />
            <MenuItem
              name="redo"
              icon={<RedoOutlined />}
              hotkey="Cmd+Shift+Z"
              text="Redo"
            />
            <Divider />
            <MenuItem
              name="cut"
              icon={<ScissorOutlined />}
              hotkey="Cmd+X"
              text="Cut"
            />
            <MenuItem
              name="copy"
              icon={<CopyOutlined />}
              hotkey="Cmd+C"
              text="Copy"
            />
            <MenuItem
              name="paste"
              icon={<SnippetsOutlined />}
              hotkey="Cmd+V"
              disabled={true}
              text="Paste"
            />
            <MenuItem
              name="delete"
              icon={<DeleteOutlined />}
              hotkey="Delete"
              text="Delete"
            />
            <Divider />
            <SubMenu text="Appearance" icon={<ControlOutlined />} active={true}>
              <MenuItem
                name="zen"
                icon={<DesktopOutlined />}
                hotkey="Cmd+K Z"
                text="Zen Mode"
              />
              <MenuItem
                name="fullscreen"
                icon={<FullscreenOutlined />}
                hotkey="Cmd+Shift+F"
                text="Full Screen"
              />
              <Divider />
              <MenuItem name="side-bar" text="Show Side Bar" />
              <MenuItem name="status-bar" text="Show Status Bar" />
              <MenuItem name="activity-bar" text="Show Activity Bar" />
              <MenuItem name="editor-area" text="Show Editor Area" />
              <MenuItem name="show-panel" text="Show Panel" />
            </SubMenu>
          </Menu>
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"tsconfig.json":{content:`{
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
`,isBinary:!1}}}}function v(){return{title:"api/ui/menu/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`,"src/app.tsx":`import React from 'react'
import { message } from 'antd'
import { Menu } from '@antv/x6-react-components'
import 'antd/dist/antd.css'
import '@antv/x6-react-components/es/menu/style/index.css'
import {
  UndoOutlined,
  RedoOutlined,
  ScissorOutlined,
  CopyOutlined,
  SnippetsOutlined,
  DeleteOutlined,
  DesktopOutlined,
  FullscreenOutlined,
  ControlOutlined,
} from '@ant-design/icons'

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
  }

  render() {
    return (
      <div style={{ padding: '24px 0 210px 24px' }}>
        <div style={{ display: 'inline-block' }}>
          <Menu onClick={this.onMenuClick}>
            <MenuItem onClick={this.onMenuItemClick} name="undo" hotkey="Cmd+Z">
              Undo
            </MenuItem>
            <MenuItem name="redo" hotkey="Cmd+Shift+Z">
              Redo
            </MenuItem>
            <Divider />
            <MenuItem name="cut" hotkey="Cmd+X">
              Cut
            </MenuItem>
            <MenuItem name="copy" hotkey="Cmd+C">
              Copy
            </MenuItem>
            <MenuItem name="paste" hotkey="Cmd+V" disabled={true}>
              Paste
            </MenuItem>
            <MenuItem name="delete" hotkey="Delete">
              Delete
            </MenuItem>
            <Divider />
            <SubMenu text="Appearance">
              <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                Full Screen
              </MenuItem>
              <MenuItem name="zen" hotkey="Cmd+K Z">
                Zen Mode
              </MenuItem>
              <Divider />
              <MenuItem name="side-bar">Show Side Bar</MenuItem>
              <MenuItem name="status-bar">Show Status Bar</MenuItem>
              <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
              <MenuItem name="editor-area">Show Editor Area</MenuItem>
              <MenuItem name="show-panel">Show Panel</MenuItem>
            </SubMenu>
          </Menu>
        </div>
        <div style={{ display: 'inline-block', marginLeft: 32 }}>
          <Menu hasIcon={true} onClick={this.onMenuClick}>
            <MenuItem
              onClick={this.onMenuItemClick}
              name="undo"
              icon={<UndoOutlined />}
              hotkey="Cmd+Z"
              text="Undo"
              active={true}
            />
            <MenuItem
              name="redo"
              icon={<RedoOutlined />}
              hotkey="Cmd+Shift+Z"
              text="Redo"
            />
            <Divider />
            <MenuItem
              name="cut"
              icon={<ScissorOutlined />}
              hotkey="Cmd+X"
              text="Cut"
            />
            <MenuItem
              name="copy"
              icon={<CopyOutlined />}
              hotkey="Cmd+C"
              text="Copy"
            />
            <MenuItem
              name="paste"
              icon={<SnippetsOutlined />}
              hotkey="Cmd+V"
              disabled={true}
              text="Paste"
            />
            <MenuItem
              name="delete"
              icon={<DeleteOutlined />}
              hotkey="Delete"
              text="Delete"
            />
            <Divider />
            <SubMenu text="Appearance" icon={<ControlOutlined />} active={true}>
              <MenuItem
                name="zen"
                icon={<DesktopOutlined />}
                hotkey="Cmd+K Z"
                text="Zen Mode"
              />
              <MenuItem
                name="fullscreen"
                icon={<FullscreenOutlined />}
                hotkey="Cmd+Shift+F"
                text="Full Screen"
              />
              <Divider />
              <MenuItem name="side-bar" text="Show Side Bar" />
              <MenuItem name="status-bar" text="Show Status Bar" />
              <MenuItem name="activity-bar" text="Show Activity Bar" />
              <MenuItem name="editor-area" text="Show Editor Area" />
              <MenuItem name="show-panel" text="Show Panel" />
            </SubMenu>
          </Menu>
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,"tsconfig.json":`{
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
`}}}},111:function(E,m,n){},115:function(E,m,n){},127:function(E,m,n){"use strict";n.r(m);var M=n(0),e=n.n(M),v=n(6),I=n.n(v),C=n(17),y=n(18),x=n(20),O=n(19),R=n(131),h=n(133),W=n(52),$=n(82),D=n(135),U=n(136),X=n(137),w=n(138),_=n(139),P=n(140),L=n(141),A=n(142),N=n(143),t=h.a.Item,b=h.a.SubMenu,c=h.a.Divider,j=function(l){Object(x.a)(o,l);var s=Object(O.a)(o);function o(){var i;Object(C.a)(this,o);for(var a=arguments.length,d=new Array(a),r=0;r<a;r++)d[r]=arguments[r];return i=s.call.apply(s,[this].concat(d)),i.onMenuClick=function(u){R.b.success("".concat(u," clicked"),10)},i.onMenuItemClick=function(){i.onMenuClick("undo")},i}return Object(y.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{style:{padding:"24px 0 210px 24px"}},e.a.createElement("div",{style:{display:"inline-block"}},e.a.createElement(h.a,{onClick:this.onMenuClick},e.a.createElement(t,{onClick:this.onMenuItemClick,name:"undo",hotkey:"Cmd+Z"},"Undo"),e.a.createElement(t,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),e.a.createElement(c,null),e.a.createElement(t,{name:"cut",hotkey:"Cmd+X"},"Cut"),e.a.createElement(t,{name:"copy",hotkey:"Cmd+C"},"Copy"),e.a.createElement(t,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),e.a.createElement(t,{name:"delete",hotkey:"Delete"},"Delete"),e.a.createElement(c,null),e.a.createElement(b,{text:"Appearance"},e.a.createElement(t,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),e.a.createElement(t,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),e.a.createElement(c,null),e.a.createElement(t,{name:"side-bar"},"Show Side Bar"),e.a.createElement(t,{name:"status-bar"},"Show Status Bar"),e.a.createElement(t,{name:"activity-bar"},"Show Activity Bar"),e.a.createElement(t,{name:"editor-area"},"Show Editor Area"),e.a.createElement(t,{name:"show-panel"},"Show Panel")))),e.a.createElement("div",{style:{display:"inline-block",marginLeft:32}},e.a.createElement(h.a,{hasIcon:!0,onClick:this.onMenuClick},e.a.createElement(t,{onClick:this.onMenuItemClick,name:"undo",icon:e.a.createElement(D.a,null),hotkey:"Cmd+Z",text:"Undo",active:!0}),e.a.createElement(t,{name:"redo",icon:e.a.createElement(U.a,null),hotkey:"Cmd+Shift+Z",text:"Redo"}),e.a.createElement(c,null),e.a.createElement(t,{name:"cut",icon:e.a.createElement(X.a,null),hotkey:"Cmd+X",text:"Cut"}),e.a.createElement(t,{name:"copy",icon:e.a.createElement(w.a,null),hotkey:"Cmd+C",text:"Copy"}),e.a.createElement(t,{name:"paste",icon:e.a.createElement(_.a,null),hotkey:"Cmd+V",disabled:!0,text:"Paste"}),e.a.createElement(t,{name:"delete",icon:e.a.createElement(P.a,null),hotkey:"Delete",text:"Delete"}),e.a.createElement(c,null),e.a.createElement(b,{text:"Appearance",icon:e.a.createElement(L.a,null),active:!0},e.a.createElement(t,{name:"zen",icon:e.a.createElement(A.a,null),hotkey:"Cmd+K Z",text:"Zen Mode"}),e.a.createElement(t,{name:"fullscreen",icon:e.a.createElement(N.a,null),hotkey:"Cmd+Shift+F",text:"Full Screen"}),e.a.createElement(c,null),e.a.createElement(t,{name:"side-bar",text:"Show Side Bar"}),e.a.createElement(t,{name:"status-bar",text:"Show Status Bar"}),e.a.createElement(t,{name:"activity-bar",text:"Show Activity Bar"}),e.a.createElement(t,{name:"editor-area",text:"Show Editor Area"}),e.a.createElement(t,{name:"show-panel",text:"Show Panel"})))))}}]),o}(e.a.Component),T=n(144),B=n(129),F=n(145),z=n(146),Z=n(147),f=n(132),V=n(64),H=n(65),Q=n(111),S=n(110),J=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},K=function(l){Object(x.a)(o,l);var s=Object(O.a)(o);function o(){return Object(C.a)(this,o),s.apply(this,arguments)}return Object(y.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},e.a.createElement(T.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(B.a,{component:J}))),e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(F.a,null))),e.a.createElement(f.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(H.getParameters)(S.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(z.a,null)))),e.a.createElement(f.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},e.a.createElement(Z.a,{onClick:function(){V.a.openProject(S.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),o}(e.a.Component),Y=n(134),q=n(115),k=function(l){Object(x.a)(o,l);var s=Object(O.a)(o);function o(i){var a;return Object(C.a)(this,o),a=s.call(this,i),a.refContainer=function(d){a.container=d},o.restoreIframeSize(),a}return Object(y.a)(o,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){a.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var d=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(d+16,"px"),a.style.border="0",a.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(K,null),this.props.children)}}]),o}(e.a.Component);(function(l){var s=window.location.pathname,o="x6-iframe-size";function i(){var r=localStorage.getItem(o),u;if(r)try{u=JSON.parse(r)}catch(p){}else u={};return u}function a(){var r=window.frameElement;if(r){var u=r.style,p={width:u.width,height:u.height},g=i();g[s]=p,localStorage.setItem(o,JSON.stringify(g))}}l.saveIframeSize=a;function d(){var r=window.frameElement;if(r){var u=i(),p=u[s];p&&(r.style.width=p.width||"100%",r.style.height=p.height||"auto")}}l.restoreIframeSize=d})(k||(k={}));var ee=n(116),G=function(s){var o=s.children;return e.a.createElement(Y.a.ErrorBoundary,null,e.a.createElement(k,null,o))};I.a.render(e.a.createElement(G,null,e.a.createElement(j,null)),document.getElementById("root"))},77:function(E,m,n){E.exports=n(127)}},[[77,1,2]]]);
