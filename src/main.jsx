import React,{useEffect,useState} from 'react';
import{createRoot}from'react-dom/client';
import DitherVeil from './components/DitherVeil';
import MaskedHeading from './components/MaskedHeading';
import SpotifyPlayer from './components/SpotifyPlayer';
import leninPortrait from './assets/lenin-portrait.png';
import leninHolographic from './assets/lenin-holographic.png';
import waterfallPoster from './assets/pink-waterfall.png';
import './style.css';
import './fallback.css';
import './color-tuning.css';
import './reference.css';
import './iphone.css';

const ART=leninPortrait;
const REEL=`${import.meta.env.BASE_URL}reel.mp4`;
// Midnight of November 12 in Neuquén, Argentina (UTC-3).
const TARGET=new Date('2026-11-12T00:00:00-03:00').getTime();
function timeLeft(){let s=Math.max(0,Math.floor((TARGET-Date.now())/1000));return [Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60]}
class SafeBoundary extends React.Component{
  constructor(props){super(props);this.state={failed:false}}
  static getDerivedStateFromError(){return {failed:true}}
  componentDidCatch(error){console.error('Birthday effect fallback:',error)}
  render(){return this.state.failed?this.props.fallback:this.props.children}
}
function App(){
  const [time,setTime]=useState(timeLeft);
  useEffect(()=>{const i=setInterval(()=>setTime(timeLeft()),1000);return()=>clearInterval(i)},[]);
  useEffect(()=>{if(time.every(n=>n===0))window.location.replace(`${import.meta.env.BASE_URL}celebracion.html`)},[time]);
  return <div className="site">
    <header className="topbar"><span className="monogram">lenin lorca</span><span className="date-small">12 noviembre · Neuquén</span></header>
    <main>
      <section className="hero" aria-label="Portada artística para Lenin">
        <img className="hero-photo-fallback" src={ART} alt="Retrato de Lenin"/>
        <div className="dither-wrap"><SafeBoundary fallback={<img className="dither-fallback" src={leninHolographic} alt="Lenin iridiscente"/>}><DitherVeil
          src={leninHolographic}
          pattern="floyd"
          pixelSize={2}
          inkColor="#ec4899"
          paperColor="#f4f1ea"
          revealRadius={200}
          softness={0.6}
          linger={1}
          fit="contain"
          rimColor="#a78bfa"
          palette="duotone"
          levels={2}
          contrast={1.15}
          brightness={0}
          rim={0}
          reverse={false}
          wander={false}
          clickBurst
        /></SafeBoundary></div>
        <div className="hero-overlay"/>
        <div className="hero-content"><span className="hero-caption">A star was born<br/>12 · 11 · 26</span><span className="hero-number">12</span></div>
      </section>
      <section className="greeting"><p className="eyebrow">EVERY SINGLE NIGHT I PRAY THAT IT'S ...</p><div className="heading-wrap">
        <SafeBoundary fallback={<h1 className="plain-heading">Lenin's Birthday</h1>}><MaskedHeading
          text="Lenin's Birthday"
          tag="h1"
          mediaType="video"
          src={REEL}
          poster={waterfallPoster}
          fillScale={1.25}
          parallax={26}
          reveal="scale"
          trigger="view"
          spotlight={false}
          spotlightRadius={180}
          outline={false}
          duration={1.1}
          stagger={0.09}
          drift={18}
          hoverZoom={0}
          align="center"
          brightness={1}
          saturation={1}
          grayscale={false}
          outlineWidth={1}
          weight={700}
          tracking={-0.045}
          lineHeight={0.93}
          textScale={0.15}
          tint="#fc1787"
          className="birthday-heading"
        /></SafeBoundary>
      </div>
      <div className="timer birthday-timer" role="timer" aria-label="Cuenta regresiva para el cumpleaños de Lenin en Neuquén">{['Días','Horas','Minutos','Segundos'].map((unit,i)=><div className="timebox" key={unit}><span className="value">{String(time[i]).padStart(2,'0')}</span><span className="unit">{unit}</span></div>)}</div>
      </section>
    </main>
    <SpotifyPlayer/>
  </div>;
}
createRoot(document.getElementById('root')).render(<SafeBoundary fallback={<div className="emergency"><img src={ART} alt="Lenin"/><h1>Lenin's Birthday</h1><p>12 de noviembre · 2026</p></div>}><App/></SafeBoundary>);
