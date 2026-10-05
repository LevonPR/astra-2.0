"use client";
import { useEffect, useRef } from "react";

export const galaxies=[
 {name:"LOKI66 PRIME",role:"Strategy · Compute",x:.52,y:.51,color:"#ffd59b",agents:4218,missions:112},
 {name:"ANDROMEDA",role:"Research · Knowledge",x:.19,y:.26,color:"#67d5ff",agents:742,missions:12},
 {name:"NEXUS CORE",role:"Coordination · Governance",x:.51,y:.16,color:"#a598ff",agents:3260,missions:48},
 {name:"TRIANGULUM",role:"Multimodal · Creative",x:.83,y:.24,color:"#79cfff",agents:608,missions:9},
 {name:"SOMBRERO",role:"Data · Simulation",x:.2,y:.64,color:"#c698ff",agents:1024,missions:28},
 {name:"CENTAURUS A",role:"Security · Monitoring",x:.86,y:.61,color:"#ffbc88",agents:988,missions:22},
 {name:"WHIRLPOOL",role:"Engineering · Automation",x:.4,y:.85,color:"#929aff",agents:896,missions:16},
 {name:"PINWHEEL",role:"Science · Analysis",x:.73,y:.85,color:"#ffb5d5",agents:732,missions:14}
];

export default function GalaxyMesh({paused,reduced,selected,onSelect}:{paused:boolean;reduced:boolean;selected:number;onSelect:(n:number)=>void}){
 const ref=useRef<HTMLCanvasElement>(null),clock=useRef(0),labels=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const canvas=ref.current!,ctx=canvas.getContext("2d");if(!ctx)return;
  let frame=0,last=0,w=1,h=1,visible=!document.hidden;
  const seed=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};
  const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw(clock.current)};
  function draw(t:number){
   ctx.clearRect(0,0,w,h);const bg=ctx.createRadialGradient(w*.52,h*.5,0,w*.52,h*.5,Math.max(w,h)*.72);bg.addColorStop(0,"#081b36");bg.addColorStop(.42,"#041225");bg.addColorStop(1,"#01050d");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
   const unit=Math.min(w,h),cycle=(1-Math.cos(t*Math.PI/9))/2,collapse=reduced?0:Math.pow(cycle,5)*.48;
   for(let i=0;i<720;i++){const x=seed(i+1)*w,y=seed(i+900)*h,s=seed(i+110)*1.55+.25;ctx.globalAlpha=.12+seed(i+300)*.58;ctx.fillStyle=i%7===0?"#70c8ff":i%11===0?"#c58cff":"#d7ebff";ctx.fillRect(x,y,s,s)}ctx.globalAlpha=1;
   const positions=galaxies.map((g,i)=>({x:(g.x+(.52-g.x)*collapse)*w+Math.sin(t*.14+i)*unit*.008,y:(g.y+(.51-g.y)*collapse)*h+Math.cos(t*.13+i)*unit*.01}));
   positions.forEach((p,i)=>{const el=labels.current?.children[i] as HTMLElement|undefined;if(el){el.style.left=p.x+"px";el.style.top=p.y+"px"}});
   ctx.globalCompositeOperation="lighter";
   positions.forEach((a,i)=>positions.slice(i+1).forEach((b,j)=>{
    if((i+j)%3===2)return;const bend=unit*(.045+seed(i*19+j)*.13),mx=(a.x+b.x)/2+Math.sin(i+j)*bend*.35,my=(a.y+b.y)/2-bend;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(mx,my,b.x,b.y);ctx.strokeStyle=(i+j)%3===0?"rgba(142,96,255,.2)":"rgba(54,178,255,.19)";ctx.lineWidth=.55+seed(i+j)*.65;ctx.stroke();
    for(let q=0;q<2;q++){const p=(t*(.05+q*.018)+seed(i*13+j*7+q*99))%1,x=(1-p)**2*a.x+2*(1-p)*p*mx+p*p*b.x,y=(1-p)**2*a.y+2*(1-p)*p*my+p*p*b.y;ctx.shadowBlur=13;ctx.shadowColor=q?"#b078ff":"#42d8ff";ctx.fillStyle=q?"#d8b9ff":"#b7f5ff";ctx.beginPath();ctx.arc(x,y,1.15+q*.45,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
   }));
   positions.forEach((p,i)=>{
    const g=galaxies[i],radius=unit*(i===0?.205:.105)*(1-collapse*.5);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(-.32+i*.55+t*(i===0?.018:.009));ctx.scale(1,.52);
    const halo=ctx.createRadialGradient(0,0,0,0,0,radius*2);halo.addColorStop(0,i===0?"#ff9b4938":"#714cff2c");halo.addColorStop(.45,"#1c72d523");halo.addColorStop(1,"#02091800");ctx.fillStyle=halo;ctx.fillRect(-radius*2,-radius*2,radius*4,radius*4);
    const count=w<700?260:i===0?760:510;
    for(let n=0;n<count;n++){const f=seed(n+i*900+40),r=Math.sqrt(f)*radius,arm=n%4,angle=arm*Math.PI/2+r/radius*7.3+t*(.12+i*.009)+(seed(n+55)-.5)*(.24+f*.9),x=Math.cos(angle)*r,y=Math.sin(angle)*r;ctx.fillStyle=n%8===0?g.color:n%4===0?"#b26dff":"#58b8ff";ctx.globalAlpha=(1-f)*.72+.12;ctx.beginPath();ctx.arc(x,y,n%17===0?1.55:.58,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=.52;for(let ring=1;ring<=3;ring++){ctx.strokeStyle=ring===1?g.color:"rgba(80,173,255,.24)";ctx.lineWidth=.45;ctx.beginPath();ctx.ellipse(0,0,radius*(.72+ring*.22),radius*(.72+ring*.22),0,0,Math.PI*2);ctx.stroke()}
    ctx.globalAlpha=1;const core=ctx.createRadialGradient(0,0,0,0,0,radius*.34);core.addColorStop(0,"#fffdf1");core.addColorStop(.12,"#ffd89e");core.addColorStop(.38,i===0?"#ff8b4a88":"#a774ff68");core.addColorStop(1,"#4b72ff00");ctx.fillStyle=core;ctx.beginPath();ctx.arc(0,0,radius*.34,0,Math.PI*2);ctx.fill();ctx.restore();
    for(let n=0;n<(i===0?18:9);n++){const a=t*(.18+(n%3)*.03)+n*6.283/(i===0?18:9)+i,r=radius*(1.12+(n%4)*.13),x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r*.55;ctx.fillStyle=n%3===0?"#ffbe6e":n%3===1?"#62e3ff":"#b77cff";ctx.globalAlpha=.78;ctx.beginPath();ctx.arc(x,y,n%5===0?2.1:1.25,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
   });ctx.globalCompositeOperation="source-over";
   const p=positions[selected];ctx.strokeStyle="#8ee6ffb0";ctx.lineWidth=1;ctx.setLineDash([3,7]);ctx.beginPath();ctx.arc(p.x,p.y,unit*.06,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  }
  const tick=(now:number)=>{if(!paused&&!reduced&&visible){if(last)clock.current+=Math.min((now-last)/1000,.05);draw(clock.current)}last=now;frame=requestAnimationFrame(tick)};
  const ob=new ResizeObserver(resize);ob.observe(canvas);resize();const vis=()=>{visible=!document.hidden;last=0};document.addEventListener("visibilitychange",vis);if(!paused&&!reduced)frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);ob.disconnect();document.removeEventListener("visibilitychange",vis)}
 },[paused,reduced,selected]);
 return <div className="galaxy-canvas"><canvas ref={ref} aria-label="Animated illustrative galaxy network; not live agent telemetry"/><div ref={labels} className="galaxy-labels">{galaxies.map((g,i)=><button key={g.name} className={selected===i?"selected":""} style={{left:g.x*100+"%",top:g.y*100+"%"}} onClick={()=>onSelect(i)}><b>{g.name}</b><strong>{g.agents.toLocaleString()} Agents</strong><small>{g.role}</small><em>{g.missions} Missions</em></button>)}</div><div className="mesh-legend"><span>● Agent Node</span><span>— Mission Flow</span><span>● Knowledge Link</span><span>● Galaxy Core</span></div><div className="mesh-watermark">ILLUSTRATIVE NEXUS · CONTINUOUS 18s COLLAPSE / EXPAND LOOP</div></div>
}