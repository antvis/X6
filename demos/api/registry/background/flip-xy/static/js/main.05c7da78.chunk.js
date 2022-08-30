(this["webpackJsonp@antv/x6-sites-demos-api.registry.background.flip-xy"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.background.flip-xy"]||[]).push([[0],{70:function(p,s,n){p.exports=n(88)},76:function(p,s,n){},80:function(p,s,n){},81:function(p,s,n){"use strict";n.r(s),n.d(s,"host",function(){return A}),n.d(s,"getCodeSandboxParams",function(){return e}),n.d(s,"getStackblitzPrefillConfig",function(){return f});const A="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/background/flip-xy";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 240px;
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    new Graph({
      container: this.container,
      grid: true,
      background: {
        image:
          'data:image/png;base64,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',
        repeat: 'flip-xy',
        opacity: 0.2,
      },
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
`,isBinary:!1}}}}function f(){return{title:"api/registry/background/flip-xy",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 240px;
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    new Graph({
      container: this.container,
      grid: true,
      background: {
        image:
          'data:image/png;base64,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',
        repeat: 'flip-xy',
        opacity: 0.2,
      },
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
`}}}},86:function(p,s,n){},88:function(p,s,n){"use strict";n.r(s);var A=n(0),e=n.n(A),f=n(20),y=n.n(f),h=n(1),g=n(2),E=n(3),C=n(4),L=n(67),T=n(76),O=function(l){Object(E.a)(t,l);var i=Object(C.a)(t);function t(){var a;Object(h.a)(this,t);for(var r=arguments.length,c=new Array(r),o=0;o<r;o++)c[o]=arguments[o];return a=i.call.apply(i,[this].concat(c)),a.container=void 0,a.refContainer=function(d){a.container=d},a}return Object(g.a)(t,[{key:"componentDidMount",value:function(){new L.a({container:this.container,grid:!0,background:{image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKBklEQVR4nO2ae3BU1R3HP+fc3Wz27uZBngQTfEQeSRAMAQRUQLHFqjNWEa06Mu1oW6elTpkplrGjHWtt1dppRxvro7VlBuujUx8FapWRgSkDhhASkDxAmoCG8EhCks2+d+85/WMDYmUDuckGp833rzt7v7/f+Z7vnnvv+Z1z4P8cYjjB7skzLhCG85toNQch80E3ai3/FGqp3TZSAlMN2wZ4yisXa228BjrvDLefCzbXrQC0fWmjA8NOkGfaFYVa6RogK+uqm8m/ZQWZ827CmTeB8IHdGq3nOPImeOJdRzaOsN4Rhy0DHHnjHxWwIKNqMYV3r8aZU4hzXAHu0hm4SiYL/54toNQ8WVj0itV55MRIix5JSDtBQnMXQO713/rCPU/FPDJmLQEQUosbhqVuFDB0A6qqTKBIpps4C0vOSHHmjgdAKC4djrjRwJAN8IbVRQCO7IKkHMPMHLjSabZUjSKGbICKYwIIpys5aVgf19GFrXfA/xLGDDjfAs43xgw43wLONxznreXieW5XdnSCjInxCMYLQbaW9GlLdDoRe/tbdnSPhozRNaCqyjRDLNeaOwTRq7BwID+rl4QCITQWYJZV/Vug/47UawKN9btTJWm0DBCeqVXLdZBqwCMAhCQtfwJGRg5GRjYy3YsKB7B8J4gcPoCKhEo1YiVKrDSnzvqnMKzVqTAi5QZ4KyrLtZLPa7gawFUymcw5S6hcuIQV0/NYXJCQEFEQ1xp/HLZ2xnm38SAb173FiW3rUeHg9VrJr5rlMx8ONu16AlAjpS+lBmgpFlpK3C3A68jKI3/pD/DOWAhCcOfUtFOdB3BJcCHwGLC02MnS4kn0L15FdfP9PPtcNb1b/ibR4nGzbFZV0NTfoK4uNhIaU2qA0EwFyJn7NVauWs13J5m81h7n2QNRXmyL0eRTNPQqPg0pHAKcUjDRFCzMc/CVQoNLPJIrizy8tvQBPBXzOLLmZ6iA71YzpF8NsuwO+Ks1XI0pMUBbn+nKXnAL7z21mvLMxNJDfGDwdvYFeePgMRxZuUgzA0tDRGmafJomX5Tft0KJW9IVTQSYU2dTsuK3tP9uJVagb6lZ1rY62Mzjw9WaEgNcxZORaW6yF91G7o33ohC0BhS/rGln3Z+fJ7ivFqu/5xTf8GZhTp1NzpLlpBVeeOr3T0Off9TTLiil6L7HaH/mh6DVo2bF7PeDjbW1w9E65LrNnFI5CylrXSVTmLjqxXOK0fEox9/4Db6ad0Gf+uz1AB1AIZBYVxSCzLk3UHD7SoThTJqva/1L9Ly/Fq3ZFGqpWzzUPpyOlM8EVSRExwur8X34D9A6pDVPCymLgs11OcHmumnB5rp8YTjGa8Sv0Drk276Bjpd+gopGkubMue5upJmBEFzrrZh57XD0pdYArTny8iME99UBHJZSzQq11K0KNNYePZ0W2FtzLNS880Ep5GygI9hUw/G1v0guOt1k3KLbEk0o+Z3hSEypAf0Nmwk27wA4plBX+hvrmwbj+5tqG5UyrgJ6+hs2Ez7YmJSbOfdGEBKN/nr25Zdn29WYMgNULEzXW9UACMSD4eb6Q+cSF963ow2hnwboWpf8HePIzsecXAngikYdC+3qTJkBgY+2Ee/tBMTOQPPOtUOJDYrIM4A/9HHDQI4zY8AAhGaRXZ2pM6Bx+8CVfpmhTl0bG/3AFoDQgeTTf9fF0xMtCD3bjkZIoQHRowMjXilb32mt2QQQOtCQlJNWUDxAptROG5BCA+J9A0NXysN24rXUtQDRY58k5TgychDONIDxTJ/usdNOygzQsSgAaS4rZCfeacnjAJa/NzlJCAxPFgBu3OPstJM6A+IJA3q73MlnNINByC4Ay98zOM2VDoAjYn3JRkB8oFptL47aie/3WD4AFfIPypNGYoPGMhIbNkNFygyQjoGdo+J2W9tjWdGoF0C4Bv9jVTQAgCW1z047qTPA9ALgyVaZZ6GeEZGoOxvA8GQMyrP8iX67HZatRdSUGWB4B2anWhXZihfWJABHTmFSjlYKFQkCqN6Ghi/XCHAVTwJAaz3TVgIhLk/kmZKUovy9J8vrbmyuE6bMgPQLywDQmmvsxGvUzQDuiyuSciLt+we4JK+azoKUGeCZNh8hJQJ921CrNW/ZrGkg5kszA0/53KS8cNtHAEjBLrs6U2aAIzsfT8V8gPRoVD42hFCpoRogc+4NJ2d6Z0TkUPPAlf7yGQCQe9N9CMMBWqxwl8+8/VxizPKqn2r0AkdmLrlLliflqYCPYFti5FtxY3tS4lmQUgPSii4m96b7ABBa/MUsq/oeLDvzybSKijR32cwn0TwipKTgrgeRbu+ZE2tNoGYdKhIGxPbw/tpWuxpTty8Q8oE7g3GL70THY3Rv+KMBVJtlrfcLZq1Fq93KkD1aWekCMVMo8W2gXEhJ4T0PD/rs038c3+5/Ja4Fa4YjM3UGBLoh1Ac5JeQsWY6reBKdb1cTO/bpZRr9JEIglEacNghdF1xK4V0/xlUyeZC8PQQ/2kqwrRkgkpYWfz04DJkpMSB65CB9m15hXOXVOKQDsovwVMzDLJtDuG0vgcYPiXW2Y/WfQKR7SMubgLfyGtyXXAZikKfS34U61kbne6+e/OXnvQ0Ng5SLZ0dKDOj54BV8OzbSW7ORSx94ChELQ+5EhDRwl87AXTpjaAmVgr4O8HXStflNoollsj1BkyeHq3XIL0HpFAEAHfKDPvPkK97Vcer68Nt/QPd3w9EWCNn4s0K+RKyvk66tG+jbvQ3AQql7R2KDdMhnhaOZnn6nkf6QjkVFzvQ54DLh5C5OPArdh/DVbSLuS9Tx8b5uwkc/wTNxEjIWSnRIKZAOMAy+sDmlFcQj4O+C7k/A34WOReja/A69OzcBxLTWd4T21X8wvK4nYOtIo1lWdQAonXjPj3AVloDhSKSyYqhImNYXHkFHI2it5gvk2wgKDDODguuW4Z00HcRAs8JIxEqZmNNbMVCf3/ANHW7j+PuvE+0+AhBF66XBll3rh9Xr02DrtLgzv6gAxIJQRysZU2YiDQdohY5GOLphDdGuoyB4L9S864m0wuK1WlOpY5FL/Pvq8X+8GyElabmFCCkTHbbioOKn9g1VLIp/fz1dW96he+t6rMSiSJPW6tZQS/2mkeo82BwBeVOuzAjKcD1QaphezIvKQCuCh/ZjBftBc9zCuDrSsiNRrbDMcJe3fl8oViEoPpnHmZWLw5uJ4clCOJ1YgX7i/j7ivd2o+GcLSULzUMAI/5rGRlurS4PB/qne4nlu0xurRuj/PjO/QRiOewN7a459IaaqyukO6lsFYiVwxVlaqAfelM7Yi/49e47b1nkWDPtYs2faFYU6HpsjhBwnhKjzN9WeW2l60aL0dFewSKAmYOgJUmEiRIcQosMZVu09rXV9w9U2hjGMYQxjGMMYxjCGMSTHfwCcWMxqCG7+YAAAAABJRU5ErkJggg==",repeat:"flip-xy",opacity:.2}})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),N=n(95),b=n(91),M=n(96),w=n(97),m=n(94),V=n(77),S=n(50),G=n(80),D=n(81),j=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},B=function(l){Object(E.a)(t,l);var i=Object(C.a)(t);function t(){return Object(h.a)(this,t),i.apply(this,arguments)}return Object(g.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(N.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(b.a,{component:j}))),e.a.createElement(m.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,null))),e.a.createElement(m.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(S.getParameters)(D.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(w.a,null)))))}}]),t}(e.a.Component),Q=n(92),R=n(64),z=n(86),v=function(l){Object(E.a)(t,l);var i=Object(C.a)(t);function t(a){var r;return Object(h.a)(this,t),r=i.call(this,a),r.refContainer=function(c){r.container=c},t.restoreIframeSize(),r}return Object(g.a)(t,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var c=new window.ResizeObserver(function(){r.updateIframeSize()});c.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var c=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(c+16,"px"),r.style.border="0",r.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(B,null),this.props.children)}}]),t}(e.a.Component);(function(l){var i=window.location.pathname,t="x6-iframe-size";function a(){var o=localStorage.getItem(t),d;if(o)try{d=JSON.parse(o)}catch(u){}else d={};return d}function r(){var o=window.frameElement;if(o){var d=o.style,u={width:d.width,height:d.height},x=a();x[i]=u,localStorage.setItem(t,JSON.stringify(x))}}l.saveIframeSize=r;function c(){var o=window.frameElement;if(o){var d=a(),u=d[i];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}l.restoreIframeSize=c})(v||(v={}));var X=n(87),U=function(i){var t=i.children;return e.a.createElement(Q.a.ErrorBoundary,null,e.a.createElement(R.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(v,null,t))};y.a.render(e.a.createElement(U,null,e.a.createElement(O,null)),document.getElementById("root"))}},[[70,1,2]]]);
