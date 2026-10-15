import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{Lt as t,g as n,i as r}from"./src.B2JqLNiB.js";import{t as i}from"./insert-css.Bh27PzyC.js";import{t as a}from"./jsx-runtime.BIPumRIh.js";import{n as o}from"./es.DcdS1ezF.js";import{t as s}from"./dag.Dyrd71TN.js";var c=e(a()),l=e(i());function u(e){let t,n=e[0],r=1;for(;r<e.length;){let i=e[r],a=e[r+1];if(r+=2,(i===`optionalAccess`||i===`optionalCall`)&&n==null)return;i===`access`||i===`optionalAccess`?(t=n,n=a(n)):(i===`call`||i===`optionalCall`)&&(n=a((...e)=>n.call(t,...e)),t=void 0)}return n}var d={logo:`https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ`,success:`https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ`,failed:`https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ`,running:`https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ`};o({shape:`dag-node`,width:180,height:36,component:e=>{let{node:t}=e,{label:n,status:r=`default`}=u([t,`optionalAccess`,e=>e.getData,`call`,e=>e()]);return(0,c.jsxs)(`div`,{className:`node ${r}`,children:[(0,c.jsx)(`img`,{src:d.logo,alt:`logo`}),(0,c.jsx)(`span`,{className:`label`,children:n}),(0,c.jsxs)(`span`,{className:`status`,children:[r===`success`&&(0,c.jsx)(`img`,{src:d.success,alt:`success`}),r===`failed`&&(0,c.jsx)(`img`,{src:d.failed,alt:`failed`}),r===`running`&&(0,c.jsx)(`img`,{src:d.running,alt:`running`})]})]})},ports:{groups:{top:{position:`top`,attrs:{circle:{r:4,magnet:!0,stroke:`#C2C8D5`,strokeWidth:1,fill:`#fff`}}},bottom:{position:`bottom`,attrs:{circle:{r:4,magnet:!0,stroke:`#C2C8D5`,strokeWidth:1,fill:`#fff`}}}}}}),n.registerEdge(`dag-edge`,{inherit:`edge`,attrs:{line:{stroke:`#C2C8D5`,strokeWidth:1,targetMarker:null}}},!0),n.registerConnector(`algo-connector`,(e,n)=>{let r=Math.abs(n.y-e.y),i=Math.floor(r/3*2),a={x:e.x,y:e.y+4+i},o={x:n.x,y:n.y-4-i};return t.parse(`
      M ${e.x} ${e.y}
      L ${e.x} ${e.y+4}
      C ${a.x} ${a.y} ${o.x} ${o.y} ${n.x} ${n.y-4}
      L ${n.x} ${n.y}
    `).serialize()},!0);var f=[[{id:`1`,status:`running`},{id:`2`,status:`default`},{id:`3`,status:`default`},{id:`4`,status:`default`}],[{id:`1`,status:`success`},{id:`2`,status:`running`},{id:`3`,status:`default`},{id:`4`,status:`default`}],[{id:`1`,status:`success`},{id:`2`,status:`success`},{id:`3`,status:`running`},{id:`4`,status:`running`}],[{id:`1`,status:`success`},{id:`2`,status:`success`},{id:`3`,status:`success`},{id:`4`,status:`failed`}]],p=new n({container:document.getElementById(`container`),panning:{enabled:!0,eventTypes:[`leftMouseDown`,`mouseWheel`]},mousewheel:{enabled:!0,modifiers:`ctrl`,factor:1.1,maxScale:1.5,minScale:.5},highlighting:{magnetAdsorbed:{name:`stroke`,args:{attrs:{fill:`#fff`,stroke:`#31d0c6`,strokeWidth:4}}}},connecting:{snap:!0,allowBlank:!1,allowLoop:!1,highlight:!0,connector:`algo-connector`,connectionPoint:`anchor`,anchor:`center`,validateMagnet({magnet:e}){return e.getAttribute(`port-group`)!==`top`},createEdge(){return p.createEdge({shape:`dag-edge`,attrs:{line:{strokeDasharray:`5 5`}},zIndex:-1})}}});p.use(new r({multiple:!0,rubberEdge:!0,rubberNode:!0,modifiers:`shift`,rubberband:!0})),p.on(`edge:connected`,({edge:e})=>{e.attr({line:{strokeDasharray:``}})}),p.on(`node:change:data`,({node:e})=>{let t=p.getIncomingEdges(e),{status:n}=e.getData();u([t,`optionalAccess`,e=>e.forEach,`call`,e=>e(e=>{n===`running`?(e.attr(`line/strokeDasharray`,5),e.attr(`line/style/animation`,`running-line 30s infinite linear`)):(e.attr(`line/strokeDasharray`,``),e.attr(`line/style/animation`,``))})])});var m=e=>{let t=[];e.forEach(e=>{e.shape===`dag-node`?t.push(p.createNode(e)):t.push(p.createEdge(e))}),p.resetCells(t)},h=async e=>{u([e.shift(),`optionalAccess`,e=>e.forEach,`call`,e=>e(e=>{let{id:t,status:n}=e,r=p.getCellById(t),i=r.getData();r.setData({...i,status:n})})]),setTimeout(()=>{h(e)},3e3)};Promise.resolve(s).then(e=>{m(e),h(f),p.centerContent()}),(0,l.default)(`
.node {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #c2c8d5;
  border-left: 4px solid #5F95FF;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
}
.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}
.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}
.node .status {
  flex-shrink: 0;
}
.node.success {
  border-left: 4px solid #52c41a;
}
.node.failed {
  border-left: 4px solid #ff4d4f;
}
.node.running .status img {
  animation: spin 1s linear infinite;
}
.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #d4e8fe;
}
.x6-node-selected .node.success {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}
.x6-node-selected .node.failed {
  border-color: #ff4d4f;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #fedcdc;
}
.x6-edge:hover path:nth-child(2){
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2){
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}
@keyframes spin {
  from {
      transform: rotate(0deg);
  }
  to {
      transform: rotate(360deg);
  }
}
`);