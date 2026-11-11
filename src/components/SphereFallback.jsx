import React,{useEffect,useRef,useState} from 'react';
import './SphereFallback.css';

// CSS 3D sphere for browsers where the WebGL canvas cannot initialize.
const dots=Array.from({length:100},(_,i)=>{
  const y=1-2*(i+.5)/100;
  const lat=Math.asin(y)*180/Math.PI;
  const lon=(i*137.50776405)%360;
  return {lat,lon};
});

export default function SphereFallback({items=[]}){
  const [rotation,setRotation]=useState({x:-13,y:0});
  const [active,setActive]=useState(0);
  const pointer=useRef(null);
  useEffect(()=>{
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const id=window.setInterval(()=>setRotation(v=>pointer.current?v:{...v,y:v.y+.65}),45);
    return()=>clearInterval(id);
  },[]);
  const down=e=>{pointer.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{if(!pointer.current)return;const dx=e.clientX-pointer.current.x,dy=e.clientY-pointer.current.y;pointer.current={x:e.clientX,y:e.clientY};setRotation(v=>({x:Math.max(-80,Math.min(80,v.x-dy*.35)),y:v.y+dx*.4}));};
  return <div className="sphere-fallback" aria-label="Galería esférica de recuerdos" onPointerDown={down} onPointerMove={move} onPointerUp={()=>pointer.current=null} onPointerCancel={()=>pointer.current=null}>
    <div className="sphere-fallback-scene"><div className="sphere-fallback-orb" style={{transform:`rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`}}>
      {dots.map((dot,i)=><div className="sphere-fallback-tile" key={i} style={{transform:`rotateY(${dot.lon}deg) rotateX(${dot.lat}deg) translateZ(var(--sphere-depth))`}}><img src={items[i%items.length]?.image} alt="" draggable={false}/></div>)}
    </div></div>
    <div className="sphere-fallback-caption"><button type="button" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setActive((active+items.length-1)%items.length)}} aria-label="Anterior">‹</button><div><strong>{items[active]?.title}</strong><span>{items[active]?.description}</span></div><button type="button" onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();setActive((active+1)%items.length)}} aria-label="Siguiente">›</button></div>
  </div>;
}
