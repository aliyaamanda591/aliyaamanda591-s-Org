export const portfolioTransactionsAssetsHtml = `<section id="transactions" class="panel">
<div class="head">
<div>
<h2>Catatan transaksi</h2>
<p>Transaksi MASUK menambah modal. Gunakan tombol Jual pada kartu untuk mencatat penjualan beserta pengurangan jumlah unit.</p>
</div>
</div>
<div class="card" style="margin-bottom:14px">
<form id="txForm" class="formgrid">
<div class="field"><label>TANGGAL</label><input id="txDate" type="date" required>
</div>
<div class="field"><label>JENIS</label><select id="txType"><option>MASUK</option><option>KELUAR</option></select>
</div>
<div class="field"><label>KETERANGAN</label><span class="balance-input-shell"><input id="txDesc" required placeholder="Contoh: Beli BUMI 500 lembar"><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
<div class="field"><label>NOMINAL (RP)</label><span class="balance-input-shell"><input id="txAmount" type="number" min="1" required placeholder="Contoh: 105000"><span class="balance-input-mask" aria-hidden="true">••••••</span></span>
</div>
<div class="field"><label>ASET</label><select id="txAsset"><option>BMRI</option><option>BUMI</option><option>BTC INDODAX</option><option>BBCA</option><option>EMAS K24</option><option>EMAS K15</option><option>UMUM</option></select>
</div>
<div class="field"><label>PLATFORM</label><select id="txPlatform" required aria-describedby="txPlatformHint" onchange="platformChanged('txPlatform')"><option value="">Pilih platform yang kamu gunakan</option></select>
<div id="txPlatformCustomWrap" class="platform-custom" hidden><label for="txPlatformCustom">NAMA PLATFORM / TOKO</label><input id="txPlatformCustom" maxlength="100" placeholder="Tulis nama platform atau toko" disabled>
</div><button type="button" class="platform-other-button" id="txPlatformOtherButton" onclick="selectCustomPlatform('txPlatform')">＋ Platform lain</button><small class="platform-hint" id="txPlatformHint">Belum ada? Pilih “Tulis platform lain” untuk menambah nama sendiri.</small>
</div>
<div class="formactions"><button class="btn primary">＋ Simpan transaksi</button><button type="reset" class="btn soft">Kosongkan</button>
</div>
</form>
</div>
<div class="section">
<h3>Riwayat transaksi</h3>
<div class="toolbar"><button class="btn soft" onclick="exportCSV()">⇩ Ekspor CSV</button><button class="btn danger" onclick="clearTx()">Hapus semua</button>
</div>
</div>
<div class="tablewrap">
<table>
<thead>
<tr><th>Tanggal</th><th>Jenis</th><th>Keterangan</th><th>Nominal</th><th>Aset</th><th>Platform</th><th>Aksi</th>
</tr>
</thead>
<tbody id="txRows">
</tbody>
</table>
</div>
</section>
<section id="assets" class="panel">
<div class="head">
<div>
<h2>Pengaturan kepemilikan aset</h2>
<p>Modal tidak diedit di sini; modal otomatis berasal dari transaksi.</p>
</div>
<div class="toolbar"><button class="btn soft" onclick="openAssetPicker()">＋ Tambah aset baru</button><button class="btn primary refresh-btn" onclick="refreshPrices()">↻ Perbarui harga</button>
</div>
</div>
<div class="notice">Masukkan jumlah unit yang benar agar nilai pasar bisa dihitung otomatis. Saham dihitung per lembar, BTC dalam BTC, emas dalam gram. Modal pembelian diambil dari daftar transaksi, bukan dari kolom manual.</div>
<div class="assetgrid" id="assetSettings">
</div>
<details class="archived-holdings">
<summary>Kartu diarsipkan (<span id="archivedCount">0</span>)</summary>
<div class="card" id="archivedHoldingsList">
</div>
</details>
<p class="muted">Harga saham dapat tertunda dan bergantung pada ketersediaan sumber data. Harga emas spot bukan harga jual/buyback emas fisik toko atau Antam.</p>
</section>
`;
