import React,{useEffect,useRef,useState} from 'react';
import './SpotifyPlayer.css';

const TRACK='spotify:track:70cHKK8bHAfJrOGVnfRG9J';
const TRACK_URL='https://open.spotify.com/track/70cHKK8bHAfJrOGVnfRG9J';

export default function SpotifyPlayer(){
  const mountRef=useRef(null);
  const controllerRef=useRef(null);
  const [open,setOpen]=useState(false);
  const [mounted,setMounted]=useState(false);
  const [status,setStatus]=useState('loading');

  useEffect(()=>{
    if(!mounted||controllerRef.current)return;
    let active=true;
    const attach=api=>{
      if(!active||!mountRef.current||controllerRef.current)return;
      api.createController(mountRef.current,{uri:TRACK,width:'100%',height:152},controller=>{
        if(!active)return;
        controllerRef.current=controller;
        setStatus('ready');
      });
    };
    window.onSpotifyIframeApiReady=attach;
    let script=document.querySelector('script[data-spotify-iframe-api]');
    if(!script){
      script=document.createElement('script');
      script.src='https://open.spotify.com/embed/iframe-api/v1';
      script.async=true;
      script.dataset.spotifyIframeApi='true';
      script.onerror=()=>{if(active)setStatus('error')};
      document.body.appendChild(script);
    }
    return()=>{active=false;if(window.onSpotifyIframeApiReady===attach)window.onSpotifyIframeApiReady=undefined};
  },[mounted]);

  const toggle=()=>{if(!mounted)setMounted(true);setOpen(previous=>!previous)};
  return <aside className="floating-spotify" aria-label="Música de cumpleaños">
    {mounted&&<div className={`spotify-panel ${open?'is-open':''}`} id="spotify-panel" aria-hidden={!open}>
      <div className="spotify-panel-head">
        <div><span className="spotify-kicker">BIRTHDAY SOUNDTRACK</span><strong>Nicole Kidman <span>· ADÉLA</span></strong></div>
        <button className="spotify-close" type="button" onClick={()=>setOpen(false)} aria-label="Minimizar música">×</button>
      </div>
      <div ref={mountRef} className="spotify-embed" aria-label="Spotify: Nicole Kidman de ADÉLA"/>
      <div className="spotify-panel-actions">
        <button type="button" disabled={status!=='ready'} onClick={()=>controllerRef.current?.togglePlay()}>{status==='ready'?'▶ Play / Pause':status==='error'?'Spotify no disponible':'Cargando…'}</button>
        <a href={TRACK_URL} target="_blank" rel="noopener noreferrer">Abrir Spotify ↗</a>
      </div>
    </div>}
    <button className="spotify-pill" type="button" onClick={toggle} aria-controls="spotify-panel" aria-expanded={open} aria-label={open?'Minimizar reproductor':'Abrir reproductor de Nicole Kidman'}>
      <span className="spotify-pill-icon" aria-hidden="true">♫</span>
      <span className="spotify-pill-label"><strong>Nicole Kidman</strong><small>ADÉLA · Spotify</small></span>
      <span className="spotify-pill-chevron" aria-hidden="true">{open?'⌄':'⌃'}</span>
    </button>
  </aside>;
}
