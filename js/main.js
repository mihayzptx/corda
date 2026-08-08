/* ─────────────────────────────────────────
   CORDA Studio — main.js
   ───────────────────────────────────────── */

const FORM_ENDPOINT = 'https://formspree.io/f/xgawooyd';

// ── SCROLL PROGRESS BAR
(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const s = document.documentElement;
    const pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// ── CURSOR GLOW
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const g = document.createElement('div');
  g.id = 'cursor-glow';
  document.body.appendChild(g);
  let cx = window.innerWidth/2, cy = window.innerHeight/2, tx = cx, ty = cy;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function loop() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    g.style.left = cx + 'px';
    g.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseleave', () => g.style.opacity = '0');
  document.addEventListener('mouseenter', () => g.style.opacity = '1');
})();

// ── HERO PARTICLE CANVAS
(function () {
  const hero = document.querySelector('.hero, .page-hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-particles';
  hero.insertBefore(canvas, hero.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];
  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  function init() {
    dots = [];
    const count = Math.min(Math.floor((W * H) / 14000), 80);
    for (let i = 0; i < count; i++) {
      dots.push({ x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.2+0.3, vx: (Math.random()-.5)*0.18,
        vy: (Math.random()-.5)*0.18, alpha: Math.random()*0.5+0.15 });
    }
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    dots.forEach(d => {
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0)d.x=W; if(d.x>W)d.x=0;
      if(d.y<0)d.y=H; if(d.y>H)d.y=0;
      ctx.beginPath();
      ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(245,200,66,${d.alpha})`;
      ctx.fill();
    });
    for(let i=0;i<dots.length;i++) for(let j=i+1;j<dots.length;j++){
      const dx=dots[i].x-dots[j].x, dy=dots[i].y-dots[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<90){
        ctx.beginPath(); ctx.moveTo(dots[i].x,dots[i].y); ctx.lineTo(dots[j].x,dots[j].y);
        ctx.strokeStyle=`rgba(245,200,66,${0.07*(1-dist/90)})`; ctx.lineWidth=0.5; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  resize(); init(); draw();
  window.addEventListener('resize',()=>{resize();init();});
})();

// ── SCROLL REVEAL
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── ANIMATED COUNTERS
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const dur = 1600, start = performance.now();
  (function tick(now) {
    const p = Math.min((now-start)/dur,1), ease = 1-Math.pow(1-p,4);
    el.textContent = prefix + Math.round(ease*target) + suffix;
    if(p<1) requestAnimationFrame(tick);
  })(start);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting && !e.target.dataset.done){ e.target.dataset.done='1'; animateCounter(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

// ── BAR ANIMATIONS
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting && !e.target.dataset.done){
      e.target.dataset.done='1';
      e.target.querySelectorAll('.bar-fill').forEach((bar,i) => {
        setTimeout(()=>{ bar.style.width = bar.dataset.width+'%'; }, 150+i*100);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.bar-rows').forEach(el => barObs.observe(el));

// ── MAGNETIC BUTTONS
document.querySelectorAll('.nav-cta, .btn-main').forEach(btn => {
  btn.classList.add('btn-magnetic');
  btn.addEventListener('mousemove', e => {
    const r=btn.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    btn.style.transform=`translate(${x*0.18}px,${y*0.28}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
});

// ── CARD 3D TILT
document.querySelectorAll('.bc, .ind-card, .case-card, .blog-card, .ts-card, .svc-detail').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(800px) rotateX(${-y*4}deg) rotateY(${x*4}deg) translateZ(4px)`;
    card.style.transition='transform 0.1s ease';
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform='';
    card.style.transition='transform 0.4s ease, border-color 0.3s';
  });
});

// ── GLOW BORDERS
document.querySelectorAll('.svc-detail, .ts-card, .cs-block, .ind-card').forEach(el => {
  el.classList.add('glow-border');
});

// ── NAV SCROLL COMPRESS
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.height = window.scrollY > 60 ? '54px' : '';
  }, { passive: true });
})();

// ── TICKER LOOP CLONE
(function () {
  const track = document.querySelector('.ticker-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
})();

// ── CONTACT FORM
const form     = document.getElementById('contactForm');
const sendBtn  = document.getElementById('sendBtn');
const statusEl = document.getElementById('formStatus');
function showStatus(type,msg){ statusEl.textContent=msg; statusEl.className='form-status '+type; }
function clearStatus(){ statusEl.className='form-status'; }
function getField(id){ const el=document.getElementById(id); return el?el.value.trim():''; }
async function handleSubmit(e) {
  e.preventDefault(); clearStatus();
  const name=getField('f-name'), email=getField('f-email');
  const company=getField('f-company'), track=getField('f-track'), message=getField('f-message');
  if(!name){ showStatus('error','Please enter your name.'); return; }
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showStatus('error','Please enter a valid email.'); return; }
  if(!message){ showStatus('error','Tell us what you are working on.'); return; }
  if(FORM_ENDPOINT.includes('YOUR_FORM_ID')){ showStatus('error','Form not configured. See js/main.js.'); return; }
  sendBtn.disabled=true; sendBtn.textContent='Sending…';
  try {
    const res=await fetch(FORM_ENDPOINT,{method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({name,email,company,track,message})});
    if(res.ok){ showStatus('success','Message sent. We will be in touch within one business day.'); form.reset(); }
    else { const d=await res.json(); showStatus('error',d?.errors?.map(e=>e.message).join(', ')||'Something went wrong.'); }
  } catch { showStatus('error','Network error. Please try again.'); }
  finally { sendBtn.disabled=false; sendBtn.textContent='Send message →'; }
}
if(form) form.addEventListener('submit',handleSubmit);
