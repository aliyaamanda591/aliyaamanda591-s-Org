// Progressive disclosure only: retain original nodes, IDs and financial rendering.
(()=>{
 const dashboard=document.getElementById('dashboard'),overview=dashboard?.querySelector('.investment-overview');
 if(!overview)return;
 const dialog=document.createElement('dialog');dialog.className='portfolio-info-dialog';dialog.setAttribute('aria-labelledby','portfolioInfoHeading');
 dialog.innerHTML='<div class="portfolio-info-heading"><h2 id="portfolioInfoHeading">Info & perhitungan</h2><button type="button" aria-label="Tutup informasi">×</button></div><div class="portfolio-info-content"></div>';
 document.body.append(dialog);const content=dialog.querySelector('.portfolio-info-content');
 function section(title,nodes){nodes=nodes.filter(Boolean);if(!nodes.length)return;const box=document.createElement('section'),heading=document.createElement('h3');heading.textContent=title;box.append(heading,...nodes);content.append(box);}
 section('Tentang ringkasan', [overview.querySelector('.overview-heading p'),dashboard.querySelector('.trader-greeting p')]);
 const notice=document.getElementById('dashboardMarketNotice');section('Jadwal bursa',[notice]);
 section('Cara menghitung nilai aset',[...dashboard.querySelectorAll(':scope > .notice')]);
 section('Keterangan angka',[...overview.querySelectorAll('.overview-stat-caption,.overview-stat-bottom,.metric-note')]);
 const chartInfo=document.createElement('p');chartInfo.textContent='Komposisi aset mengikuti nilai sekarang. Arus transaksi menampilkan pembelian dan penjualan yang dicatat, bukan grafik pergerakan harga pasar. Harga dari penyedia dapat tertunda.';section('Membaca grafik',[chartInfo]);
 section('Sumber harga tambahan',[document.getElementById('sheetUrlInput')?.closest('.card')]);
 const button=document.createElement('button');button.type='button';button.className='btn soft portfolio-info-button';button.innerHTML='<span aria-hidden="true">ⓘ</span><span>Info & perhitungan</span>';button.addEventListener('click',()=>dialog.showModal());overview.querySelector('.toolbar')?.prepend(button);
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 const chip=document.createElement('button');chip.type='button';chip.className='market-status-chip';chip.addEventListener('click',()=>dialog.showModal());
 function market(){const badge=document.getElementById('dashboardMarketBadge');chip.textContent=badge?.textContent?.trim()||'Status bursa';chip.title=(document.getElementById('dashboardMarketTitle')?.textContent||'')+' · Lihat jadwal bursa';}
 market();dashboard.querySelector('.trader-greeting')?.append(chip);if(notice)new MutationObserver(market).observe(notice,{subtree:true,childList:true,characterData:true});
 const sale=overview.querySelector('.sale-summary');if(sale){const details=document.createElement('details');details.className='realized-details';const summary=document.createElement('summary'),label=document.createElement('span'),amount=document.createElement('strong');label.textContent='Profit / loss penjualan';summary.append(label,amount);sale.before(details);details.append(summary,sale);const original=document.getElementById('saleProfitLoss');function sync(){amount.textContent=original.textContent;amount.className=original.classList.contains('red')?'red':original.classList.contains('green')?'green':'';}sync();new MutationObserver(sync).observe(original,{childList:true,characterData:true,subtree:true});}
 dashboard.classList.add('dashboard-refined');
})();
