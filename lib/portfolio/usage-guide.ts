export const portfolioUsageGuideHtml = `<dialog id="usageGuide" class="usage-guide" aria-labelledby="usageGuideTitle" aria-describedby="usageGuideIntro">
<div class="usage-guide-head">
<div><span class="overview-eyebrow">MULAI DARI SINI</span>
<h2 id="usageGuideTitle">Panduan Sidaps Portfolio</h2>
<p id="usageGuideIntro">Catat aset pilihanmu, lalu pantau perkembangannya.</p>
</div><button type="button" class="usage-guide-close" onclick="closeUsageGuide()" aria-label="Tutup panduan" autofocus>×</button>
</div>
<div class="usage-guide-body">
<section class="usage-tour" aria-labelledby="usageTourTitle">
<div class="tour-top"><span>DEMO KLIK · DATA CONTOH</span><span id="usageTourCounter">1 / 6</span>
</div>
<div class="tour-screen" id="usageTourScreen">
</div>
<div class="tour-caption" aria-live="polite">
<h3 id="usageTourTitle">
</h3>
<p id="usageTourCaption">
</p>
</div>
<progress id="usageTourProgress" max="6" value="1" aria-label="Kemajuan panduan">
</progress>
<div class="tour-controls"><button type="button" class="btn soft" onclick="moveUsageTour(-1)" aria-label="Langkah sebelumnya">←</button><button type="button" class="btn primary" id="usageTourPlay" onclick="toggleUsageTour()">▶ Putar demo</button><button type="button" class="btn soft" onclick="moveUsageTour(1)" aria-label="Langkah berikutnya">→</button><button type="button" class="usage-guide-link" onclick="usageTourStep=0;playUsageTour()">↻ Ulang</button>
</div><small class="tour-disclaimer">Ini simulasi tampilan, bukan rekaman akunmu. Tidak membuat aset atau transaksi sungguhan. Tanpa suara.</small>
</section>
<h3 class="guide-reading-title">Panduan lengkap</h3>
<div class="usage-guide-notice">Sidaps adalah pencatat investasi. Menambah aset atau mencatat transaksi di sini tidak membeli atau menjual aset di platform investasi kamu.</div>
<ol class="usage-guide-steps">
<li>
<h3>Tambahkan aset pilihanmu</h3>
<p>Di <b>Dashboard</b> atau <b>Portofolio</b>, klik <b>＋ Tambah aset baru</b>. Cari kode atau nama, misalnya BBCA, Solana, atau emas. Klik asetnya, lalu <b>Tambah ke portofolio</b>.</p><small>Kartu baru dimulai dari 0 unit dan Rp0 modal. Akun lain mempunyai daftar asetnya sendiri.</small>
</li>
<li>
<h3>Catat pembelian pertama</h3>
<p>Pada kartu aset, klik <b>＋ Tambah pembelian</b>. Isi tanggal, jumlah unit, <b>total nominal pembelian</b>, dan platform atau toko. Periksa kembali lalu simpan.</p>
<div class="usage-guide-example">Contoh: beli 1 lot saham dengan total Rp500.000 → jumlah <b>100 lembar</b>, nominal <b>500000</b>. Untuk kripto isi jumlah koin, untuk emas isi gram.</div><small>Gunakan alur Tambah pembelian agar modal dan jumlah unit tercatat bersama. Jangan mencatat pembelian yang sama dua kali di Catatan transaksi.</small>
</li>
<li>
<h3>Baca ringkasan investasimu</h3>
<p><b>Modal aset tersisa</b> adalah modal yang masih berada pada aset. <b>Nilai sekarang</b> memakai jumlah unit dan harga yang tersedia. <b>Profit/loss aset</b> adalah nilai sekarang dikurangi modal tersisa.</p><small>Hasil penjualan ditampilkan terpisah. Harga diperiksa tiap 5 menit, dapat tertunda, dan mengikuti ketersediaan sumber. Saat bursa tutup, saham memakai harga terakhir. Periksa label sumber dan waktunya.</small>
</li>
<li>
<h3>Catat penjualan dan arsipkan</h3>
<p>Setelah menjual melalui platformmu, klik <b>Jual</b> pada kartu. Isi jumlah unit yang dijual, total hasil penjualan, tanggal, dan platform, lalu simpan.</p><small>Kepemilikan dan modal tersisa berkurang sesuai penjualan. Jika jumlah unit sudah 0, kartu dapat diarsipkan tanpa menghapus riwayat transaksi.</small>
</li>
<li>
<h3>Atur tampilan dan jaga privasi</h3>
<p>Gunakan tombol <b>mata / Saldo</b> untuk menyembunyikan atau menampilkan nominal. Buka <b>Portofolio</b> untuk melihat dan mengatur kartu aset.</p><small>Atur jumlah dipakai untuk memperbaiki data kepemilikan. Untuk pembelian atau penjualan baru, gunakan tombol Beli/Jual agar riwayatnya ikut tercatat.</small>
</li>
<li>
<h3>Simpan salinan data</h3>
<p>Buka <b>Akun &amp; data → Ringkasan &amp; data → Unduh backup (JSON)</b>. Untuk akun pemilik, menu akun dapat bertuliskan <b>Admin &amp; Developer</b>.</p><small>Simpan file backup di tempat pribadi. Gunakan Impor backup untuk pemulihan; periksa akun tujuan karena impor mengganti data portofolio akun tersebut setelah konfirmasi.</small>
</li>
</ol>
</div>
<div class="usage-guide-footer"><button type="button" class="btn soft" onclick="closeUsageGuide()">Sudah mengerti</button><button type="button" class="btn primary" onclick="closeUsageGuide();openAssetPicker()">＋ Mulai tambah aset</button>
</div>
</dialog>
<script src="/recovery-otp.js?v=3" defer>
</script>
</body></html>
`;
