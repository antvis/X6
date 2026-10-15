import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{a as t,g as n}from"./src.B2JqLNiB.js";import{t as r}from"./insert-css.Bh27PzyC.js";var i=e(r()),a=document.getElementById(`container`);a.classList.add(`virtual-render`);var o=new n({container:a,mousewheel:!0,virtual:!0,grid:!0});o.use(new t({enabled:!0,pannable:!0}));var s=[],c=80,l=30,u=20,d=120,f=50,p=1e3,m=[`加载中…`,`同步中…`,`处理任务…`,`拉取数据…`,`发布中…`],h=[`loader-dots`,`loader-bar`,`loader-wave`,`loader-glow`,`loader-ants`];for(let e=0;e<p;e++){let t=Math.floor(e/u),n=50+e%u*d,r=50+t*f,i=o.addNode({x:n,y:r,width:c,height:l,position:{x:n,y:r},attrs:{label:{text:m[e%m.length],fill:`#0958D9`,fontSize:12},body:{fill:e%2==0?`#E6F4FF`:`#FFFFFF`,stroke:`#5f95ff`,strokeWidth:1,rx:4,ry:4,class:h[e%h.length]}}});s.push(i)}for(let e=0;e<p;e++){e%u<19&&e+1<s.length&&o.addEdge({source:s[e],target:s[e+1],attrs:{line:{stroke:`#91CAFF`,strokeWidth:1,strokeDasharray:`6 4`,class:`marching-line`}}});let t=e+u;t<s.length&&o.addEdge({source:s[e],target:s[t],attrs:{line:{stroke:`#91CAFF`,strokeWidth:1,strokeDasharray:`6 4`,class:`marching-line`}}})}(0,i.default)(`
@keyframes ants { to { stroke-dashoffset: -100; } }
@keyframes dotsFlow { to { stroke-dashoffset: -24; } }
@keyframes progressSweep { to { stroke-dashoffset: -220; } }
@keyframes waveWidth {
  0%, 100% { stroke-width: 1; }
  50% { stroke-width: 2.2; }
}
@keyframes glowFade {
  0%, 100% { stroke-opacity: 0.8; }
  50% { stroke-opacity: 0.45; }
}

.virtual-render .x6-edge path.marching-line {
  animation: ants 6s linear infinite;
}
.virtual-render .x6-edge:hover path.marching-line {
  stroke: #5f95ff;
  stroke-width: 1.3px;
}
.virtual-render .x6-edge-selected path.marching-line {
  stroke: #5f95ff;
  stroke-width: 1.8px !important;
}

.virtual-render .x6-node rect.loader-dots {
  transform-box: fill-box;
  transform-origin: center;
  stroke-dasharray: 2 6;
  animation: dotsFlow 2.4s linear infinite;
}
.virtual-render .x6-node rect.loader-bar {
  transform-box: fill-box;
  transform-origin: center;
  stroke-dasharray: 80 140;
  animation: progressSweep 4.8s linear infinite;
}
.virtual-render .x6-node rect.loader-wave {
  transform-box: fill-box;
  transform-origin: center;
  animation: waveWidth 3s ease-in-out infinite;
}
.virtual-render .x6-node rect.loader-glow {
  transform-box: fill-box;
  transform-origin: center;
  animation: glowFade 2.8s ease-in-out infinite;
}
.virtual-render .x6-node rect.loader-ants {
  transform-box: fill-box;
  transform-origin: center;
  stroke-dasharray: 6 4;
  animation: ants 6s linear infinite;
}

.virtual-render .x6-node-selected rect {
  stroke: #5f95ff;
  stroke-width: 2px;
}
`);