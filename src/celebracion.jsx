import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import AnimatedContent from './components/AnimatedContent';
import InfiniteMenu from './components/InfiniteMenu';
import Folder from './components/Folder';
import SphereFallback from './components/SphereFallback';
import './celebracion.css';
import './gallery-fallback.css';
import './birthday-enhancements.css';
import './gift-vault.css';

// EDITAR AQUÍ: cambia el título y la descripción de cada fotografía cuando quieras.
// Las 9 fotografías están en public/recuerdos y se muestran en este mismo orden.
const memories = [
  {image: `${import.meta.env.BASE_URL}recuerdos/01-actualizada.webp`, title: 'Recuerdo 01', description: 'Una selfie para el recuerdo ♡'},
  {image: `${import.meta.env.BASE_URL}recuerdos/02.webp`, title: 'Recuerdo 02', description: 'Momentos con gente bonita.'},
  {image: `${import.meta.env.BASE_URL}recuerdos/03.webp`, title: 'Recuerdo 03', description: 'Otra aventura juntos.'},
  {image: `${import.meta.env.BASE_URL}recuerdos/04.webp`, title: 'Recuerdo 04', description: 'Una salida muy especial.'},
  {image: `${import.meta.env.BASE_URL}recuerdos/05.webp`, title: 'Recuerdo 05', description: 'De mis fotos favoritas.'},
  {image: `${import.meta.env.BASE_URL}recuerdos/06.webp`, title: 'Recuerdo 06', description: 'Los momentos simples también cuentan.'},
  {image: `${import.meta.env.BASE_URL}recuerdos/08.webp`, title: 'Recuerdo 07', description: 'Una noche para recordar.'},
  {image: `${import.meta.env.BASE_URL}recuerdos/09.webp`, title: 'Recuerdo 08', description: 'Un atardecer bonito contigo.'},
  {image: `${import.meta.env.BASE_URL}recuerdos/10.webp`, title: 'Recuerdo 09', description: 'Pequeños momentos, grandes recuerdos.'}
];

const gifts = [
  {id:'coffee', icon:'☕', title:'Starbucks', subtitle:'Un cafecito para ti', backTitle:'Tu gift card', backDetail:'CÓDIGO: PENDIENTE', hint:'Aquí agregaré el código o enlace real.'},
  {id:'perfume', icon:'✧', title:'Un perfume', subtitle:'Algo que huele a ti', backTitle:'En camino para ti', backDetail:'SEGUIMIENTO: PENDIENTE', hint:'Aquí agregaré el número o enlace de seguimiento.'},
  {id:'surprise', icon:'✈', title:'Sorpresa', subtitle:'La mejor parte…', backTitle:'¡Voy a Neuquén!', backDetail:'NOS VEMOS PRONTO ♡', hint:'Esta sorpresa es de verdad.'}
];

// Enlace compartido por Valeria. Si Canva cambia la URL, actualizarla aquí.
const COLLAGE_DOWNLOAD_URL = 'https://canva.link/9xcy23buqem2nts';

class GalleryErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={failed:false}}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(error){console.error('La galería 3D no pudo iniciarse:',error)}
  render(){return this.state.failed?<SphereFallback items={memories}/>:this.props.children}
}

function RisingConfetti(){
  const canvasRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext('2d');
    if(!ctx)return;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame=0,raf;
    let width=0,height=0;
    const colors=['#fff8d7','#fff','#ffdd31','#a7efff','#d11572','#fe8dc9','#a78bfa'];
    const particles=Array.from({length:reduce?25:115},(_,i)=>({x:Math.random(),y:Math.random(),s:2+Math.random()*5,v:.35+Math.random()*1.2,w:Math.random()*6.28,rot:Math.random()*6.28,color:colors[i%colors.length]}));
    const resize=()=>{const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;canvas.width=Math.max(1,Math.floor(width*devicePixelRatio));canvas.height=Math.max(1,Math.floor(height*devicePixelRatio));ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
    const draw=()=>{
      ctx.clearRect(0,0,width,height);
      particles.forEach(p=>{
        if(!reduce){p.y-=p.v/height;p.w+=.025;p.rot+=.025;if(p.y<-.04){p.y=1.04;p.x=Math.random()}}
        const x=p.x*width+Math.sin(p.w)*18,y=p.y*height;
        ctx.save();ctx.translate(x,y);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.globalAlpha=Math.min(1,Math.max(.15,(1-p.y)*1.6));ctx.fillRect(-p.s/2,-p.s/3,p.s,p.s*.7);ctx.restore();
      });
      if(!reduce)raf=requestAnimationFrame(draw);
    };
    resize();draw();window.addEventListener('resize',resize);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)};
  },[]);
  return <canvas className="rising-confetti" ref={canvasRef} aria-hidden="true"/>;
}

function GiftFolder(){
  const [selected,setSelected]=useState(null);
  const [screenWidth, setScreenWidth] = useState(
    () => window.innerWidth
  );

  useEffect(() => {
    const update = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', update, {
      passive: true
    });

    return () => window.removeEventListener('resize', update);
  }, []);

  const isMobile = screenWidth <= 650;
  const folderSize =
    screenWidth <= 360 ? 0.72 :
    screenWidth <= 430 ? 0.86 :
    isMobile ? 1.02 : 1.45;
  const papers=gifts.map(gift=>({title:gift.title,description:gift.subtitle}));
  return <div className="gift-vault"><div className="gift-vault-top"><span>3 SORPRESAS</span><span>1 CARPETITA ROSA ♡</span></div><div className="gift-vault-folder"><Folder items={papers} label="FOR LENIN ♡" mode="flap" variant="solid" color="#ec4899" paperColor="#fffaf4" tabPosition="right" layout={isMobile ? "stack" : "spread"} size={folderSize} openOn="click" onItemClick={(_,index)=>setSelected(gifts[index])} draggable={false} zoomOnClick={false} peek intro tilt={0.5} bounce={0.45} speed={1} theme="light"/></div><p className="gift-vault-help">Abre la carpeta rosa y toca uno de los tres regalitos.</p>
    {selected&&<div className="gift-reveal-backdrop" onClick={()=>setSelected(null)} role="presentation"><section className="gift-reveal" role="dialog" aria-modal="true" aria-label={`Regalo: ${selected.title}`} onClick={e=>e.stopPropagation()}><button type="button" className="gift-reveal-close" onClick={()=>setSelected(null)} aria-label="Cerrar regalo">×</button><span className="gift-reveal-icon" aria-hidden="true">{selected.icon}</span><span className="gift-reveal-label">PARA TI, LENIN ♡</span><h3>{selected.backTitle}</h3><strong>{selected.backDetail}</strong><p>{selected.hint}</p><button type="button" className="gift-reveal-done" onClick={()=>setSelected(null)}>Seguir descubriendo →</button></section></div>}
  </div>;
}

function CollageDownload(){
  const [showNotice,setShowNotice]=useState(false);
  return <section className="collage-section"><AnimatedContent distance={100} direction="vertical" duration={.8} ease="power3.out" blur={0} stagger={.08} threshold={.1}><div className="section-eyebrow">03 / ONE MORE THING</div><h2>Para guardar <em>siempre.</em></h2><p>Un collage hecho especialmente para ti. ♡</p>{COLLAGE_DOWNLOAD_URL?<><a className="collage-download-button" href={COLLAGE_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">Ver y descargar tu collage ↓</a><span className="collage-pending">Se abrirá en Canva.</span></>:<button className="collage-download-button" type="button" onClick={()=>setShowNotice(true)}>Descargar tu collage ↓</button>}{showNotice&&<span className="collage-pending" role="status">Próximamente ♡ Estoy preparando tu collage.</span>}</AnimatedContent></section>;
}

function PotaxiePlayer(){
  const [open,setOpen]=useState(false);
  return <aside className={`potaxie-player ${open?'is-open':''}`} aria-label="Música de cumpleaños">
    {open&&<div className="potaxie-panel"><div className="potaxie-panel-title"><span>♪ LA VERSIÓN POTAXIE</span><button onClick={()=>setOpen(false)} aria-label="Cerrar música">×</button></div><iframe title="Feliz cumpleaños versión potaxie" src="https://www.youtube-nocookie.com/embed/U3qWgTmVpjY?rel=0" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div>}
    <button className="potaxie-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span className="potaxie-disc" aria-hidden="true">♫</span><span>{open?'Ocultar música':'Play the birthday song'}</span><span aria-hidden="true">{open?'−':'↗'}</span></button>
  </aside>;
}

function Celebration(){
  return <main className="celebration-page">
    <section className="celebration-hero" id="felicitaciones"><RisingConfetti/><div className="celebration-grain" aria-hidden="true"/><div className="celebration-topline"><span>12 · NOV · 2026</span><span>NEUQUÉN, ARGENTINA</span></div>
      <AnimatedContent distance={100} direction="vertical" duration={.8} ease="power3.out" blur={0} stagger={.08} threshold={.1}>
        <div className="birthday-kicker">IT'S YOUR DAY, BABY</div>
        <h1>HAPPY<br/><em>BIRTHDAY</em><br/>LENIN<span className="hero-period">.</span></h1>
        <p className="hero-message">Feliz cumpleaños, Lenin. Que este día sea tan increíble, brillante e inolvidable como tú. ♡</p>
        <a href="#recuerdos" className="hero-scroll">DESLIZA PARA TU SORPRESA <span>↓</span></a>
      </AnimatedContent>
      <div className="celebration-hero-footer">MADE WITH LOVE <span>✦</span> ESPECIALMENTE PARA TI</div>
    </section>

    <section className="memories-section" id="recuerdos"><AnimatedContent distance={100} direction="vertical" duration={.8} ease="power3.out" blur={0} stagger={.08} threshold={.1}><div className="section-eyebrow">01 / THE MEMORIES</div><h2>Un poquito de <em>nosotros.</em></h2><p className="section-intro">Cada foto tiene su propia historia. Arrastra o desliza para descubrirlas.</p></AnimatedContent>
      <AnimatedContent distance={100} direction="vertical" duration={.8} ease="power3.out" blur={0} stagger={.08} threshold={.1}><div className="memory-gallery"><GalleryErrorBoundary><InfiniteMenu items={memories} count={160} tileSize={.71} roundness={.2} zoom={1.65} pullBack={1} stretch={.6} inertia={.6} autoplay={3} grayscale={true} dim={.5} intro={true} showInfo={true} theme="dark" accentColor="#ffffff"/></GalleryErrorBoundary></div></AnimatedContent>
    </section>

    <section className="gifts-section" id="regalos"><AnimatedContent distance={100} direction="vertical" duration={.8} ease="power3.out" blur={0} stagger={.08} threshold={.1}><div className="section-eyebrow">02 / JUST FOR YOU</div><h2>Hay algo <em>para ti.</em></h2><p className="section-intro">Abre la carpetita rosa para encontrar tus tres sorpresas.</p></AnimatedContent><AnimatedContent distance={100} direction="vertical" duration={.8} ease="power3.out" blur={0} stagger={.08} threshold={.1}><GiftFolder/></AnimatedContent><div className="gifts-footer">TE QUIERO MUCHO, LENIN ♡</div></section>
    <CollageDownload/>
    <PotaxiePlayer/>
  </main>;
}

createRoot(document.getElementById('root')).render(<Celebration/>);
