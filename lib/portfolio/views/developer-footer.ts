export const portfolioDeveloperFooterHtml = `<section id="developer" class="panel">
<div class="admin-hero">
<div class="admin-profile"><button type="button" class="admin-avatar profile-edit-button" id="adminAvatar" onclick="openProfileEditor()" aria-label="Ubah foto profil" title="Ubah foto profil">D</button>
<div><span class="admin-eyebrow">PUSAT KENDALI PORTOFOLIO</span>
<h2 id="adminUsername">Profil pengguna</h2>
<div class="admin-roles" id="adminRoles">
</div>
</div>
</div><button type="button" class="admin-edit-profile" onclick="openProfileEditor()">Edit profil</button>
<div class="admin-account"><span class="local-account-dot"></span><span>Akun online<small>Data tersimpan per pengguna</small></span>
</div>
</div>
<div class="admin-meta"><span id="adminSince"></span><span id="adminLastLogin"></span>
</div>
<div class="grid admin-stats" id="devStats">
</div>
<div class="dev-workspace">
<aside class="dev-sidebar">
<div class="dev-nav-label">PENGATURAN</div>
<nav class="dev-navigation" aria-label="Pengaturan Admin dan Developer"><button type="button" class="dev-nav-btn active" data-dev-view="overview" onclick="showDevView('overview')"><span aria-hidden="true">▦</span> Ringkasan &amp; data</button><button type="button" class="dev-nav-btn" data-dev-view="security" onclick="showDevView('security')"><span aria-hidden="true">◇</span> Keamanan akun</button><button type="button" class="dev-nav-btn" data-dev-view="activity" onclick="showDevView('activity')"><span aria-hidden="true">◷</span> Riwayat aktivitas</button><button type="button" class="dev-nav-btn" data-dev-view="members" data-owner-only onclick="showDevView('members')"><span aria-hidden="true">♙</span> Daftar anggota</button><button type="button" class="dev-nav-btn" data-dev-view="advanced" data-owner-only onclick="showDevView('advanced')"><span aria-hidden="true">⌘</span> Pengaturan lanjutan</button>
</nav>
<div class="dev-sidebar-note">Backup berkala membantu menjaga catatan investasimu tetap aman.</div>
</aside>
<div class="dev-content">
<div class="dev-view active" id="dev-overview">
<div data-owner-only class="card cloud-owner-note"><b id="cloudAccountCount">Akun pemilik situs</b>
<p>Untuk memindahkan portofolio pribadimu, unduh backup JSON dari web lama, lalu impor lewat menu di bawah. Portofolio lama tidak disertakan dalam halaman publik.</p>
</div>
<div class="dev-view-heading">
<h3>Ringkasan &amp; data</h3>
<p>Kelola backup, pantau sumber harga, dan pulihkan kartu yang diarsipkan.</p>
</div>
<div class="section">
<h3>Backup &amp; pulihkan data</h3>
</div>
<div class="card">
<div class="toolbar"><button class="btn primary" onclick="devExport()">⇩ Unduh backup (JSON)</button><label class="btn soft" style="display:inline-flex;align-items:center;gap:6px">⇧ Impor backup<input type="file" id="devImport" accept=".json,application/json" hidden></label>
</div>
<p class="muted" style="margin:10px 0 0">Data disimpan di akunmu dan dapat diakses dari perangkat lain. Unduh backup untuk salinan pribadi.</p>
</div>
<p class="backup-time" id="devBackupTime">
</p>
<div class="section">
<h3>Status sumber harga</h3>
<div class="toolbar"><button class="btn soft" onclick="devClearCache()">↻ Ambil harga ulang</button>
</div>
</div>
<div class="card source-health">
<div id="devSourceSummary" class="muted">
</div>
<details class="dev-technical">
<summary>Lihat rincian sumber harga</summary>
<p class="balance-editor-note">Rincian angka sumber harga disembunyikan selama mode privasi aktif.</p>
<pre class="balance-sensitive-editor" id="devPrices">
</pre>
</details>
</div>
<div class="section">
<h3>Kartu yang diarsipkan</h3>
</div>
<div class="card" id="archivedAdminList">
</div>
</div>
<div class="dev-view" id="dev-security">
<div class="dev-view-heading">
<h3>Keamanan akun</h3>
<p>Kelola identitas login, sandi, dan kode pemulihan di satu tempat.</p>
</div>
<div class="section">
<h3>Keamanan akun</h3>
</div>
<div class="card">
<p class="muted" style="margin:0 0 12px"><b>Identitas akun online.</b> Data portofolio terpisah untuk setiap akun.</p>
<div class="cloud-managed-login">
<p id="cloudPasswordIntro">
</p>
<form id="cloudPasswordForm" class="formgrid">
<div class="field full-field" id="cloudOldPasswordField"><label for="cloudOldPassword">PASSWORD SAAT INI</label>
<div class="password-control"><input id="cloudOldPassword" type="password" required minlength="8" maxlength="72" autocomplete="current-password"><button type="button" class="password-toggle" data-password-target="cloudOldPassword" aria-controls="cloudOldPassword" aria-label="Tampilkan sandi" aria-pressed="false" onclick="togglePasswordVisibility(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>
<path class="eye-slash" d="m3 3 18 18"/></svg></button>
</div>
</div>
<div class="field"><label for="cloudNewPassword">PASSWORD BARU (MINIMAL 8 KARAKTER)</label>
<div class="password-control"><input id="cloudNewPassword" type="password" required minlength="8" maxlength="72" autocomplete="new-password"><button type="button" class="password-toggle" data-password-target="cloudNewPassword" aria-controls="cloudNewPassword" aria-label="Tampilkan sandi" aria-pressed="false" onclick="togglePasswordVisibility(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>
<path class="eye-slash" d="m3 3 18 18"/></svg></button>
</div>
</div>
<div class="field"><label for="cloudConfirmPassword">ULANGI PASSWORD BARU</label>
<div class="password-control"><input id="cloudConfirmPassword" type="password" required minlength="8" maxlength="72" autocomplete="new-password"><button type="button" class="password-toggle" data-password-target="cloudConfirmPassword" aria-controls="cloudConfirmPassword" aria-label="Tampilkan sandi" aria-pressed="false" onclick="togglePasswordVisibility(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>
<path class="eye-slash" d="m3 3 18 18"/></svg></button>
</div>
</div>
<p class="profile-message full-field" id="cloudPasswordMessage" role="status">
</p>
<div class="formactions"><button type="submit" class="btn primary" id="cloudPasswordSave">Simpan password</button><button type="button" class="btn soft" onclick="openProfileEditor()">Ubah profil</button>
</div>
</form>
</div>
</div>
</div>
<div class="dev-view" id="dev-activity">
<div class="dev-view-heading">
<h3>Riwayat aktivitas</h3>
<p>Pantau aktivitas akun melalui riwayat yang ringkas.</p>
</div>
<div class="section">
<h3>Log aktivitas</h3><span class="log-count" id="logCount">0 catatan</span>
</div>
<p class="log-help">Maksimal 60 aktivitas terbaru disimpan. Catatan terlama otomatis diganti saat penuh; tampilan dibagi 10 catatan per halaman.</p>
<div class="tablewrap log-viewport" id="logViewport" tabindex="0" aria-label="Riwayat aktivitas">
<table style="min-width:420px">
<thead>
<tr><th>Waktu</th><th>Aktivitas</th>
</tr>
</thead>
<tbody id="devLogs">
</tbody>
</table>
</div>
<div class="log-pagination">
<p id="logRange" aria-live="polite">Belum ada aktivitas</p>
<div class="toolbar"><button type="button" class="btn soft" id="logPrev" onclick="changeLogPage(-1)">← Sebelumnya</button><span class="log-page-info" id="logPageInfo">1 / 1</span><button type="button" class="btn soft" id="logNext" onclick="changeLogPage(1)">Berikutnya →</button>
</div>
</div>
</div>
<div class="dev-view" id="dev-members" data-owner-only>
<div class="dev-view-heading">
<h3>Daftar anggota</h3>
<p>Informasi pendaftaran dan bantuan akun. Transaksi serta portofolio masing-masing pengguna tetap pribadi.</p>
</div>
<div id="accountDirectoryRoot">
<div class="card">
<h3>Daftar anggota</h3>
<p class="muted">Daftar pengguna hanya tersedia di website yang dihosting. Masuk memakai akun pemilik situs agar menu ini dapat memuat data pendaftaran.</p><a class="btn primary directory-link" href="https://catatan-investasi-denny.fruityhen1.chatgpt.site/" target="_blank" rel="noopener">Buka website online</a>
</div>
</div>
</div>
<div class="dev-view" id="dev-advanced" data-owner-only>
<div class="dev-view-heading">
<h3>Pengaturan lanjutan</h3>
<p>Editor data dan pengaturan reset dipisahkan dari penggunaan sehari-hari.</p>
</div>
<div class="section">
<h3>Editor data mentah (JSON)</h3>
</div>
<div class="card">
<p class="balance-editor-note">Klik tombol mata di header untuk menampilkan data nominal.</p><textarea class="balance-sensitive-editor" id="devJson" spellcheck="false"></textarea>
<div class="toolbar" style="margin-top:10px"><button class="btn primary" onclick="devApply()">Terapkan perubahan</button><button class="btn soft" onclick="renderDev()">Muat ulang</button>
</div>
</div>
<div class="dev-danger-area">
<div class="section">
<h3>Zona berbahaya</h3>
</div>
<div class="card">
<div class="toolbar"><button class="btn danger" onclick="devResetData()">Reset data ke bawaan</button>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
</main>
<div class="modalback profile-modal" id="profileModal" role="dialog" aria-modal="true" aria-labelledby="profileHeading">
<div class="modal profile-dialog">
<div class="profile-dialog-heading"><span class="profile-eyebrow">PERSONALISASI AKUN</span>
<h3 id="profileHeading">Profil kamu</h3>
<p>Gunakan nama dan foto yang membuat ruang investasimu terasa lebih personal.</p>
</div>
<form id="profileForm">
<div class="profile-photo-section">
<div id="profilePhotoPreview" class="profile-photo-preview">
</div>
<div class="profile-photo-controls"><label class="btn primary profile-upload">Pilih foto<input id="profilePhotoInput" type="file" accept="image/jpeg,image/png,image/webp" hidden></label><button type="button" class="btn soft" id="profileRemovePhoto" onclick="removeProfilePhoto()">Hapus foto</button><button type="button" class="btn soft" id="profileGooglePhoto" onclick="useGoogleProfilePhoto()" hidden>Gunakan foto Google</button>
<p id="profilePhotoSource" role="status">
</p>
<p>JPG, PNG, atau WebP · maksimal 10 MB.<br>Foto dipotong persegi dari bagian tengah.</p>
</div>
</div>
<div class="field"><label for="profileDisplayName">NAMA TAMPILAN</label><input id="profileDisplayName" type="text" maxlength="60" autocomplete="nickname" placeholder="Nama yang ingin ditampilkan">
</div>
<p class="profile-login-note" id="profileLoginNote">
</p>
<div class="profile-local-note"><span aria-hidden="true">◇</span><span>Foto disimpan bersama profil akunmu. Foto tidak dikirim ke layanan harga saham.</span>
</div>
<p id="profileMessage" class="profile-message" role="status" aria-live="polite">
</p>
<div class="modalactions"><button type="button" class="btn soft" onclick="closeProfileEditor()">Batal</button><button type="submit" class="btn primary" id="profileSaveButton">Simpan profil</button>
</div>
</form>
</div>
</div>
<div class="modalback" id="modal">
<div class="modal">
<h3 id="modalHeading">Atur kepemilikan</h3>
<p>Masukkan jumlah yang kamu miliki. Total modal akan tetap dihitung dari transaksi pembelian.</p>
<form id="holdingForm">
<div class="formgrid">
<div class="field"><label>JUMLAH KEPEMILIKAN</label><span class="balance-input-shell"><input id="holdingQty" type="number" min="0" step="any" required><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
<div class="field"><label>SATUAN</label><input id="holdingUnit" disabled>
</div>
<div class="field" style="grid-column:1/-1"><label id="holdingPriceLabel">HARGA CADANGAN / MANUAL PER SATUAN (RP, OPSIONAL)</label><span class="balance-input-shell"><input id="holdingPrice" type="number" min="0" step="any" placeholder="Contoh: 3630"><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
<p class="balance-sensitive-editor" id="holdingPriceHint" class="muted" style="font-size:11px;line-height:1.7;margin:3px 0 0">
</p>
</div>
</div>
<div class="modalactions"><button type="button" class="btn soft" onclick="closeModal()">Batal</button><button class="btn primary">Simpan</button>
</div>
</form>
</div>
</div>
<div class="modalback" id="purchaseModal" role="dialog" aria-modal="true" aria-labelledby="purchaseHeading">
<div class="modal">
<h3 id="purchaseHeading">Tambah pembelian</h3>
<p>Catat nominal pembelian dan jumlah unit. Keduanya otomatis masuk ke transaksi dan kepemilikan.</p>
<form id="purchaseForm">
<div class="formgrid">
<div class="field"><label for="buyDate">TANGGAL</label><input id="buyDate" type="date" required>
</div>
<div class="field"><label for="buyQty">JUMLAH UNIT <span id="buyUnit"></span></label><span class="balance-input-shell"><input id="buyQty" type="number" min="0.00000001" step="any" required><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
<div class="field"><label for="buyAmount">TOTAL PEMBELIAN TERMASUK BIAYA (RP)</label><span class="balance-input-shell"><input id="buyAmount" type="number" min="1" step="any" required><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
<div class="field"><label for="buyPlatform">PLATFORM</label><select id="buyPlatform" required aria-describedby="buyPlatformHint" onchange="platformChanged('buyPlatform')"><option value="">Pilih platform yang kamu gunakan</option></select>
<div id="buyPlatformCustomWrap" class="platform-custom" hidden><label for="buyPlatformCustom">NAMA PLATFORM / TOKO</label><input id="buyPlatformCustom" maxlength="100" placeholder="Tulis nama platform atau toko" disabled>
</div><button type="button" class="platform-other-button" id="buyPlatformOtherButton" onclick="selectCustomPlatform('buyPlatform')">＋ Platform lain</button><small class="platform-hint" id="buyPlatformHint">Belum ada? Pilih “Tulis platform lain” untuk menambah nama sendiri.</small>
</div>
<div class="field full-field"><label for="buyDesc">KETERANGAN (OPSIONAL)</label><span class="balance-input-shell"><input id="buyDesc" maxlength="200" placeholder="Contoh: Pembelian rutin bulanan"><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
</div>
<div id="purchasePreview" class="purchase-preview" aria-live="polite">
</div>
<div class="modalactions"><button type="button" class="btn soft" onclick="closePurchase()">Batal</button><button class="btn primary">Simpan pembelian</button>
</div>
</form>
</div>
</div>
<div class="modalback" id="saleModal" role="dialog" aria-modal="true" aria-labelledby="saleHeading">
<div class="modal sale-dialog">
<h3 id="saleHeading">Catat penjualan</h3>
<p>Catatan penjualan ini mengurangi kepemilikan dan menyimpan hasilnya dalam riwayat transaksi.</p>
<form id="saleForm">
<div class="formgrid">
<div class="field"><label for="sellDate">TANGGAL PENJUALAN</label><input id="sellDate" type="date" required>
</div>
<div class="field"><label for="sellQty" id="sellQtyLabel">JUMLAH UNIT DIJUAL</label><span class="balance-input-shell"><input id="sellQty" type="number" min="0.00000001" step="any" required><span class="balance-input-mask" aria-hidden="true">••••••</span></span><button type="button" class="sell-all" onclick="fillFullSale()">Jual seluruh kepemilikan</button>
</div>
<div class="field"><label for="sellAmount">HASIL BERSIH SETELAH BIAYA (RP)</label><span class="balance-input-shell"><input id="sellAmount" type="number" min="1" step="any" required><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
<div class="field"><label for="sellPlatform">PLATFORM</label><select id="sellPlatform" required aria-describedby="sellPlatformHint" onchange="platformChanged('sellPlatform')"><option value="">Pilih platform yang kamu gunakan</option></select>
<div id="sellPlatformCustomWrap" class="platform-custom" hidden><label for="sellPlatformCustom">NAMA PLATFORM / TOKO</label><input id="sellPlatformCustom" maxlength="100" placeholder="Tulis nama platform atau toko" disabled>
</div><button type="button" class="platform-other-button" id="sellPlatformOtherButton" onclick="selectCustomPlatform('sellPlatform')">＋ Platform lain</button><small class="platform-hint" id="sellPlatformHint">Belum ada? Pilih “Tulis platform lain” untuk menambah nama sendiri.</small>
</div>
<div class="field full-field"><label for="sellDesc">KETERANGAN (OPSIONAL)</label><span class="balance-input-shell"><input id="sellDesc" maxlength="200" placeholder="Contoh: Jual sebagian saham"><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
</div>
<div class="sale-preview" id="salePreview" aria-live="polite">
</div>
<p class="sale-method">Modal yang dilepas dihitung proporsional dari modal tersisa dan jumlah kepemilikan saat pencatatan. Hasil penjualan tetap ada di riwayat meskipun kartu diarsipkan.</p><label class="sale-archive"><input type="checkbox" id="sellArchive"> Arsipkan kartu jika seluruh kepemilikan sudah terjual</label>
<p class="authmsg" id="saleError" role="alert">
</p>
<div class="modalactions"><button type="button" class="btn soft" onclick="closeSale()">Batal</button><button class="btn primary">Simpan penjualan</button>
</div>
</form>
</div>
</div>

<div class="modalback" id="assetPickerModal" role="dialog" aria-modal="true" aria-labelledby="assetPickerHeading">
<div class="modal">
<h3 id="assetPickerHeading">Tambah aset ke portofolio</h3>
<p>Pilih sendiri saham, kripto, atau emas untuk portofoliomu. Setiap aset baru dimulai dari 0 unit dan Rp0 modal.</p>
<form id="assetPickerForm">
<div class="field asset-picker"><label for="assetSearch">CARI SAHAM, KRIPTO, ATAU EMAS</label>
<div class="asset-search-tools"><input id="assetSearch" type="search" placeholder="Cari BBCA, Solana, emas, atau nama perusahaan…" oninput="renderAssetCatalog()" autocomplete="off" autocapitalize="off" spellcheck="false"><select id="assetKindFilter" aria-label="Jenis aset" onchange="renderAssetCatalog()"><option value="all">Semua aset</option><option value="stock">Saham BEI</option><option value="crypto">Kripto</option><option value="gold">Emas</option></select>
</div>
<p id="assetCatalogCount" class="catalog-count" role="status">
</p><select id="assetChoice" hidden aria-hidden="true" tabindex="-1"></select>
<div class="asset-catalog" id="assetCatalog" tabindex="0" role="group" aria-label="Daftar saham, kripto, dan emas">
</div>
<div id="assetSelectionPreview" class="asset-selection" aria-live="polite" hidden>
</div>
</div>
<div class="field"><label for="customTicker">ATAU KODE SAHAM LAIN</label><input id="customTicker" maxlength="8" pattern="[A-Za-z]{4}" placeholder="Contoh: ANTM">
</div>
<div class="field" style="margin-top:10px"><label for="customCompany">NAMA PERUSAHAAN (OPSIONAL)</label><input id="customCompany" maxlength="120">
</div>
<details class="asset-source-info">
<summary>Sumber harga &amp; platform</summary>
<p class="muted">Saham untuk catatan Growin, Stockbit, atau sekuritas lain memakai sumber harga BEI. Kripto memakai pasangan IDR Indodax dengan cadangan CoinGecko yang ditandai jelas, diperiksa setiap 5 menit. Platform transaksi dipilih saat mencatat pembelian. Harga terakhir tetap disimpan jika sumber sedang bermasalah.</p>
</details>
<div class="modalactions"><button type="button" class="btn soft" onclick="closeAssetPicker()">Batal</button><button class="btn primary">Tambah ke portofolio</button>
</div>
</form>
</div>
</div>
<footer>Sidaps Portfolio · Backup lengkap melalui menu Developer · <a href="https://www.coingecko.com/en/api" target="_blank" rel="noopener">Harga kripto: Indodax · cadangan CoinGecko</a>.</footer>
`;
