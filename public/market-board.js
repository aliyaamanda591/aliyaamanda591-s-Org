/* Public prices only; loaded independently of authentication and private portfolios. */
(()=>{
  const root=document.getElementById('marketWatch');if(!root)return;
  const list=document.getElementById('marketWatchList'),note=document.getElementById('marketWatchNote');
  let catalog=[{id:'index:IHSG',code:'IHSG',name:'Indeks Harga Saham Gabungan',kind:'index'}];
  const search=document.getElementById('marketWatchSearch'),count=document.getElementById('watchCount'),previous=document.getElementById('watchPrevious'),next=document.getElementById('watchNext');
  const checked=new Map();let page=0,searchTimer=null,controller=null,requestNumber=0;
  function cancelPrevious(){if(controller)controller.abort();controller=null;requestNumber++;}
  function filtered(){const query=(search?.value||'').trim().toLocaleLowerCase('id');const result=catalog.filter(a=>a.kind===group&&(!query||(a.code+' '+a.name).toLocaleLowerCase('id').includes(query)));if(query)result.sort((a,b)=>Number(b.code.toLowerCase()===query)-Number(a.code.toLowerCase()===query));return result;}
  function visible(){return filtered().slice(page*6,page*6+6);}
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
  const stamp=s=>{const n=Date.parse(s);return Number.isFinite(n)?new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(n)+' WIB':'Waktu pasar tidak disediakan';};
  let quotes=[],group='index';
  function chart(q){
    const p=Array.isArray(q.points)?q.points.filter(n=>typeof n==='number'&&Number.isFinite(n)&&n>0).slice(0,61):[];
    if(p.length<2)return '<span class="watch-no-chart">Grafik belum tersedia</span>';
    const low=Math.min(...p),span=Math.max(...p)-low||1,xy=p.map((n,i)=>(i/(p.length-1)*100).toFixed(1)+','+(30-(n-low)/span*26).toFixed(1)).join(' ');
    return '<svg class="watch-chart" viewBox="0 0 100 34" role="img" aria-label="'+safe(q.code+' · '+q.period)+'"><title>'+safe(q.code+' · '+q.period)+'</title><polyline points="'+xy+'" fill="none" stroke="currentColor" stroke-width="1.7" vector-effect="non-scaling-stroke"/></svg><small class="watch-period">'+safe(q.period)+'</small>';
  }
  function render(){
    const currency=root.querySelector('.watch-currency');if(currency)currency.textContent=group==='index'?'INDEKS':'IDR';
    const all=filtered(),items=visible();
    if(count)count.textContent=all.length?(page*6+1)+'–'+Math.min(page*6+6,all.length)+' dari '+all.length+' aset':'Tidak ada hasil';
    if(previous)previous.disabled=page===0;if(next)next.disabled=(page+1)*6>=all.length;
    if(search){search.hidden=group==='index';const label=root.querySelector('.watch-search-label');if(label)label.hidden=group==='index';const pages=root.querySelector('.watch-page');if(pages)pages.hidden=group==='index';}
    list.innerHTML=items.map(({code,name,kind})=>{
      const q=quotes.find(q=>q.code===code&&q.kind===kind),valid=q&&Number.isFinite(q.price)&&q.price>0,change=valid&&typeof q.change==='number'&&Number.isFinite(q.change)?q.change:null;
      const tone=change===null?'neutral':change<0?'down':'up';
      const delta=change===null?'Perubahan —':(change>0?'+':'')+change.toLocaleString('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
      const price=valid?(kind==='index'?q.price.toLocaleString('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2})+' <small class="watch-index-unit">poin</small>':(q.estimated?'≈ ':'')+safe(money(q.price))):'—';
      return '<article class="watch-quote '+tone+'"><div class="watch-identity"><span class="watch-symbol">'+safe(code)+'</span><span class="watch-name">'+safe(name)+'</span></div><div class="watch-value"><strong>'+price+'</strong><span class="watch-change">'+safe(delta)+(group==='crypto'?' <small>'+safe(q?.changeLabel||'24j')+'</small>':'')+'</span></div><div class="watch-trend">'+(valid?chart(q):'<span class="watch-no-chart">Menunggu sumber</span>')+'</div><p class="watch-source">'+(valid?safe((q.stale?'Tersimpan · ':'')+q.source)+'<br>'+safe(stamp(q.marketAt||q.fetchedAt)):'Harga belum tersedia')+'</p></article>';
    }).join('')||'<p class="watch-empty">Aset tidak ditemukan. Coba kode atau nama lain.</p>';
  }
  function accept(data,cached=false){
    if(!Array.isArray(data?.quotes))return;
    for(const q of data.quotes){if(!catalog.some(c=>c.code===q.code&&c.kind===q.kind)||!Number.isFinite(q.price)||q.price<=0)continue;const i=quotes.findIndex(x=>x.code===q.code&&x.kind===q.kind);const item={...q,stale:cached||q.stale};if(i<0)quotes.push(item);else quotes[i]=item;}
    render();
  }
  try{const d=JSON.parse(window.localStorage.getItem('sidaps_public_market_v1')||'null');if(d&&Date.now()-d.savedAt<7*86400000){accept(d,true);note.textContent='Harga tersimpan · memeriksa sumber…';}}catch{}
  render();
  root.querySelectorAll('[data-watch-kind]').forEach(button=>button.addEventListener('click',()=>{cancelPrevious();group=button.dataset.watchKind;page=0;if(search)search.value='';root.querySelectorAll('[data-watch-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();refresh();}));
  if(search)search.addEventListener('input',()=>{cancelPrevious();page=0;render();clearTimeout(searchTimer);searchTimer=setTimeout(refresh,400);});
  if(previous)previous.addEventListener('click',()=>{if(page>0){cancelPrevious();page--;render();refresh();}});
  if(next)next.addEventListener('click',()=>{if((page+1)*6<filtered().length){cancelPrevious();page++;render();refresh();}});
  async function refresh(){
    if(document.hidden)return;
    const assets=visible();if(!assets.length)return;const key=assets.map(a=>a.id).sort().join(',');
    if(Date.now()-(checked.get(key)||0)<300000)return;
    if(controller)controller.abort();controller=new AbortController();const ownController=controller,request=++requestNumber;
    const deadline=setTimeout(()=>ownController.abort(),12000);note.textContent='Memeriksa harga aset yang ditampilkan…';
    try{
      const r=await window.fetch('/api/market-board?assets='+encodeURIComponent(key),{signal:ownController.signal,credentials:'omit'});if(!r.ok)throw Error('unavailable');
      const d=await r.json();if(request!==requestNumber)return;const selected=q=>assets.some(a=>a.code===q.code&&a.kind===q.kind);quotes=quotes.map(q=>selected(q)?{...q,stale:true}:q);accept(d);checked.set(key,Date.now());
      const shown=quotes.filter(selected);note.textContent=shown.length?(shown.length<assets.length||shown.some(q=>q.stale)?'Sebagian harga belum tersedia · harga tersimpan dipertahankan':'Otomatis 5 menit · harga dapat tertunda'):'Sumber harga belum tersedia. Login tetap bisa digunakan.';
      try{window.localStorage.setItem('sidaps_public_market_v1',JSON.stringify({quotes:quotes.slice(-120),savedAt:Date.now()}));}catch{}
    }catch{if(request===requestNumber){render();note.textContent='Sumber belum tersedia · login tetap bisa digunakan';}}
    finally{clearTimeout(deadline);if(request===requestNumber)controller=null;}
  }
  async function loadCatalog(){try{const r=await window.fetch('/market-catalog.json',{credentials:'omit'});if(!r.ok)throw Error('catalog');const data=await r.json();if(!Array.isArray(data)||!data.some(a=>a.id==='index:IHSG'))throw Error('catalog');catalog=data;try{const d=JSON.parse(window.localStorage.getItem('sidaps_public_market_v1')||'null');if(d&&Date.now()-d.savedAt<7*86400000)accept(d,true);}catch{}render();}catch{note.textContent='Katalog belum tersedia. Muat ulang untuk mencoba lagi.';}await refresh();}
  // First paint and login initialization always come before market traffic.
  if(window.IntersectionObserver){const observer=new window.IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();loadCatalog();}},{rootMargin:'160px'});observer.observe(root);}else setTimeout(loadCatalog,800);
  setInterval(refresh,300000);document.addEventListener('visibilitychange',refresh);
})();
