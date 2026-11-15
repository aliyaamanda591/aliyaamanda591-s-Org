(()=>{const demos={stock:['S','Saham pilihanmu','Catat jumlah lembar dan modal pembelian.'],crypto:['₿','Kripto pilihanmu','Catat jumlah koin, termasuk unit desimal.'],gold:['▱','Emas pilihanmu','Catat berat dalam gram dan total pembelian.']};document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{const data=demos[button.dataset.preview];if(!data)return;document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));['demoSymbol','demoName','demoDescription'].forEach((id,i)=>{document.getElementById(id).textContent=data[i];});}));})();
// Content stays visible without JS; observers are optional, and never touch account data.
(()=>{
 if(typeof window==='undefined'||!window.matchMedia||window.matchMedia('(prefers-reduced-motion: reduce)').matches||!window.IntersectionObserver)return;
 const targets=document.querySelectorAll('.section-heading,.feature-grid>article,.how-grid>div,.steps li,.privacy>div,.faq>div,.closing');
 let reveal;
 try{reveal=new window.IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}}},{threshold:0.08});
 for(const target of targets){reveal.observe(target);target.classList.add('reveal-ready');}}catch{for(const target of targets)target.classList.remove('reveal-ready');if(reveal)reveal.disconnect();}
 const hero=document.querySelector('.premium-hero');if(hero){try{new window.IntersectionObserver(entries=>{hero.classList.toggle('motion-offscreen',!entries[0].isIntersecting);}).observe(hero);}catch{}}
 const visibility=()=>document.documentElement.classList.toggle('landing-motion-paused',document.hidden);document.addEventListener('visibilitychange',visibility);visibility();
})();
