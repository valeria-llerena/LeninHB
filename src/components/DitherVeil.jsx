import React,{useEffect,useRef} from 'react';
import './DitherVeil.css';

// White-dot portrait; a soft cursor window restores the original full-colour photo.
export default function DitherVeil({src,pattern='floyd',pixelSize=2,inkColor='#ec4899',paperColor='#f4f1ea',revealRadius=200,softness=.6,linger=1,fit='contain',rimColor='#a78bfa',palette='duotone',levels=2,contrast=1.15,brightness=0,rim=0,reverse=false,wander=false,clickBurst=true,backgroundColor='#110e16'}){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext('2d');
    if(!ctx)return;
    const img=new Image();img.crossOrigin='anonymous';
    let w=0,h=0,ready=false,raf=0,startFade=0;
    const point={x:-9999,y:-9999,strength:0,active:false};
    const dots=document.createElement('canvas');const photo=document.createElement('canvas');const reveal=document.createElement('canvas');
    const dotsCtx=dots.getContext('2d');const photoCtx=photo.getContext('2d');const revealCtx=reveal.getContext('2d');
    const paint=()=>{
      if(!w||!h)return;
      ctx.clearRect(0,0,w,h);ctx.drawImage(dots,0,0);
      if(!ready||point.strength<=0)return;
      revealCtx.clearRect(0,0,w,h);
      revealCtx.globalCompositeOperation='source-over';revealCtx.drawImage(photo,0,0);
      const r=Math.max(1,revealRadius),inner=r*(1-Math.min(.95,softness));
      const gradient=revealCtx.createRadialGradient(point.x,point.y,inner,point.x,point.y,r);
      gradient.addColorStop(0,`rgba(0,0,0,${point.strength})`);
      gradient.addColorStop(1,'rgba(0,0,0,0)');
      revealCtx.globalCompositeOperation='destination-in';revealCtx.fillStyle=gradient;revealCtx.fillRect(0,0,w,h);
      revealCtx.globalCompositeOperation='source-over';ctx.drawImage(reveal,0,0);
    };
    const prepare=()=>{
      for(const c of[dots,photo,reveal]){c.width=w;c.height=h}
      // The asset itself is transparent. Only the figure becomes ivory dots;
      // the dark background belongs to the page, not the source image.
      dotsCtx.fillStyle=backgroundColor;dotsCtx.fillRect(0,0,w,h);
      if(!ready){paint();return}
      const scale=fit==='contain'?Math.min(w/img.width,h/img.height):Math.max(w/img.width,h/img.height);
      const iw=img.width*scale,ih=img.height*scale;
      photoCtx.drawImage(img,(w-iw)/2,(h-ih)/2,iw,ih);
      // The full-colour layer already has the liquid-chrome palette.
      const step=Math.max(3,Math.round(pixelSize*2));
      const small=document.createElement('canvas');small.width=Math.ceil(w/step);small.height=Math.ceil(h/step);
      const smallCtx=small.getContext('2d',{willReadFrequently:true});smallCtx.drawImage(photo,0,0,small.width,small.height);
      const data=smallCtx.getImageData(0,0,small.width,small.height).data;
      const sw=small.width,sh=small.height;
      const errors=new Float32Array(sw*sh);
      dotsCtx.fillStyle=paperColor;
      for(let y=0;y<small.height;y++)for(let x=0;x<small.width;x++){
        const i=(y*small.width+x)*4;
        if(data[i+3]<64)continue;
        const luminance=(data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722)/255;
        const light=Math.max(0,Math.min(1,(luminance-.5)*contrast+.5+brightness+.12));
        const idx=y*sw+x,v=Math.max(0,Math.min(1,light+errors[idx]));
        const quantized=v>=.49?1:0;
        if(pattern==='floyd'){
          const error=v-quantized;
          if(x+1<sw)errors[idx+1]+=error*7/16;
          if(y+1<sh){if(x>0)errors[idx+sw-1]+=error*3/16;errors[idx+sw]+=error*5/16;if(x+1<sw)errors[idx+sw+1]+=error/16}
        }
        if(!quantized)continue;
        const radius=step*(palette==='duotone'?.41:.36);
        dotsCtx.beginPath();dotsCtx.arc(x*step+step/2,y*step+step/2,radius,0,Math.PI*2);dotsCtx.fill();
      }
      paint();
    };
    const resize=()=>{const box=canvas.getBoundingClientRect();w=Math.max(1,Math.round(box.width));h=Math.max(1,Math.round(box.height));canvas.width=w;canvas.height=h;prepare()};
    const move=e=>{const rect=canvas.getBoundingClientRect();point.x=e.clientX-rect.left;point.y=e.clientY-rect.top;point.strength=1;point.active=true;paint()};
    const down=e=>move(e);
    const fade=now=>{raf=0;if(point.active)return;point.strength=Math.max(0,1-(now-startFade)/(Math.max(.1,linger)*1000));paint();if(point.strength>0)raf=requestAnimationFrame(fade)};
    const leave=()=>{point.active=false;startFade=performance.now();if(!raf)raf=requestAnimationFrame(fade)};
    img.onload=()=>{ready=true;resize()};img.onerror=()=>resize();img.src=src;
    const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('pointerup',leave);
    return()=>{ro.disconnect();cancelAnimationFrame(raf);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('pointerup',leave)};
  },[src,pattern,pixelSize,inkColor,paperColor,revealRadius,softness,linger,fit,rimColor,palette,levels,contrast,brightness,rim,reverse,wander,clickBurst,backgroundColor]);
  return <canvas ref={canvasRef} className="dither-veil" role="img" aria-label="Retrato de Lenin dibujado con puntos blancos que revelan su foto a color"/>;
}
