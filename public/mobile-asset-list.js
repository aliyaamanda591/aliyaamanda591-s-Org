// Mobile scanning view. Original financial rows and action handlers remain intact.
(()=>{
 const phone=matchMedia('(max-width:760px)'),expanded=new Set();let pending=false,serial=0;
 function scan(){pending=false;document.querySelectorAll('.assetgrid').forEach(grid=>{
  if(!grid.previousElementSibling?.classList.contains('asset-mobile-hint')){const hint=document.createElement('p');hint.className='asset-mobile-hint';hint.textContent='Ketuk aset untuk melihat rincian atau mencatat Beli / Jual.';grid.before(hint);}
  grid.querySelectorAll('.asset:not([data-mobile-asset])').forEach(card=>{
   card.dataset.mobileAsset='true';const name=card.querySelector('h3')?.textContent||'Aset',rows=card.querySelectorAll('.assetrow'),price=card.querySelector('.price'),profit=rows[3]?.querySelector('b'),quantity=rows[2]?.querySelector('b');
   const detail=document.createElement('div');detail.className='asset-mobile-detail';detail.id='mobileAssetDetail'+(++serial);detail.append(...card.childNodes);
   const button=document.createElement('button');button.type='button';button.className='asset-mobile-summary';button.setAttribute('aria-controls',detail.id);
   const logo=detail.querySelector('.asset-logo')?.cloneNode(true);if(logo){logo.setAttribute('aria-hidden','true');button.append(logo);}
   const identity=document.createElement('span');identity.className='asset-mobile-identity';const title=document.createElement('strong'),units=document.createElement('small');title.textContent=name;units.textContent=quantity?.textContent||'';identity.append(title,units);
   const amounts=document.createElement('span');amounts.className='asset-mobile-amounts';const value=document.createElement('strong'),pl=document.createElement('small');value.textContent=price?.textContent||'';pl.textContent=profit?.textContent||'';pl.className=profit?.className||'';amounts.append(value,pl);
   const chevron=document.createElement('span');chevron.className='asset-mobile-chevron';chevron.setAttribute('aria-hidden','true');chevron.textContent='⌄';button.append(identity,amounts,chevron);card.append(button,detail);
   function set(open){card.classList.toggle('mobile-asset-expanded',open);button.setAttribute('aria-expanded',String(open));if(open)expanded.add(name);else expanded.delete(name);}
   set(expanded.has(name));button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';if(open)grid.querySelectorAll('.mobile-asset-expanded').forEach(other=>{if(other===card)return;expanded.delete(other.querySelector('h3')?.textContent);other.classList.remove('mobile-asset-expanded');other.querySelector('.asset-mobile-summary')?.setAttribute('aria-expanded','false');});set(open);});
  });
 });}
 function schedule(){if(!pending){pending=true;requestAnimationFrame(scan);}}
 scan();new MutationObserver(schedule).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});phone.addEventListener('change',schedule);
})();
