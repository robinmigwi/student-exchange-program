(() => {
  const nav=document.getElementById('site-nav');
  const toggle=document.querySelector('.nav-toggle');
  const revealEls=document.querySelectorAll('.reveal');
  const slides=[...document.querySelectorAll('.journey-slide')];
  const dots=[...document.querySelectorAll('.journey-dot')];
  const journeySpace=document.querySelector('.journey-scroll-space');
  const fill=document.querySelector('.journey-progress-fill');
  const navLinks=document.querySelectorAll('.nav-links a, .nav-cta');

  const onScroll=()=>{
    nav?.classList.toggle('scrolled',window.scrollY>60);
    if(!journeySpace||!slides.length)return;
    const rect=journeySpace.getBoundingClientRect();
    const max=Math.max(1,journeySpace.offsetHeight-window.innerHeight);
    const progress=Math.min(1,Math.max(0,(-rect.top)/max));
    const scaled=progress*(slides.length-1);
    const index=Math.min(slides.length-1,Math.max(0,Math.round(scaled)));
    slides.forEach((s,i)=>s.classList.toggle('active',i===index));
    dots.forEach((d,i)=>d.classList.toggle('active',i<=index));
    if(fill)fill.style.width=((index+1)/slides.length*100)+'%';
  };
  let ticking=false;
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{onScroll();ticking=false});ticking=true}},{passive:true});
  onScroll();

  toggle?.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',String(!open));
    toggle.setAttribute('aria-label',open?'Open menu':'Close menu');
    nav.classList.toggle('menu-visible',!open);
    document.body.classList.toggle('menu-open',!open);
  });
  navLinks.forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('menu-visible');document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open menu');
  }));

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  revealEls.forEach(el=>observer.observe(el));

  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{
    if(!journeySpace)return;
    const rect=journeySpace.getBoundingClientRect();
    const max=journeySpace.offsetHeight-window.innerHeight;
    const target=window.scrollY+rect.top+(max*(i/(slides.length-1)));
    window.scrollTo({top:target,behavior:'smooth'});
  }));

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce&&journeySpace)journeySpace.style.height='auto';
})();