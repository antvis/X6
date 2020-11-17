(this["webpackJsonpapi.ui.menubar.basic"]=this["webpackJsonpapi.ui.menubar.basic"]||[]).push([[0],{115:function(h,d,n){"use strict";n.r(d),n.d(d,"host",function(){return v}),n.d(d,"getCodeSandboxParams",function(){return e}),n.d(d,"getStackblitzPrefillConfig",function(){return I});const v="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/menubar/basic";function e(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'
import 'antd/dist/antd.css'

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // tslint:disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
  }

  render() {
    return (
      <div style={{ height: 240, padding: 32 }}>
        <div
          style={{
            background: '#f5f5f5',
            display: 'flex',
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            margin: '-24px -24px 0 -24px',
          }}
        >
          <Menubar extra={<div>Extra Component</div>}>
            <MenubarItem text="File">
              <Menu>
                <MenuItem hotkey="Cmd+N">New File</MenuItem>
                <MenuItem hotkey="Cmd+Shift+N">New Window</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+O">Open...</MenuItem>
                <MenuItem>Open Workspace...</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+S">Save</MenuItem>
                <MenuItem hotkey="Cmd+Shift+S">Save As...</MenuItem>
                <MenuItem hotkey="Cmd+Alt+S">Save All</MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Edit">
              <Menu>
                <MenuItem name="undo" hotkey="Cmd+Z">
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
                <Divider />
                <MenuItem name="find" hotkey="Cmd+F">
                  Find
                </MenuItem>
                <MenuItem name="replace" hotkey="Cmd+Alt+F">
                  Replace
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="View">
              <Menu>
                <MenuItem name="zen" hotkey="Cmd+K Z">
                  Zen Mode
                </MenuItem>
                <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                  Full Screen
                </MenuItem>
                <Divider />
                <SubMenu text="Appearance">
                  <MenuItem name="side-bar">Show Side Bar</MenuItem>
                  <MenuItem name="status-bar">Show Status Bar</MenuItem>
                  <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
                  <MenuItem name="editor-area">Show Editor Area</MenuItem>
                  <MenuItem name="show-panel">Show Panel</MenuItem>
                </SubMenu>
                <Divider />
                <MenuItem name="zoomin" hotkey="Cmd +">
                  Zoom In
                </MenuItem>
                <MenuItem name="zoomout" hotkey="Cmd -">
                  Zoom Out
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Help">
              <Menu>
                <MenuItem name="welcome">Welcome</MenuItem>
                <MenuItem name="documention">Documention</MenuItem>
                <MenuItem name="about">Aoubt</MenuItem>
              </Menu>
            </MenubarItem>
          </Menubar>
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
`,isBinary:!1}}}}function I(){return{title:"api/ui/menubar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'
import 'antd/dist/antd.css'

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // tslint:disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
  }

  render() {
    return (
      <div style={{ height: 240, padding: 32 }}>
        <div
          style={{
            background: '#f5f5f5',
            display: 'flex',
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            margin: '-24px -24px 0 -24px',
          }}
        >
          <Menubar extra={<div>Extra Component</div>}>
            <MenubarItem text="File">
              <Menu>
                <MenuItem hotkey="Cmd+N">New File</MenuItem>
                <MenuItem hotkey="Cmd+Shift+N">New Window</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+O">Open...</MenuItem>
                <MenuItem>Open Workspace...</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+S">Save</MenuItem>
                <MenuItem hotkey="Cmd+Shift+S">Save As...</MenuItem>
                <MenuItem hotkey="Cmd+Alt+S">Save All</MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Edit">
              <Menu>
                <MenuItem name="undo" hotkey="Cmd+Z">
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
                <Divider />
                <MenuItem name="find" hotkey="Cmd+F">
                  Find
                </MenuItem>
                <MenuItem name="replace" hotkey="Cmd+Alt+F">
                  Replace
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="View">
              <Menu>
                <MenuItem name="zen" hotkey="Cmd+K Z">
                  Zen Mode
                </MenuItem>
                <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                  Full Screen
                </MenuItem>
                <Divider />
                <SubMenu text="Appearance">
                  <MenuItem name="side-bar">Show Side Bar</MenuItem>
                  <MenuItem name="status-bar">Show Status Bar</MenuItem>
                  <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
                  <MenuItem name="editor-area">Show Editor Area</MenuItem>
                  <MenuItem name="show-panel">Show Panel</MenuItem>
                </SubMenu>
                <Divider />
                <MenuItem name="zoomin" hotkey="Cmd +">
                  Zoom In
                </MenuItem>
                <MenuItem name="zoomout" hotkey="Cmd -">
                  Zoom Out
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Help">
              <Menu>
                <MenuItem name="welcome">Welcome</MenuItem>
                <MenuItem name="documention">Documention</MenuItem>
                <MenuItem name="about">Aoubt</MenuItem>
              </Menu>
            </MenubarItem>
          </Menubar>
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
`}}}},116:function(h,d,n){},120:function(h,d,n){},132:function(h,d,n){"use strict";n.r(d);var v=n(0),e=n.n(v),I=n(4),k=n.n(I),b=n(8),y=n(9),C=n(11),g=n(10),w=n(137),c=n(139),R=n(141),Z=n(83),H=n(84),V=n(54),t=c.a.Item,O=c.a.SubMenu,p=c.a.Divider,f=R.a.Item,U=function(s){Object(C.a)(a,s);var i=Object(g.a)(a);function a(){var m;Object(b.a)(this,a);for(var o=arguments.length,l=new Array(o),r=0;r<o;r++)l[r]=arguments[r];return m=i.call.apply(i,[this].concat(l)),m.onMenuClick=function(u){w.b.success("".concat(u," clicked"),10)},m.onMenuItemClick=function(){m.onMenuClick("undo")},m}return Object(y.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{style:{height:240,padding:32}},e.a.createElement("div",{style:{background:"#f5f5f5",display:"flex",height:30,paddingLeft:12,paddingRight:12,margin:"-24px -24px 0 -24px"}},e.a.createElement(R.a,{extra:e.a.createElement("div",null,"Extra Component")},e.a.createElement(f,{text:"File"},e.a.createElement(c.a,null,e.a.createElement(t,{hotkey:"Cmd+N"},"New File"),e.a.createElement(t,{hotkey:"Cmd+Shift+N"},"New Window"),e.a.createElement(p,null),e.a.createElement(t,{hotkey:"Cmd+O"},"Open..."),e.a.createElement(t,null,"Open Workspace..."),e.a.createElement(p,null),e.a.createElement(t,{hotkey:"Cmd+S"},"Save"),e.a.createElement(t,{hotkey:"Cmd+Shift+S"},"Save As..."),e.a.createElement(t,{hotkey:"Cmd+Alt+S"},"Save All"))),e.a.createElement(f,{text:"Edit"},e.a.createElement(c.a,null,e.a.createElement(t,{name:"undo",hotkey:"Cmd+Z"},"Undo"),e.a.createElement(t,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),e.a.createElement(p,null),e.a.createElement(t,{name:"cut",hotkey:"Cmd+X"},"Cut"),e.a.createElement(t,{name:"copy",hotkey:"Cmd+C"},"Copy"),e.a.createElement(t,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),e.a.createElement(p,null),e.a.createElement(t,{name:"find",hotkey:"Cmd+F"},"Find"),e.a.createElement(t,{name:"replace",hotkey:"Cmd+Alt+F"},"Replace"))),e.a.createElement(f,{text:"View"},e.a.createElement(c.a,null,e.a.createElement(t,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),e.a.createElement(t,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),e.a.createElement(p,null),e.a.createElement(O,{text:"Appearance"},e.a.createElement(t,{name:"side-bar"},"Show Side Bar"),e.a.createElement(t,{name:"status-bar"},"Show Status Bar"),e.a.createElement(t,{name:"activity-bar"},"Show Activity Bar"),e.a.createElement(t,{name:"editor-area"},"Show Editor Area"),e.a.createElement(t,{name:"show-panel"},"Show Panel")),e.a.createElement(p,null),e.a.createElement(t,{name:"zoomin",hotkey:"Cmd +"},"Zoom In"),e.a.createElement(t,{name:"zoomout",hotkey:"Cmd -"},"Zoom Out"))),e.a.createElement(f,{text:"Help"},e.a.createElement(c.a,null,e.a.createElement(t,{name:"welcome"},"Welcome"),e.a.createElement(t,{name:"documention"},"Documention"),e.a.createElement(t,{name:"about"},"Aoubt"))))))}}]),a}(e.a.Component),D=n(142),X=n(135),P=n(143),A=n(144),L=n(145),M=n(138),N=n(65),j=n(66),W=n(116),x=n(115),T=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},F=function(s){Object(C.a)(a,s);var i=Object(g.a)(a);function a(){return Object(b.a)(this,a),i.apply(this,arguments)}return Object(y.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(M.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},e.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(M.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(X.a,{component:T}))),e.a.createElement(M.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(x.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(P.a,null))),e.a.createElement(M.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(j.getParameters)(x.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(A.a,null)))),e.a.createElement(M.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},e.a.createElement(L.a,{onClick:function(){N.a.openProject(x.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),a}(e.a.Component),z=n(140),J=n(120),S=function(s){Object(C.a)(a,s);var i=Object(g.a)(a);function a(m){var o;return Object(b.a)(this,a),o=i.call(this,m),o.refContainer=function(l){o.container=l},a.restoreIframeSize(),o}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){o.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var l=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(l+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(F,null),this.props.children)}}]),a}(e.a.Component);(function(s){var i=window.location.pathname,a="x6-iframe-size";function m(){var r=localStorage.getItem(a),u;if(r)try{u=JSON.parse(r)}catch(E){}else u={};return u}function o(){var r=window.frameElement;if(r){var u=r.style,E={width:u.width,height:u.height},_=m();_[i]=E,localStorage.setItem(a,JSON.stringify(_))}}s.saveIframeSize=o;function l(){var r=window.frameElement;if(r){var u=m(),E=u[i];E&&(r.style.width=E.width||"100%",r.style.height=E.height||"auto")}}s.restoreIframeSize=l})(S||(S={}));var Y=n(121),B=function(i){var a=i.children;return e.a.createElement(z.a.ErrorBoundary,null,e.a.createElement(S,null,a))};k.a.render(e.a.createElement(B,null,e.a.createElement(U,null)),document.getElementById("root"))},78:function(h,d,n){h.exports=n(132)}},[[78,1,2]]]);
