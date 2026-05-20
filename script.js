/* ═══════════════════════════
   HELPERS
═══════════════════════════ */
function makeCarousel(trackId, dotsId, prevId, nextId, opts = {}){
  const track   = document.getElementById(trackId);
  const dotsEl  = document.getElementById(dotsId);
  if(!track) return;

  const cards   = Array.from(track.children);
  let current   = 0;
  let isDragging= false;
  let startX    = 0;
  let scrollLeft= 0;

  // compute visible cards based on viewport
  function perView(){
    const w = window.innerWidth;
    if(opts.fixed) return opts.fixed;
    if(w < 480) return 1.1;
    if(w < 768) return 1.6;
    if(w < 1024) return 2.6;
    return opts.desktop || 3.5;
  }

  function cardW(){
    return cards[0] ? cards[0].offsetWidth + 22 : 0; // 22 = gap
  }

  function maxIndex(){
    return Math.max(0, cards.length - Math.floor(perView()));
  }

  function goTo(idx){
    current = Math.max(0, Math.min(idx, maxIndex()));
    track.style.transform = `translateX(-${current * cardW()}px)`;
    updateDots();
  }

  // Build dots
  function buildDots(){
    if(!dotsEl) return;
    dotsEl.innerHTML = '';
    const total = maxIndex() + 1;
    for(let i=0;i<total;i++){
      const d = document.createElement('button');
      d.className = 'dot' + (i===current?' active':'');
      d.addEventListener('click', ()=>goTo(i));
      dotsEl.appendChild(d);
    }
  }

  function updateDots(){
    if(!dotsEl) return;
    dotsEl.querySelectorAll('.dot').forEach((d,i)=>{
      d.classList.toggle('active', i===current);
    });
  }

  buildDots();

  // Arrows
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if(prev) prev.addEventListener('click',()=>goTo(current-1));
  if(next) next.addEventListener('click',()=>goTo(current+1));

  // Touch / drag
  const wrap = track.parentElement;
  function onStart(x){ isDragging=true; startX=x; scrollLeft=current*cardW(); wrap.style.cursor='grabbing'; }
  function onMove(x){ if(!isDragging)return; const dx=startX-x; track.style.transform=`translateX(-${scrollLeft+dx}px)`; }
  function onEnd(x){
    if(!isDragging)return; isDragging=false; wrap.style.cursor='grab';
    const dx = startX - x;
    if(Math.abs(dx) > 50) goTo(dx>0 ? current+1 : current-1);
    else goTo(current);
  }
  wrap.addEventListener('mousedown', e=>onStart(e.clientX));
  window.addEventListener('mousemove', e=>{ if(isDragging) onMove(e.clientX); });
  window.addEventListener('mouseup',   e=>onEnd(e.clientX));
  wrap.addEventListener('touchstart',  e=>onStart(e.touches[0].clientX),{passive:true});
  wrap.addEventListener('touchmove',   e=>onMove(e.touches[0].clientX),{passive:true});
  wrap.addEventListener('touchend',    e=>onEnd(e.changedTouches[0].clientX));

  // Auto advance
  if(opts.auto){
    setInterval(()=>{ goTo(current >= maxIndex() ? 0 : current+1); }, opts.auto);
  }

  window.addEventListener('resize',()=>{ buildDots(); goTo(current); });
}

/* ═══════════════════════════
   INIT CAROUSELS
═══════════════════════════ */
makeCarousel('catTrack','catDots','catPrev','catNext',{desktop:4.2, auto:4000});
makeCarousel('prodTrack','prodDots','prodPrev','prodNext',{desktop:3.5, auto:5000});
makeCarousel('testiTrack','testiDots','','',{desktop:2.8, auto:4500});
makeCarousel('blogTrack','blogDots','','',{desktop:2.8, auto:5500});

/* ═══════════════════════════
   NAVBAR SCROLL
═══════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>{
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ═══════════════════════════
   HAMBURGER
═══════════════════════════ */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileMenu');
ham.addEventListener('click',()=>{
  ham.classList.toggle('open');
  mob.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a=>{
  a.addEventListener('click',()=>{
    ham.classList.remove('open');
    mob.classList.remove('open');
  });
});
 /* =========================
     PREMIUM 3D VIDEO SCROLL
  ========================= */

  const scrollSection = document.querySelector('.scroll-video-section');
  const video = document.querySelector('.scroll-video');
  const videoContent = document.querySelector('.video-content');

  if (scrollSection && video) {

    let ticking = false;

    const animate3DVideo = () => {
      const rect = scrollSection.getBoundingClientRect();
      const sectionHeight = scrollSection.offsetHeight;

      // Avoid division by zero when section is same height as viewport
      const denom = sectionHeight - window.innerHeight;
      const rawProgress = denom === 0 ? 0 : (-rect.top) / denom;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      const scale = 0.72 + (progress * 0.38);
      const rotateX = 18 - (progress * 18);
      const translateY = 180 - (progress * 180);
      const radius = 32 - (progress * 32);
      const opacity = 0.55 + (progress * 0.45);

      video.style.transform = `perspective(1800px) rotateX(${rotateX}deg) scale(${scale}) translateY(${translateY}px)`;
      video.style.borderRadius = `${radius}px`;
      video.style.opacity = `${opacity}`;

      if (videoContent) {
        videoContent.classList.toggle('active', progress > 0.28);
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(animate3DVideo);
        ticking = true;
      }
    });

    // initial call
    animate3DVideo();
  }


/* ═══════════════════════════
   SCROLL REVEAL
═══════════════════════════ */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on'); });
},{threshold:.1, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-s').forEach(el=>observer.observe(el));

/* ═══════════════════════════
   3D CARD TILT (mouse)
═══════════════════════════ */
document.querySelectorAll('.product-card,.cat-card,.blog-card,.testi-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r  = card.getBoundingClientRect();
    const x  = ((e.clientX-r.left)/r.width -.5)*10;
    const y  = ((e.clientY-r.top )/r.height-.5)*10;
    card.style.transform=`translateY(-12px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
    card.style.transition='transform .1s';
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='';
    card.style.transition='transform .5s cubic-bezier(.25,.46,.45,.94), box-shadow .5s';
  });
});

/* ═══════════════════════════
   NEWSLETTER
═══════════════════════════ */
document.getElementById('nlBtn').addEventListener('click',()=>{
  const inp = document.querySelector('.nl-input');
  const btn = document.getElementById('nlBtn');
  if(inp.value.includes('@')){
    btn.textContent='✓ Subscribed!';
    btn.style.background='#5c3d2e';
    inp.value='';
    setTimeout(()=>{ btn.textContent='Subscribe'; btn.style.background=''; },3000);
  } else {
    inp.style.borderColor='#c8622a';
    inp.focus();
    setTimeout(()=>{ inp.style.borderColor=''; },1500);
  }
});

/* ═══════════════════════════
   TRUST BAR — dynamic width fix
═══════════════════════════ */
// already handled by CSS animation, no JS needed

