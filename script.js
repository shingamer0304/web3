
(() => {
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => [...p.querySelectorAll(s)];

  // Custom tactical cursor
  const cursor = document.createElement('div');
  cursor.className = 'tactical-cursor';
  cursor.innerHTML = '<i></i><b></b><span></span>';
  document.body.appendChild(cursor);

  let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
  addEventListener('pointermove', e => {
    mx=e.clientX; my=e.clientY;
    document.documentElement.style.setProperty('--mx', mx+'px');
    document.documentElement.style.setProperty('--my', my+'px');
  });
  const cursorLoop = () => {
    cx += (mx-cx)*.18; cy += (my-cy)*.18;
    cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;
    requestAnimationFrame(cursorLoop);
  };
  cursorLoop();

  $$('a,button,.panel,.hobby,.project,.info,.nav-links a').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.classList.add('target'));
    el.addEventListener('mouseleave',()=>cursor.classList.remove('target'));
  });

  // Pointer-reactive panels
  $$('.panel,.operator,.hero-copy,.nav').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--rx', `${y*-4}deg`);
      card.style.setProperty('--ry', `${x*5}deg`);
      card.style.setProperty('--px', `${(x+.5)*100}%`);
      card.style.setProperty('--py', `${(y+.5)*100}%`);
    });
    card.addEventListener('pointerleave',()=>{
      card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg');
    });
  });

  // Scroll reveal + active navigation
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')});
  },{threshold:.12});
  $$('.reveal,.panel,.timeline-item').forEach(e=>io.observe(e));

  // Decryption headline effect
  const chars='01X#%<>/[]{}∆Ω';
  $$('.decrypt').forEach(el=>{
    const original=el.textContent;
    el.addEventListener('mouseenter',()=>{
      let n=0;
      const timer=setInterval(()=>{
        el.textContent=[...original].map((c,i)=>{
          if(c===' ')return ' ';
          return i<n ? c : chars[Math.floor(Math.random()*chars.length)];
        }).join('');
        n++;
        if(n>original.length) clearInterval(timer);
      },22);
    });
  });

  // Terminal typing
  $$('.typewrite').forEach(el=>{
    const text=el.textContent; el.textContent='';
    [...text].forEach((c,i)=>setTimeout(()=>el.textContent+=c,i*28));
  });

  // Dynamic coordinate HUD
  const hud=document.createElement('div');
  hud.className='pointer-hud';
  hud.innerHTML='<span>X:000</span><span>Y:000</span><em>TRACKING</em>';
  document.body.appendChild(hud);
  addEventListener('pointermove',e=>{
    hud.style.left=(e.clientX+18)+'px'; hud.style.top=(e.clientY+18)+'px';
    hud.children[0].textContent='X:'+String(e.clientX).padStart(3,'0');
    hud.children[1].textContent='Y:'+String(e.clientY).padStart(3,'0');
  });

  // Click pulse / scan burst
  addEventListener('pointerdown',e=>{
    const p=document.createElement('span'); p.className='click-pulse';
    p.style.left=e.clientX+'px'; p.style.top=e.clientY+'px';
    document.body.appendChild(p); setTimeout(()=>p.remove(),650);
  });

  // Scroll progress
  const bar=document.createElement('div'); bar.className='scroll-progress'; document.body.appendChild(bar);
  addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?scrollY/h*100:0)+'%';
  },{passive:true});

  // Number counter
  const counters=$$('[data-count]');
  const co=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done='1';
      const target=+e.target.dataset.count; let n=0;
      const step=Math.max(1,Math.ceil(target/35));
      const tick=()=>{n=Math.min(target,n+step);e.target.textContent=n;if(n<target)requestAnimationFrame(tick)};
      tick();
    })
  });
  counters.forEach(e=>co.observe(e));

  // Page transition
  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(!a || a.target==='_blank' || !a.href || a.origin!==location.origin) return;
    const url=new URL(a.href);
    if(url.pathname.endsWith('.html')){
      e.preventDefault(); document.body.classList.add('page-leave');
      setTimeout(()=>location.href=a.href,260);
    }
  });

  // Keyboard command panel
  const command=document.createElement('div');
  command.className='command-hint';
  command.innerHTML='<kbd>ESC</kbd> CLOSE • <kbd>H</kbd> HOME • <kbd>P</kbd> PROFILE • <kbd>E</kbd> EDUCATION • <kbd>HOB</kbd> HOBBY';
  document.body.appendChild(command);
  addEventListener('keydown',e=>{
    if(e.key==='Escape') command.classList.toggle('show');
    if(e.key.toLowerCase()==='h' && !e.ctrlKey) location.href='index.html';
    if(e.key.toLowerCase()==='p' && !e.ctrlKey) location.href='profile.html';
    if(e.key.toLowerCase()==='e' && !e.ctrlKey) location.href='education.html';
  });

  // Random micro telemetry
  setInterval(()=>{
    $$('.telemetry').forEach(el=>{
      const n=Math.floor(70+Math.random()*30);
      el.textContent='SYNC '+n+'%';
    });
  },1300);
})();
