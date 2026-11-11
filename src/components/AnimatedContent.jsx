import React,{useEffect,useRef} from 'react';
import {gsap} from 'gsap';

export default function AnimatedContent({children,distance=100,direction='vertical',duration=.8,ease='power3.out',blur=0,stagger=.08,threshold=.1,className=''}){
  const root=useRef(null);
  useEffect(()=>{
    const el=root.current;if(!el)return;
    const parts=[...el.children];
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window))return;
    gsap.set(parts,{opacity:0,x:direction==='horizontal'?distance:0,y:direction==='vertical'?distance:0,filter:blur?`blur(${blur}px)`:'none'});
    const io=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      gsap.to(parts,{opacity:1,x:0,y:0,filter:'blur(0px)',duration,ease,stagger,clearProps:'transform,filter',overwrite:true});
      io.disconnect();
    },{threshold});
    io.observe(el);
    return()=>{io.disconnect();gsap.set(parts,{clearProps:'all'})};
  },[distance,direction,duration,ease,blur,stagger,threshold]);
  return <div ref={root} className={className}>{children}</div>;
}
