import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{g as t}from"./src.B2JqLNiB.js";import{t as n}from"./insert-css.Bh27PzyC.js";import{t as r}from"./react.DcD9sFub.js";import{t as i}from"./jsx-runtime.BIPumRIh.js";import{n as a}from"./es.DcdS1ezF.js";import{t as o}from"./er.pDd5gxdR.js";var s=e(i()),c=e(r()),l=e(n());function u(e){let t,n=e[0],r=1;for(;r<e.length;){let i=e[r],a=e[r+1];if(r+=2,(i===`optionalAccess`||i===`optionalCall`)&&n==null)return;i===`access`||i===`optionalAccess`?(t=n,n=a(n)):(i===`call`||i===`optionalCall`)&&(n=a((...e)=>n.call(t,...e)),t=void 0)}return n}var d={primary:`🔑`,foreign:`🔗`,unique:`⭐`},f=c.memo(({node:e})=>{let{name:t,fields:n=[]}=e.getData(),r=36+n.length*24+12;return(0,s.jsxs)(`div`,{className:`er-table`,style:{height:r},children:[(0,s.jsx)(`div`,{className:`er-table-header`,children:t}),(0,s.jsx)(`div`,{className:`er-table-fields`,children:n.length===0?(0,s.jsx)(`div`,{className:`er-table-empty`,children:`No fields`}):n.map((e,t)=>(0,s.jsxs)(`div`,{className:`er-table-field ${t%2==0?`even`:`odd`} ${e.keyType||``}`,children:[(0,s.jsx)(`span`,{className:`er-field-icon`,children:e.keyType?d[e.keyType]:``}),(0,s.jsx)(`span`,{className:`er-field-name`,children:e.name}),(0,s.jsx)(`span`,{className:`er-field-type`,children:e.type})]},e.name))})]})});a({shape:`er-table`,width:240,height:300,component:f,effect:[`data`],ports:{groups:{top:{position:`top`,attrs:{circle:{r:4,magnet:!0,stroke:`#1890ff`,fill:`#fff`}}},right:{position:`right`,attrs:{circle:{r:4,magnet:!0,stroke:`#1890ff`,fill:`#fff`}}},bottom:{position:`bottom`,attrs:{circle:{r:4,magnet:!0,stroke:`#1890ff`,fill:`#fff`}}},left:{position:`left`,attrs:{circle:{r:4,magnet:!0,stroke:`#1890ff`,fill:`#fff`}}}},items:[{id:`top`,group:`top`},{id:`right`,group:`right`},{id:`bottom`,group:`bottom`},{id:`left`,group:`left`}]}}),t.unregisterEdge(`er-relationship`),t.registerEdge(`er-relationship`,{inherit:`edge`,attrs:{line:{stroke:`#666`,strokeWidth:2,targetMarker:{name:`classic`,size:8}}},labels:[{attrs:{text:{text:`1:1`,fill:`#666`,fontSize:12,fontWeight:`bold`},rect:{fill:`#fff`,stroke:`#666`,rx:3,ry:3}}}]});var p=new t({container:document.getElementById(`container`),background:{color:`#f8f9fa`},grid:{visible:!0,type:`dot`,args:{color:`#e0e0e0`}},mousewheel:{enabled:!0,modifiers:`ctrl`,minScale:.3,maxScale:2},panning:{enabled:!0,eventTypes:[`leftMouseDown`,`rightMouseDown`]},connecting:{snap:!0,allowBlank:!1,allowLoop:!1,allowMulti:!1,highlight:!0,router:{name:`manhattan`},connector:{name:`rounded`,args:{radius:8}},createEdge:()=>p.createEdge({shape:`er-relationship`,data:{type:`1:1`},labels:[{attrs:{text:{text:`1:1`}}}]}),validateMagnet:({magnet:e})=>e.getAttribute(`port-group`)!==null}}),m=e=>{let t={cols:2,nodeWidth:240,spacing:100};return e.reduce((e,n,r)=>{let i=Math.floor(r/t.cols),a=r%t.cols,o=36+n.fields.length*24+12;return e.nodes.push({id:n.id,shape:`er-table`,x:a*(t.nodeWidth+t.spacing),y:i*(o+t.spacing),width:t.nodeWidth,height:o,data:n}),n.fields.forEach(t=>{t.keyType===`foreign`&&t.ref&&e.edges.push({id:`${n.id}-${t.ref.table}-${t.name}`,shape:`er-relationship`,source:{cell:n.id,port:`right`},target:{cell:t.ref.table,port:`left`},data:{type:`1:N`},labels:[{attrs:{text:{text:`1:N`}}}]})}),e},{nodes:[],edges:[]})},h=e=>{let t=[`1:1`,`1:N`,`N:N`],n=u([e,`access`,e=>e.getData,`call`,e=>e(),`optionalAccess`,e=>e.type])||`1:1`,r=t[(t.indexOf(n)+1)%t.length];e.setData({...e.getData(),type:r}),e.setLabels([{attrs:{text:{text:r,fill:`#666`,fontSize:12,fontWeight:`bold`},rect:{fill:`#fff`,stroke:`#666`,rx:3,ry:3}},position:.5}])};p.on(`edge:click`,({edge:e,e:t})=>{e.shape===`er-relationship`&&(t.stopPropagation(),h(e))}),p.on(`edge:mouseenter`,({edge:e})=>{e.shape===`er-relationship`&&(e.attr(`line/stroke`,`#1890ff`),e.addTools([{name:`button-remove`,args:{distance:-40,markup:[{tagName:`circle`,selector:`button`,attrs:{r:8,fill:`#ff4d4f`,stroke:`#fff`,strokeWidth:2,cursor:`pointer`}},{tagName:`text`,selector:`icon`,textContent:`×`,attrs:{fill:`#fff`,fontSize:12,fontWeight:`bold`,textAnchor:`middle`,dominantBaseline:`central`}}]}}]))}),p.on(`edge:mouseleave`,({edge:e})=>{e.attr(`line/stroke`,`#666`),e.removeTools()}),(async()=>{let{nodes:e,edges:t}=m(o);p.addNodes(e),p.addEdges(t),p.centerContent()})();function g(){return(0,s.jsx)(`div`,{id:`container`,style:{width:`100%`,height:`100vh`}})}(0,l.default)(`
  .er-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border: 2px solid #1890ff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s ease;
  }

  .er-table:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .er-table-header {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    color: white;
    padding: 8px 12px;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
    border-radius: 6px 6px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .er-table-fields {
    flex: 1;
    overflow: hidden;
    border-radius: 0 0 6px 6px;
  }
  .er-table-empty { padding: 20px; text-align: center; color: #999; font-style: italic; }

  .er-table-field {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    font-size: 11px;
    border-bottom: 1px solid #e8e8e8;
    transition: background-color 0.2s ease;
  }

  .er-table-field:hover { background-color: #f5f5f5; }
  .er-table-field.even { background-color: #fafafa; }
  .er-table-field:last-child {
    border-bottom: none;
    border-radius: 0 0 6px 6px;
  }
  .er-table-field.primary { background-color: #e6f7ff; }
  .er-table-field.foreign { background-color: #fff7e6; }
  .er-table-field.unique { background-color: #f6ffed; }

  .er-field-icon { margin-right: 4px; font-size: 10px; }
  .er-field-name { flex: 1; font-weight: 500; color: #262626; }
  .er-field-type { color: #666; font-family: 'Monaco', 'Menlo', monospace; font-size: 10px; }
  .er-field-not-null { color: #ff4d4f; font-size: 9px; font-weight: bold; margin-left: 4px; }

  .x6-port-body { opacity: 0; transition: opacity 0.2s ease; }
  .x6-node:hover .x6-port-body { opacity: 1; }
  .x6-port-body circle { fill: #fff; stroke: #1890ff; stroke-width: 2; cursor: crosshair; r: 8; }
  .x6-port:hover .x6-port-body circle { fill: #e6f7ff; stroke: #40a9ff; stroke-width: 3; r: 10; }
  .x6-port-available .x6-port-body circle { fill: #f6ffed; stroke: #52c41a; stroke-width: 3; r: 10; }
  .x6-edge:hover path:nth-child(2) { stroke: #1890ff; }
`);export{g as default};