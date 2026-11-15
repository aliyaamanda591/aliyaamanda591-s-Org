export const portfolioShellDashboardHtml = `<section id="appBoot" role="status" aria-live="polite"><span class="boot-dot" aria-hidden="true"></span><span>Menyiapkan portofoliomu…</span>
<div class="boot-lines" aria-hidden="true"><i></i><i></i><i></i>
</div>
</section>
<main>
<div id="cloudSyncStatus" class="cloud-sync" role="status" aria-live="polite">
</div>
<p class="balance-privacy-status" id="balancePrivacyStatus" role="status" aria-live="polite">
</p>
<nav class="tabs" aria-label="Navigasi utama"><button class="tab active" data-tab="dashboard">Dashboard</button><button class="tab" data-tab="transactions">Transaksi</button><button class="tab" data-tab="assets">Portofolio</button><button class="tab" data-tab="developer" id="devTab" style="display:none">⚙ &nbsp;Developer</button>
</nav>
<section id="dashboard" class="panel active">
<aside id="dashboardMarketNotice" class="dashboard-market-notice" role="status" aria-live="polite" aria-atomic="true"><span id="dashboardMarketBadge" class="dashboard-market-badge"></span>
<h3 id="dashboardMarketTitle">
</h3>
<p id="dashboardMarketMessage">
</p><small>Jadwal pasar reguler BEI · WIB · Kripto tetap buka 24 jam</small>
</aside>

<div class="portfolio-banner">
<div><span class="eyebrow">PORTOFOLIO PRIBADI ANDA</span>
<h2>Setiap langkah, aset masa depan.</h2>
<p>Pantau kepemilikan, catat pembelian, dan lihat perjalanan investasimu.</p>
</div>
<div class="market-art" aria-hidden="true"><i style="--h:22px;--delay:0s"></i><i style="--h:35px;--delay:-.4s"></i><i style="--h:28px;--delay:-.8s"></i><i style="--h:43px;--delay:-1.2s"></i><i style="--h:38px;--delay:-1.6s"></i><i style="--h:54px;--delay:-2s"></i>
</div>
</div>
<div class="investment-overview">
<div class="head overview-heading">
<div><span class="overview-eyebrow">GAMBARAN PORTOFOLIO</span>
<h2>Ringkasan investasi</h2>
<p>Modal aset tersisa dan profit/loss dihitung dari pembelian serta penjualan yang dicatat.</p>
</div>
<div class="toolbar"><button class="btn soft" onclick="openAssetPicker()">＋ Tambah aset baru</button><button class="btn primary refresh-btn" onclick="refreshPrices()">↻ Perbarui harga</button>
</div>
</div>
<div class="grid overview-grid">
<div class="card overview-stat capital-stat">
<div class="overview-stat-top"><span class="label">MODAL ASET TERSISA</span><span class="overview-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
<path d="M4 7h15a1 1 0 0 1 1 1v11H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13v3M20 11h-5v5h5"/><circle cx="16.5" cy="13.5" r=".7" fill="currentColor" stroke="none"/></svg></span>
</div>
<div class="metric" id="totalCapital">Rp0</div>
<div class="overview-stat-caption">Modal yang masih berada di aset</div>
<div class="overview-stat-bottom"><span class="overview-mini-dot"></span> Rupiah Indonesia <span class="overview-currency">IDR</span>
</div>
</div>
<div class="card overview-stat value-stat">
<div class="overview-stat-top"><span class="label">NILAI SEKARANG</span><span class="overview-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
<path d="m3 16 5-5 4 3 8-9M15 5h5v5M3 21h18"/></svg></span>
</div>
<div class="metric" id="currentValue">Rp0</div>
<div class="overview-stat-caption">Estimasi nilai dari harga yang tersedia</div>
<div class="overview-stat-bottom" id="overviewActiveAssets">0 aset aktif</div>
</div>
<div class="card overview-stat profit-stat" id="overviewProfitCard">
<div class="overview-stat-top"><span class="label">PROFIT / LOSS ASET</span><span class="overview-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
<path d="M12 3v18M17 7H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6"/></svg></span>
</div>
<div class="metric" id="profitLoss">Rp0</div>
<div id="profitBreakdown" class="metric-note">
</div>
<div class="overview-stat-bottom" id="overviewProfitState">Ringkasan hasil investasi</div>
</div>
<div class="card overview-stat activity-stat">
<div class="overview-stat-top"><span class="label">JUMLAH TRANSAKSI</span><span class="overview-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/>
<path d="M9 7h6M9 11h6M9 15h3"/></svg></span>
</div>
<div class="metric" id="transactionCount">0</div>
<div class="overview-stat-caption">Seluruh riwayat yang sudah dicatat</div>
<div class="overview-stat-bottom overview-flow-counts"><span id="overviewInCount">0 masuk</span><span id="overviewOutCount">0 keluar</span>
</div>
</div>
</div>
<section class="sale-summary" aria-labelledby="saleSummaryHeading">
<div class="sale-summary-result"><span class="label" id="saleSummaryHeading">PROFIT / LOSS PENJUALAN</span>
<div class="metric" id="saleProfitLoss">Rp0</div>
<p class="sale-summary-state" id="saleProfitState">Belum ada penjualan</p>
</div>
<dl class="sale-summary-details">
<div><dt>Hasil bersih penjualan</dt><dd id="saleProceeds">Rp0</dd>
</div>
<div><dt>Modal aset yang dijual</dt><dd id="saleCostBasis">Rp0</dd>
</div></dl>
<div class="sale-summary-help">
<p>Hasil bersih penjualan − modal aset yang dijual.</p><small id="saleSummaryCount">0 transaksi penjualan</small><small>Terpisah dari profit/loss aset yang masih dimiliki. Catat penjualan melalui tombol Jual.</small>
</div>
</section>
<div class="overview-composition">
<div class="overview-composition-heading"><span>Komposisi nilai aset</span><small id="overviewCompositionNote">Berdasarkan nilai sekarang</small>
</div>
<div class="overview-allocation-bar" id="overviewAllocation" role="img" aria-label="Komposisi nilai aset">
</div>
<div class="overview-allocation-legend" id="overviewAllocationLegend">
</div>
</div>
</div>
<div class="notice"><b>Perhitungan diperbaiki:</b> modal aset tersisa dihitung dari transaksi. Penjualan melalui tombol Jual mengurangi kepemilikan dan modal sesuai porsi unit yang dijual. Nilai sekarang memakai harga pasar × jumlah kepemilikan jika jumlahnya sudah diisi. Jika belum, website menampilkan nilai terakhir dari catatan kamu dan menandainya sebagai manual.</div>
<div class="card" style="margin-bottom:12px">
<div class="label">HARGA SAHAM OTOMATIS · GOOGLE SHEETS OPSIONAL</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><input id="sheetUrlInput" placeholder="Tempel link Google Sheets kamu di sini" style="flex:1;min-width:220px"><button class="btn primary" onclick="saveSheetUrl()">Simpan &amp; ambil harga</button>
</div>
<p class="muted" style="margin:8px 0 0">Saham lama dan baru otomatis dicari berdasarkan kode BEI, termasuk TLKM. Google Sheets hanya sumber cadangan; tidak wajib membuat rumus satu per satu. Harga dari penyedia dapat tertunda.<details class="stock-formula-details">
<summary>Rumus cadangan untuk seluruh saham</summary>
<p>Jika ingin memakai Google Sheets, buat tab <b>HARGA</b> dan tempel daftar di bawah ke sel A1. Daftar mengikuti pilihan saham dan aset yang sudah ditambahkan. Sheet harus dapat dibaca melalui link.</p><textarea id="stockFormulaText" readonly aria-label="Kode dan rumus harga saham untuk Google Sheets" style="min-height:150px"></textarea>
<p id="stockFormulaStatus" role="status">
</p><button type="button" class="btn soft" onclick="copyStockFormulas()">Salin kode &amp; rumus</button>
</details>
</p>
</div>
<div class="section">
<h3>Ringkasan per aset</h3>
<div class="status"><span class="dot" id="priceDot"></span><span id="priceStatus" class="quote-status" role="status" aria-live="polite">Harga belum diperbarui</span>
</div>
</div>
<p class="idx-market-summary" id="idxMarketStatus" role="status">
</p>
<div class="assetgrid" id="dashboardAssets">
</div>
<div class="section">
<h3>Riwayat transaksi</h3>
<div class="scroll-tools"><button class="btn soft" id="scrollToggle" onclick="toggleTransactionScroll()" aria-pressed="true">Ⅱ Jeda gulir otomatis</button><button class="btn soft" onclick="showTab('transactions')">Kelola transaksi →</button>
</div>
</div>
<div class="tablewrap scroll-transactions" id="transactionViewport" tabindex="0" aria-label="Semua riwayat transaksi. Gulir untuk melihat transaksi lainnya.">
<table>
<thead>
<tr><th>Tanggal</th><th>Jenis</th><th>Keterangan</th><th>Nominal</th><th>Aset</th><th>Platform</th>
</tr>
</thead>
<tbody id="recentRows">
</tbody>
</table>
</div>
<p class="scroll-hint">Seluruh transaksi tampil di sini. Gulir ke bawah; gerakan otomatis berhenti saat disentuh, diarahkan mouse, atau difokuskan.</p>
<div class="section">
<h3>Portofolio terbaru</h3><button class="btn soft" onclick="openAssetPicker()">＋ Tambah aset baru</button>
</div>
<div class="tablewrap portfolio-table">
<table>
<thead>
<tr><th>Aset</th><th>Kepemilikan</th><th>Modal</th><th>Nilai sekarang</th><th>Profit / loss</th><th>Aksi</th>
</tr>
</thead>
<tbody id="portfolioRows">
</tbody>
</table>
</div>
</section>
`;
