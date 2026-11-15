// Keep original records, controls and event handlers; adapt only their presentation.
(()=>{
 const phone=window.matchMedia('(max-width:760px)');let scheduled=false;
 function update(){scheduled=false;
  document.querySelectorAll('.tablewrap table').forEach(table=>{
   const headings=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());if(!headings.length)return;
   table.classList.add('phone-table');table.setAttribute('role','table');
   const kind=headings.includes('Keterangan')?'transactions':headings.includes('Kepemilikan')?'portfolio':headings.includes('Aktivitas')?'activity':'general';table.dataset.phoneKind=kind;
   table.querySelectorAll('thead th').forEach(th=>{th.scope='col';th.setAttribute('role','columnheader');});
   table.querySelectorAll('tr').forEach(row=>row.setAttribute('role','row'));
   table.querySelectorAll('tbody tr').forEach(row=>{
    const cells=[...row.children];row.classList.toggle('phone-empty',cells.length===1&&cells[0].colSpan>1);
    cells.forEach((cell,index)=>{cell.dataset.label=headings[index]||'';cell.setAttribute('role','cell');});
   });
  });
  document.querySelectorAll('.asset .actions button').forEach(button=>{
   const full=button.dataset.fullCaption||button.textContent.trim();if(!button.dataset.fullCaption)button.dataset.fullCaption=full;
   const compact=/Tambah pembelian/.test(full)?'＋ Beli':/Atur jumlah/.test(full)?'Atur unit':/Arsipkan kartu/.test(full)?'Arsipkan':full;
   const caption=phone.matches?compact:full;if(button.textContent!==caption)button.textContent=caption;
   if(compact!==full)button.setAttribute('aria-label',full+' '+(button.closest('.asset')?.querySelector('h3')?.textContent||''));
  });
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
 update();new MutationObserver(schedule).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});phone.addEventListener('change',schedule);
})();
