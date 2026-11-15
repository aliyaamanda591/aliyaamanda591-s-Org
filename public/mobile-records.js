// Compact mobile records; preserve original cells and their existing actions.
(()=>{
 const mobile=matchMedia('(max-width:760px)');let serial=0,pending=false,pausedByLayout=false;const expanded=new Map();
 const plain=cell=>[...cell.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').trim();
 function scan(){pending=false;
  document.querySelectorAll('.phone-table[data-phone-kind=transactions],.phone-table[data-phone-kind=portfolio]').forEach(table=>{
   const kind=table.dataset.phoneKind;
   table.querySelectorAll('tbody tr:not([data-compact-record])').forEach(row=>{
    const cells=[...row.children];if(cells.length<5)return;row.dataset.compactRecord='true';
    const first=cells[0],original=document.createElement('span');original.className='record-original';original.append(...first.childNodes);first.append(original);
    const summary=document.createElement('button');summary.type='button';summary.className='record-summary';
    const identity=document.createElement('span');identity.className='record-identity';const title=document.createElement('strong'),subtitle=document.createElement('small'),amounts=document.createElement('span');amounts.className='record-amounts';const value=document.createElement('strong'),secondary=document.createElement('small');
    let key;
    if(kind==='transactions'){
     title.textContent=plain(cells[4])||'Transaksi';subtitle.textContent=original.textContent.trim()+' · '+(cells[5]?.textContent.trim()||'');value.textContent=cells[3].textContent.trim();secondary.textContent=cells[1].textContent.trim();secondary.className=secondary.textContent==='KELUAR'?'record-out':'record-in';key=cells.map(n=>n.textContent.trim()).join('|');
    }else{
     title.textContent=original.querySelector('b')?.textContent||plain(original)||'Aset';subtitle.textContent=cells[1].textContent.trim();value.textContent=plain(cells[3])||cells[3].childNodes[0]?.textContent||'';secondary.textContent=cells[4].textContent.trim();secondary.className=cells[4].classList.contains('red')||cells[4].querySelector('.red')?'red':cells[4].classList.contains('green')||cells[4].querySelector('.green')?'green':'';key=title.textContent;
     const logo=original.querySelector('.asset-logo')?.cloneNode(true);if(logo){logo.setAttribute('aria-hidden','true');summary.append(logo);summary.classList.add('has-logo');}
    }
    identity.append(title,subtitle);amounts.append(value,secondary);const arrow=document.createElement('span');arrow.className='record-chevron';arrow.textContent='⌄';arrow.setAttribute('aria-hidden','true');summary.append(identity,amounts,arrow);first.prepend(summary);
    const ids=[];cells.slice(1).forEach(cell=>{cell.id=cell.id||'recordDetail'+(++serial);ids.push(cell.id);});summary.setAttribute('aria-controls',ids.join(' '));
    const group=table.tBodies[0];
    function set(open){row.classList.toggle('compact-record-open',open);summary.setAttribute('aria-expanded',String(open));if(open)expanded.set(table,key);else if(expanded.get(table)===key)expanded.delete(table);}
    set(expanded.get(table)===key);
    summary.addEventListener('click',()=>{const open=summary.getAttribute('aria-expanded')!=='true';group.querySelectorAll('.compact-record-open').forEach(other=>{other.classList.remove('compact-record-open');other.querySelector('.record-summary')?.setAttribute('aria-expanded','false');});set(open);});
   });
  });
  const box=document.querySelector('#dashboard .portfolio-table');if(box&&!box.dataset.mobileDisclosure){
   box.dataset.mobileDisclosure='true';box.id=box.id||'dashboardPortfolioRecords';const section=box.previousElementSibling,button=document.createElement('button');section?.classList.add('portfolio-record-section');button.type='button';button.className='btn soft portfolio-record-toggle';button.setAttribute('aria-controls',box.id);button.setAttribute('aria-expanded','false');button.textContent='Lihat portofolio';
   button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.textContent=open?'Tutup rincian':'Lihat portofolio';box.classList.toggle('portfolio-records-open',open);});section?.append(button);
  }
  const toggle=document.getElementById('scrollToggle');if(toggle){if(mobile.matches&&toggle.getAttribute('aria-pressed')==='true'){toggle.click();pausedByLayout=true;}else if(!mobile.matches&&pausedByLayout){if(toggle.getAttribute('aria-pressed')==='false')toggle.click();pausedByLayout=false;}}
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(scan);}}
 scan();new MutationObserver(schedule).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});mobile.addEventListener('change',schedule);
})();
