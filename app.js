const WEDDING = {
  bride: 'Ancy Roy', groom: 'Mathew Oommen',
  // ISO local time avoids timezone changes on guests’ phones.
  dateTime: '2026-10-08T10:30:00+05:30',
  displayDate: '08 · 10 · 2026', day: '08', monthYear: 'October · 2026', time: '10:30 AM',
  venue: 'Girideepam<br>Convention Centre', place: 'Nalanchira',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Girideepam+Convention+Centre+Nalanchira',
  coverPhoto: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85',
  venuePhoto: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1000&q=85',
  heroPhoto: 'mathewancy.jpg',
  // Keep this music file beside index.html if you later replace it.
  musicUrl: 'innimangalyam.mp3',
  // Paste your Google Apps Script Web App URL here after completing RSVP_SETUP.md.
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbxzbZDt2FoXRc87VtGtFCnYceA5rcmjOa9ARQE7DIm8rOzlW3EPp4K2XrYfZEMNSrbC/exec'
};

const $ = id => document.getElementById(id);
function applyDetails() {

  document.getElementById('coverBride').innerHTML = WEDDING.bride;
  document.getElementById('coverGroom').innerHTML = WEDDING.groom;

  document.getElementById('brideName').innerHTML = WEDDING.bride;
  document.getElementById('groomName').innerHTML = WEDDING.groom;

  document.getElementById('coverDate').innerHTML = WEDDING.displayDate;

  document.getElementById('day').innerHTML = WEDDING.day;
  document.getElementById('monthYear').innerHTML = WEDDING.monthYear;
  document.getElementById('time').innerHTML = WEDDING.time;

  document.getElementById('venueName').innerHTML = WEDDING.venue;
  document.getElementById('venuePlace').innerHTML = WEDDING.place;

  document.getElementById('mapLink').href = WEDDING.mapUrl;

  document.getElementById('music').src = WEDDING.musicUrl;

  document.querySelector('.cover-photo').style.backgroundImage =
    'linear-gradient(180deg, rgba(14,10,8,.22), rgba(14,10,8,.75)), url("' +
    WEDDING.coverPhoto +
    '")';

  document.querySelector('.venue').style.backgroundImage =
    'linear-gradient(rgba(21,17,14,.88), rgba(21,17,14,.92)), url("' +
    WEDDING.venuePhoto +
    '")';

  document.querySelector('.hero').style.backgroundImage =
    'linear-gradient(rgba(220,213,217,.55), rgba(220,213,217,.55)), url("' +
    WEDDING.heroPhoto +
    '")';

  document.querySelector('.hero').style.backgroundSize = 'cover';

  document.querySelector('.hero').style.backgroundPosition = '42% 20%';
}

applyDetails();
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

/// =====================================================
// RSVP SYSTEM
// Mobile number is used to identify an existing RSVP.
// =====================================================


const mobileStep =
  $('mobileStep');

const mobileNumber =
  $('mobileNumber');

const checkMobile =
  $('checkMobile');

const rsvpForm =
  $('rsvpForm');

const rsvpChoices =
  $('rsvpChoices');

const attendingFields =
  $('attendingFields');

const rsvpFeedback =
  $('rsvpFeedback');

const rsvpBack =
  $('rsvpBack');

const rsvpExisting =
  $('rsvpExisting');

const existingGuestName =
  $('existingGuestName');

const existingAttendance =
  $('existingAttendance');

const existingDetails =
  $('existingDetails');

const changeResponse =
  $('changeResponse');


let currentMobile = '';

let existingResponse = null;



// =====================================================
// NORMALIZE MOBILE NUMBER
// =====================================================

function normalizeMobile(phone){

  let digits =
    String(phone || '')
      .replace(/\D/g,'');


  if(
    digits.startsWith('91') &&
    digits.length === 12
  ){

    digits =
      digits.substring(2);

  }


  if(
    digits.startsWith('0') &&
    digits.length === 11
  ){

    digits =
      digits.substring(1);

  }


  return digits;

}



// =====================================================
// ERROR MESSAGE
// =====================================================

function showRsvpError(message){

  let error =
    document.getElementById(
      'rsvpError'
    );


  if(!error){

    error =
      document.createElement('p');

    error.id =
      'rsvpError';

    error.className =
      'rsvp-error';

    mobileStep
      .querySelector('.rsvp-form')
      .appendChild(error);

  }


  error.textContent =
    message;

}



// =====================================================
// CLEAR ERROR
// =====================================================

function clearRsvpError(){

  const error =
    document.getElementById(
      'rsvpError'
    );

  if(error){
    error.remove();
  }

}



// =====================================================
// SHOW NEW RSVP OPTIONS
// =====================================================

function showNewRsvp(){

  mobileStep.hidden =
    true;

  rsvpExisting.hidden =
    true;

  rsvpChoices.hidden =
    false;

  rsvpForm.hidden =
    true;

  rsvpFeedback.hidden =
    true;

  rsvpBack.hidden =
    true;

}



// =====================================================
// SHOW RSVP FORM
// =====================================================

function showRsvpForm(attendance) {

  const attending = attendance === 'Joyfully attending';

  $('attendance').value = attendance;

  rsvpChoices.hidden = true;
  rsvpExisting.hidden = true;
  rsvpForm.hidden = false;
  rsvpFeedback.hidden = true;
  rsvpBack.hidden = true;

  attendingFields.hidden = !attending;

  rsvpForm.elements.guestCount.required = attending;
  rsvpForm.elements.meal.required = attending;

  if (existingResponse) {

    rsvpForm.elements.guestName.value =
      existingResponse.guestName || '';

    rsvpForm.elements.message.value =
      existingResponse.message || '';

    if (attending) {

      rsvpForm.elements.guestCount.value =
        existingResponse.guestCount || '';

      rsvpForm.elements.meal.value =
        existingResponse.meal || '';

    } else {

      // Clear old attending information
      rsvpForm.elements.guestCount.value = '';
      rsvpForm.elements.meal.value = '';

    }

  } else {

    rsvpForm.elements.guestCount.value = '';
    rsvpForm.elements.meal.value = '';
    rsvpForm.elements.message.value = '';

  }

  rsvpForm.elements.guestName.focus();
}



// =====================================================
// CHECK MOBILE NUMBER
// =====================================================

checkMobile.addEventListener('click', async function () {

  clearRsvpError();

  const mobile = normalizeMobile(mobileNumber.value);

  if (mobile.length !== 10) {
    showRsvpError('Please enter a valid 10-digit mobile number.');
    mobileNumber.focus();
    return;
  }

  currentMobile = mobile;

  checkMobile.disabled = true;
  checkMobile.textContent = 'Checking…';

  try {

    const url =
      WEDDING.rsvpEndpoint +
      '?mobile=' +
      encodeURIComponent(currentMobile) +
      '&t=' +
      Date.now();

    console.log('RSVP lookup URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Server returned HTTP ' + response.status);
    }

    const data = await response.json();

    console.log('RSVP response:', data);

    if (data && data.found) {
      existingResponse = data.response;
      showExistingRsvp(data.response);
    } else {
      existingResponse = null;
      showNewRsvp();
    }

  } catch (error) {

    console.error('RSVP lookup failed:', error);

    showRsvpError(
      'Unable to connect to the RSVP server. Please try again.'
    );

  } finally {

    checkMobile.disabled = false;
    checkMobile.textContent = 'Continue →';

  }

});

// =====================================================
// SHOW EXISTING RSVP
// =====================================================

function showExistingRsvp(response){

  mobileStep.hidden =
    true;

  rsvpChoices.hidden =
    true;

  rsvpForm.hidden =
    true;

  rsvpFeedback.hidden =
    true;

  rsvpBack.hidden =
    true;

  rsvpExisting.hidden =
    false;


  existingGuestName.textContent =
    response.guestName ||
    'Guest';


  existingAttendance.textContent =
    response.attendance ||
    '';


  let details = '';


  if(
    response.attendance ===
    'Joyfully attending'
  ){

    if(response.guestCount){

      details +=
        response.guestCount +
        ' guest' +
        (
          Number(
            response.guestCount
          ) === 1
            ? ''
            : 's'
        );

    }


    if(response.meal){

      if(details){
        details += ' · ';
      }

      details +=
        response.meal;

    }

  }


  if(response.message){

    if(details){
      details += '<br>';
    }

    details +=
      '“' +
      escapeHtml(
        response.message
      ) +
      '”';

  }


  existingDetails.innerHTML =
    details;

}



// =====================================================
// CHANGE EXISTING RESPONSE
// =====================================================

changeResponse.addEventListener(
  'click',
  () => {

    if(!existingResponse){
      return;
    }


    showRsvpForm(
      existingResponse.attendance
    );

  }
);



// =====================================================
// ATTENDANCE BUTTONS
// =====================================================

document
  .querySelectorAll(
    '[data-attendance]'
  )
  .forEach(button => {

    button.addEventListener(
      'click',
      () => {

        showRsvpForm(
          button.dataset.attendance
        );

      }
    );

  });



// =====================================================
// SUBMIT RSVP
// =====================================================

rsvpForm.addEventListener(
  'submit',
  async event => {

    event.preventDefault();


    if(!currentMobile){

      alert(
        'Please enter your mobile number first.'
      );

      return;

    }


    const submitButton =
      rsvpForm.querySelector(
        '[type="submit"]'
      );


    submitButton.disabled =
      true;


    submitButton.textContent =
      existingResponse
        ? 'Updating…'
        : 'Sending…';


    const response =
      Object.fromEntries(
        new FormData(rsvpForm)
      );


    response.mobile =
      currentMobile;


    response.submittedAt =
      new Date().toISOString();


    try{

      await fetch(
        WEDDING.rsvpEndpoint,
        {

          method:'POST',

          mode:'no-cors',

          headers:{
            'Content-Type':
              'text/plain;charset=utf-8'
          },

          body:
            JSON.stringify(
              response
            )

        }
      );


      existingResponse =
        response;


      rsvpForm.hidden =
        true;

      rsvpChoices.hidden =
        true;

      rsvpExisting.hidden =
        true;

      rsvpFeedback.hidden =
        false;

      rsvpBack.hidden =
        false;


      if(
        response.attendance ===
        'Joyfully attending'
      ){

        rsvpFeedback.innerHTML =
          'Thank you — we cannot wait to celebrate with you. ' +
          '<a href="' +
          WEDDING.mapUrl +
          '" target="_blank" rel="noopener">' +
          'Get directions ↗</a>';

      }

      else{

        rsvpFeedback.innerHTML =
          'Thank you for your love and blessings. ' +
          'You will be in our hearts on this special day.';

      }


    }

    catch(error){

      console.error(
        'RSVP submission failed:',
        error
      );


      submitButton.disabled =
        false;


      submitButton.textContent =
        existingResponse
          ? 'Update RSVP ✦'
          : 'Send RSVP ✦';


      alert(
        'Your RSVP could not be sent. Please check your connection and try again.'
      );

    }

  }
);



// =====================================================
// CHANGE RESPONSE AFTER SUBMISSION
// =====================================================

rsvpBack.addEventListener(
  'click',
  () => {

    if(!existingResponse){
      return;
    }


    showRsvpForm(
      existingResponse.attendance
    );

  }
);



// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(text){

  const div =
    document.createElement(
      'div'
    );


  div.textContent =
    text || '';


  return div.innerHTML;

}
