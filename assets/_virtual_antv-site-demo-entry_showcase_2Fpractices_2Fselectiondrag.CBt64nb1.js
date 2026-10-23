import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{g as t,i as n}from"./src.DTJrlHdG.js";import{t as r}from"./insert-css.Bh27PzyC.js";var i=e(r()),a=document.getElementById(`container`);a.classList.add(`selection-drag`);var o=new t({container:a,grid:!0,mousewheel:{enabled:!0,factor:1.1,minScale:.1,maxScale:2},panning:!1});o.use(new n({rubberband:!0,multiple:!0,strict:!0,showNodeSelectionBox:!0}));var s=[],c=60,l=30,u=10,d=90,f=50,p=120;for(let e=0;e<p;e++){let t=Math.floor(e/u),n=50+e%u*d,r=50+t*f,i=o.addNode({x:n,y:r,width:c,height:l,attrs:{label:{text:`Node ${e+1}`,fontSize:12,fill:`#0958D9`},body:{fill:e%2==0?`#E6F4FF`:`#FFFFFF`,stroke:`#1677ff`,strokeWidth:1,rx:4,ry:4}}});s.push(i)}for(let e=0;e<p;e++){if(e%u<9){let t=e+1;t<s.length&&o.addEdge({source:s[e],target:s[t],attrs:{line:{stroke:`#91d5ff`,strokeWidth:1}}})}let t=e+u;t<s.length&&o.addEdge({source:s[e],target:s[t],attrs:{line:{stroke:`#91d5ff`,strokeWidth:1}}})}(0,i.default)(`
.selection-drag .x6-widget-selection-rubberband {
  background-color: rgba(22, 119, 255, 0.12);
  border: 1.5px solid #1677ff;
  opacity: 1;
}
.selection-drag .x6-widget-selection-inner {
  border: 2px solid #1677ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
}
.selection-drag .x6-widget-selection-box {
  border: 2px dashed #1677ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
}
.selection-drag .x6-node-selected rect {
  stroke: #1677ff;
  stroke-width: 1.8px;
}
.selection-drag .x6-edge:hover path:nth-child(2){
  stroke: #1677ff;
}
.selection-drag .x6-edge-selected path:nth-child(2){
  stroke: #1677ff !important;
  stroke-width: 1.8px !important;
}
`);