/* ───────────────── EDIT YOUR INVITATION HERE ───────────────── */
const WEDDING = {
  bride: 'Ancy Roy', groom: 'Mathew Oommen',
  // ISO local time avoids timezone changes on guests’ phones.
  dateTime: '2026-10-08T10:30:00+05:30',
  displayDate: '08 · 10 · 2026', day: '08', monthYear: 'October · 2026', time: '10:30 AM',
  venue: 'Girideepam<br>Convention Centre', place: 'Nalanchira',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Girideepam+Convention+Centre+Nalanchira',
  coverPhoto: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85',
  venuePhoto: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85',
  heroPhoto: 'ancymathew.jpg',
  // Keep this music file beside index.html if you later replace it.
  musicUrl: 'innimangalyam.mpeg',
  // Paste your Google Apps Script Web App URL here after completing RSVP_SETUP.md.
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbxA8DJYwYTaQxY1EFOzfyaFJZ9iW0w3nJPBwxKe3vYVAsjdn6akCeHPo0ny_tjaB-yL/exec'
};

const $ = id => document.getElementById(id);
function applyDetails(){
  [['coverBride',WEDDING.bride],['coverGroom',WEDDING.groom],['brideName',WEDDING.bride],['groomName',WEDDING.groom],['coverDate',WEDDING.displayDate],['day',WEDDING.day],['monthYear',WEDDING.monthYear],['time',WEDDING.time],['venueName',WEDDING.venue],['venuePlace',WEDDING.place]].forEach(([id,value])=>$(id).innerHTML=value);
  $('mapLink').href=WEDDING.mapUrl; $('music').src=WEDDING.musicUrl;
  document.querySelector('.cover-photo').style.backgroundImage=`linear-gradient(180deg,rgba(14,10,8,.22),rgba(14,10,8,.75)),url("${WEDDING.coverPhoto}")`;
  document.querySelector('.venue').style.backgroundImage=`linear-gradient(rgba(21,17,14,.88),rgba(21,17,14,.92)),url("${WEDDING.venuePhoto}")`;
  document.querySelector('.hero').style.backgroundImage =
  `linear-gradient(rgba(240,234,224,.75), rgba(240,234,224,.75)), url("${WEDDING.heroPhoto}")`;

  document.querySelector('.hero').style.backgroundSize = 'cover';
  document.querySelector('.hero').style.backgroundPosition = 'top';
}
applyDetails();

$('openInvite').addEventListener('click',()=>{
  const cover=$('cover'), experience=$('experience');
  cover.classList.add('opening'); experience.hidden=false; document.body.style.overflow='auto';
  // The canvas is hidden on initial load, so it must be sized only after the invitation opens.
  requestAnimationFrame(resizeCanvas);
  // Starting here keeps playback compatible with iOS and Android gesture rules.
  if(WEDDING.musicUrl&&music.paused) music.play().then(()=>{sound.classList.add('playing');sound.setAttribute('aria-label','Pause background music')}).catch(()=>{});
  setTimeout(()=>{ cover.hidden=true; window.scrollTo({top:0,behavior:'instant'}); },1100);
});

const music=$('music'), sound=$('soundToggle');music.volume=.42;
sound.addEventListener('click',async()=>{
  if(!WEDDING.musicUrl){ alert('Add your music file and its name in app.js to enable background music.'); return; }
  if(music.paused){try{await music.play();sound.classList.add('playing');sound.setAttribute('aria-label','Pause background music')}catch(e){}}else{music.pause();sound.classList.remove('playing');sound.setAttribute('aria-label','Play background music')}
});

function updateCountdown(){
  let d=Math.max(0,new Date(WEDDING.dateTime)-new Date());
  const values=[Math.floor(d/86400000),Math.floor(d/3600000)%24,Math.floor(d/60000)%60,Math.floor(d/1000)%60];
  ['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=String(values[i]).padStart(id==='days'?3:2,'0'));
}updateCountdown();setInterval(updateCountdown,1000);

// Touch- and mouse-friendly scratch reveal.
const canvas=$('scratchCanvas'), card=$('scratchCard'), ctx=canvas.getContext('2d'); let drawing=false,revealed=false,scratchReady=false;
function resizeCanvas(){
  const r=canvas.getBoundingClientRect(),ratio=devicePixelRatio||1;
  if(!r.width||!r.height||revealed)return;
  canvas.width=Math.round(r.width*ratio);canvas.height=Math.round(r.height*ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.globalCompositeOperation='source-over';
  ctx.fillStyle='#b69758';ctx.fillRect(0,0,r.width,r.height);
  ctx.fillStyle='rgba(255,239,193,.15)';for(let i=0;i<210;i++)ctx.fillRect(Math.random()*r.width,Math.random()*r.height,1,1);
  scratchReady=true;
}
function scratch(e){if(!drawing||revealed||!scratchReady)return;const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(p.clientX-r.left,p.clientY-r.top,27,0,Math.PI*2);ctx.fill();checkReveal()}
function checkReveal(){const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let transparent=0;for(let i=3;i<pixels.length;i+=64)if(pixels[i]<30)transparent++;if(transparent/(pixels.length/64)>.37)reveal()}
function reveal(){if(revealed)return;revealed=true;card.classList.add('revealed');canvas.style.transition='opacity .65s';canvas.style.opacity='0';setTimeout(()=>canvas.style.pointerEvents='none',650);petals()}
// Prevent mobile browsers from turning a scratch gesture into page scrolling.
canvas.style.touchAction='none';
canvas.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
['pointerdown','pointermove','pointerup','pointercancel'].forEach(type=>canvas.addEventListener(type,e=>{
  if(type==='pointerdown'){drawing=true;canvas.setPointerCapture?.(e.pointerId)}
  if(type==='pointerup'||type==='pointercancel')drawing=false;
  if(type==='pointerdown'||type==='pointermove'){e.preventDefault();scratch(e)}
},{passive:false}));
function petals(){for(let i=0;i<28;i++){const p=document.createElement('i');p.className='petal';p.style.left=(25+Math.random()*50)+'vw';p.style.top=(20+Math.random()*25)+'vh';p.style.setProperty('--x',(-180+Math.random()*360)+'px');p.style.animationDelay=(Math.random()*.55)+'s';document.body.append(p);setTimeout(()=>p.remove(),3500)}}

// RSVP: submit private responses to the Google Apps Script endpoint configured above.
const rsvpForm=$('rsvpForm'),rsvpChoices=$('rsvpChoices'),attendingFields=$('attendingFields'),rsvpFeedback=$('rsvpFeedback'),rsvpBack=$('rsvpBack');
document.querySelectorAll('[data-attendance]').forEach(button=>button.addEventListener('click',()=>{
  const attending=button.dataset.attendance==='Joyfully attending';
  $('attendance').value=button.dataset.attendance;rsvpChoices.hidden=true;rsvpForm.hidden=false;attendingFields.hidden=!attending;
  rsvpForm.elements.guestCount.required=attending;rsvpForm.elements.meal.required=attending;
  if(!attending){rsvpForm.elements.guestCount.value='';rsvpForm.elements.meal.value=''}
  rsvpForm.elements.guestName.focus();
}));
rsvpForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!WEDDING.rsvpEndpoint){alert('The RSVP is being prepared. Please try again shortly.');return}
  const submitButton=rsvpForm.querySelector('[type="submit"]');submitButton.disabled=true;submitButton.textContent='Sending…';
  const response=Object.fromEntries(new FormData(rsvpForm));response.submittedAt=new Date().toISOString();
  try{
    // no-cors avoids a browser preflight request to Google Apps Script; the script still receives the JSON body.
    await fetch(WEDDING.rsvpEndpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(response)});
    rsvpForm.hidden=true;rsvpFeedback.hidden=false;rsvpBack.hidden=false;
    const joined=response.attendance==='Joyfully attending';
    rsvpFeedback.innerHTML=joined?'Thank you — we cannot wait to celebrate with you. <a href="'+WEDDING.mapUrl+'" target="_blank" rel="noopener">Get directions ↗</a>':'Thank you for your love and blessings. You will be in our hearts on this special day.';
  }catch(error){submitButton.disabled=false;submitButton.textContent='Send RSVP ✦';alert('Your RSVP could not be sent. Please check your connection and try again.');}
});
rsvpBack.addEventListener('click',()=>{rsvpFeedback.hidden=true;rsvpBack.hidden=true;rsvpForm.reset();rsvpForm.hidden=true;rsvpChoices.hidden=false;attendingFields.hidden=false;});
