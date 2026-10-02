(() => {
  const nav=document.getElementById('site-nav');
  const toggle=document.querySelector('.nav-toggle');
  const revealEls=document.querySelectorAll('.reveal');
  const slides=[...document.querySelectorAll('.journey-slide')];
  const dots=[...document.querySelectorAll('.journey-dot')];
  const journeySpace=document.querySelector('.journey-scroll-space');
  const fill=document.querySelector('.journey-progress-fill');
  const navLinks=document.querySelectorAll('.nav-links a, .nav-cta');

  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));

  function renderJourney(progress){
    if(!journeySpace||!slides.length)return;
    const scaled=progress*(slides.length-1);
    const base=Math.floor(scaled);
    const local=scaled-base;

    slides.forEach((slide,i)=>{
      let opacity=0;
      let y=34;
      let scale=.985;

      if(i===base){
        opacity=1-local;
        y=-local*24;
        scale=1-local*.015;
      }else if(i===base+1){
        opacity=local;
        y=(1-local)*34;
        scale=.985+local*.015;
      }

      slide.style.opacity=opacity;
      slide.style.visibility=opacity>0.001?'visible':'hidden';
      slide.style.transform='translate3d(0,'+y+'px,0) scale('+scale+')';
      slide.style.pointerEvents=opacity>.5?'auto':'none';

      const image=slide.querySelector('.journey-slide-image img,.journey-wild-main>img');
      if(image){
        const imageScale=1.02+(i===base?local*.035:i===base+1?(1-local)*.035:0);
        image.style.transform='scale('+imageScale+')';
      }

      const copy=slide.querySelector('.journey-slide-copy');
      if(copy){
        copy.style.transform='translate3d(0,'+(i===base?-local*18:(i===base+1?(1-local)*18:0))+'px,0)';
      }
    });

    dots.forEach((dot,i)=>{
      const active=i<=base;
      dot.classList.toggle('active',active);
    });
    if(fill){
      fill.style.width=(progress*100)+'%';
    }
  }

  const onScroll=()=>{
    nav?.classList.toggle('scrolled',window.scrollY>60);
    if(!journeySpace||!slides.length)return;
    const rect=journeySpace.getBoundingClientRect();
    const scrollable=Math.max(1,journeySpace.offsetHeight-window.innerHeight);
    const progress=clamp((-rect.top)/scrollable,0,1);
    renderJourney(progress);
  };

  let ticking=false;
  window.addEventListener('scroll',()=>{
    if(!ticking){
      requestAnimationFrame(()=>{onScroll();ticking=false});
      ticking=true;
    }
  },{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  onScroll();

  toggle?.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',String(!open));
    toggle.setAttribute('aria-label',open?'Open menu':'Close menu');
    nav.classList.toggle('menu-visible',!open);
    document.body.classList.toggle('menu-open',!open);
  });

  navLinks.forEach(link=>link.addEventListener('click',()=>{
    nav.classList.remove('menu-visible');
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded','false');
    toggle?.setAttribute('aria-label','Open menu');
  }));

  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('in-view');
  }),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  revealEls.forEach(el=>observer.observe(el));

  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{
    if(!journeySpace)return;
    const rect=journeySpace.getBoundingClientRect();
    const scrollable=Math.max(1,journeySpace.offsetHeight-window.innerHeight);
    const target=window.scrollY+rect.top+(scrollable*(i/(slides.length-1)));
    window.scrollTo({top:target,behavior:'smooth'});
  }));

  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    slides.forEach((slide,i)=>{
      slide.style.transition='opacity .2s ease';
      slide.style.transform='none';
    });
  }
})();