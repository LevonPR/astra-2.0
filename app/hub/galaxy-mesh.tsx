"use client";
import { useEffect, useRef } from "react";

export const galaxies = [
  {name:"LOKI66 PRIME",role:"Coordination",x:.52,y:.51,color:"#ffd59b"},
  {name:"ANDROMEDA",role:"Research",x:.19,y:.26,color:"#67d5ff"},
  {name:"NEXUS CORE",role:"Automation",x:.51,y:.16,color:"#a598ff"},
  {name:"TRIANGULUM",role:"Creative",x:.83,y:.24,color:"#79cfff"},
  {name:"SOMBRERO",role:"Data & analysis",x:.2,y:.64,color:"#c698ff"},
  {name:"CENTAURUS A",role:"Quality assurance",x:.86,y:.61,color:"#ffbc88"},
  {name:"WHIRLPOOL",role:"Engineering",x:.4,y:.85,color:"#929aff"},
  {name:"PINWHEEL",role:"Product",x:.73,y:.85,color:"#ffb5d5"}
];

export default function GalaxyMesh({paused,reduced,selected,onSelect}:{paused:boolean;reduced:boolean;selected:number;onSelect:(n:number)=>void}){
 const ref=useRef<HTMLCanvasElement>(null);
 const clock=useRef(0);
 const labels=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const canvas=ref.current!;const ctx=canvas.getContext("2d");if(!ctx)return;
  let frame=0,last=0,w=1,h=1;let visible=!document.hidden;
  const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw(clock.current);};
  const seed=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
  function draw(t:number){
   if(!ctx)return;ctx.clearRect(0,0,w,h);ctx.fillStyle="#030914";ctx.fillRect(0,0,w,h);
   const unit=Math.min(w,h);const cycle=(1-Math.cos(t*Math.PI/9))/2;
   const collapse=reduced?0:Math.pow(cycle,5)*.55;
   for(let i=0;i<330;i++){const x=seed(i+1)*w,y=seed(i+900)*h;ctx.globalAlpha=.2+seed(i+300)*.5;ctx.fillStyle=i%5===0?"#86baff":"#c2dcff";ctx.fillRect(x,y,seed(i+110)*1.5+.3,seed(i+110)*1.5+.3)}ctx.globalAlpha=1;
   const positions=galaxies.map((g,i)=>({x:(g.x+(.52-g.x)*collapse)*w+Math.sin(t*.14+i)*unit*.007,y:(g.y+(.51-g.y)*collapse)*h+Math.cos(t*.13+i)*unit*.009}));
   positions.forEach((p,i)=>{const label=labels.current?.children[i] as HTMLElement|undefined;if(label){label.style.left=`${p.x}px`;label.style.top=`${p.y}px`;}});
   ctx.globalCompositeOperation="lighter";
   positions.forEach((a,i)=>positions.slice(i+1).forEach((b,j)=>{
    if((i+j)%2!==0)return;
    const bend=unit*(.08+seed(i+j)*.12);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-bend,b.x,b.y);ctx.strokeStyle="rgba(78,151,255,.17)";ctx.lineWidth=.65;ctx.stroke();
    const p=(t*.06+seed(i*8+j))%1;const x=(1-p)**2*a.x+2*(1-p)*p*(a.x+b.x)/2+p*p*b.x;const y=(1-p)**2*a.y+2*(1-p)*p*((a.y+b.y)/2-bend)+p*p*b.y;
    ctx.shadowBlur=12;ctx.shadowColor="#63ceff";ctx.fillStyle="#a8eeff";ctx.beginPath();ctx.arc(x,y,1.7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
   }));
   positions.forEach((p,i)=>{
    const radius=unit*(i===0?.21:.108)*(1-collapse*.55);const g=galaxies[i];
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-.32+i*.55);ctx.scale(1,.53);
    const glow=ctx.createRadialGradient(0,0,0,0,0,radius*1.6);glow.addColorStop(0,i===0?"#a353393d":"#6342c733");glow.addColorStop(.5,"#523dbc22");glow.addColorStop(1,"#04081800");ctx.fillStyle=glow;ctx.fillRect(-radius*1.6,-radius*1.6,radius*3.2,radius*3.2);
    const count=w<600?230:480;
    for(let n=0;n<count;n++){
     const f=seed(n+i*count+40);const r=Math.sqrt(f)*radius;const arm=n%3;
     const angle=arm*Math.PI*2/3+r/radius*6+t*(.11+i*.012)+(seed(n+55)-.5)*(.3+f*.7);
     const x=Math.cos(angle)*r,y=Math.sin(angle)*r;
     ctx.fillStyle=n%6===0?g.color:n%3===0?"#ac78f9":"#72acff";ctx.globalAlpha=(1-f)*.65+.14;
     ctx.beginPath();ctx.arc(x,y,(n%13===0?1.5:.65)*(i===0?1.25:1),0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=.5;ctx.strokeStyle=g.color;ctx.lineWidth=.5;ctx.beginPath();ctx.ellipse(0,0,radius*1.12,radius*1.12,0,0,Math.PI*2);ctx.stroke();
    ctx.globalAlpha=1;const core=ctx.createRadialGradient(0,0,0,0,0,radius*.3);core.addColorStop(0,"#fff6dc");core.addColorStop(.13,"#ffd5a2e0");core.addColorStop(.4,"#ed9e8050");core.addColorStop(1,"#cd6b5000");ctx.fillStyle=core;ctx.beginPath();ctx.arc(0,0,radius*.3,0,Math.PI*2);ctx.fill();ctx.restore();
   });ctx.globalCompositeOperation="source-over";
   const p=positions[selected];ctx.strokeStyle="#8ee6ff88";ctx.lineWidth=1;ctx.setLineDash([3,7]);ctx.beginPath();ctx.arc(p.x,p.y,unit*.055,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  }
  const tick=(now:number)=>{if(!paused&&!reduced&&visible){if(last)clock.current+=Math.min((now-last)/1000,.05);draw(clock.current)}last=now;frame=requestAnimationFrame(tick)};
  const observer=new ResizeObserver(resize);observer.observe(canvas);resize();
  const visibility=()=>{visible=!document.hidden;last=0};document.addEventListener("visibilitychange",visibility);
  if(!paused&&!reduced)frame=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener("visibilitychange",visibility)};
 },[paused,reduced,selected]);
 return <div className="galaxy-canvas"><canvas ref={ref} aria-label="Animated illustrative galaxy network; not live agent telemetry" />
  <div ref={labels} className="galaxy-labels">{galaxies.map((g,i)=><button key={g.name} className={selected===i?"selected":""} style={{left:`${g.x*100}%`,top:`${g.y*100}%`}} onClick={()=>onSelect(i)}><b>{g.name}</b><small>{g.role}</small></button>)}</div>
  <div className="mesh-legend"><span>● Agent concept</span><span>— Mission path</span><span>● Knowledge link</span><span>● Galaxy core</span></div>
  <div className="mesh-watermark">ILLUSTRATIVE NETWORK · 18s COLLAPSE / EXPAND LOOP</div>
 </div>
}
