/* This script only enhances the isolated public demo; it never creates an account. */
(()=>{
 if(!cloudBoot?.demo)return;
 const notice=document.createElement('aside');notice.className='demo-notice';notice.setAttribute('aria-label','Mode demo Sidaps');notice.innerHTML='<div><b>Ruang coba Sidaps</b><span>Data contoh · bebas mencoba · hilang saat dimuat ulang.</span></div><div class="demo-notice-actions"><button type="button" id="resetDemo">↻ Ulang demo</button><a href="/?login=1">Buat akun pribadi ↗</a></div>';
 document.querySelector('main')?.prepend(notice);
 document.getElementById('resetDemo').onclick=()=>{if(confirm('Mulai ulang data contoh? Perubahan pada demo ini akan direset.'))location.href='/?demo=1';};
 document.querySelectorAll('.header-logout').forEach(el=>el.textContent='Keluar demo');
 const security=document.getElementById('dev-security');if(security){security.innerHTML='<div class="dev-view-heading"><h3>Akun pribadi, setelah kamu siap.</h3><p>Demo tidak memiliki email atau kata sandi. Buat akunmu sendiri untuk menyimpan portofolio dan mengaksesnya dari perangkat lain.</p><a class="btn primary" href="/?login=1">Buat akun pribadi ↗</a></div>';}
 const importer=document.getElementById('devImport');if(importer)importer.closest('label').classList.add('demo-unavailable');
 const sheet=document.getElementById('sheetUrlInput');if(sheet)sheet.closest('.card')?.classList.add('demo-unavailable');
 const loginNote=document.getElementById('profileLoginNote');if(loginNote)loginNote.textContent='Profil percobaan · bukan akun terdaftar.';
 const adminRoles=document.getElementById('adminRoles');if(adminRoles)adminRoles.textContent='Demo · Tamu';
 // Prevent private backup imports into a session that will be discarded.
 document.querySelectorAll('.muted').forEach(el=>{if(el.textContent.includes('Data disimpan di akunmu dan dapat diakses dari perangkat lain.'))el.textContent='Data ini hanya contoh. Perubahan demo tidak disimpan; buat akun pribadi untuk menyimpan portofoliomu.';});
})();
