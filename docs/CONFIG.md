# Referensi konfigurasi

Dokumen ini dihasilkan dari `js/main.js` dan file situs. Jangan ubah bagian di antara
penanda AUTO-GENERATED secara manual; jalankan ulang generator atau perbarui sumbernya.

<!-- AUTO-GENERATED: CONFIG -->
## Objek `CONFIG` (`js/main.js`)

| Properti | Nilai saat ini | Keterangan |
|----------|----------------|------------|
| `clinicName` | `"Fisioterapi Ratu Alhilwani"` | - |
| `waNumber` | `"6281238986489"` | Format internasional: tanpa "+", tanpa 0 di depan, tanpa spasi/strip. Contoh: 6281234567890 |
| `phone` | `"+62 812-3898-6489"` | tampil di halaman & dipakai untuk link tel: |
| `email` | `""` (kosong) | opsional: isi bila ada, lalu tambahkan elemen [data-mail-link] di HTML |
| `address` | `"Jl. Lintas Sumbawa, Desa Tambe, Kec. Bolo, Kabupaten Bima, Nusa Tenggara Barat"` | fallback petunjuk arah bila koordinat kosong |
| `latitude` | `"-8.5105121"` | - |
| `longitude` | `"118.595913"` | - |
| `utcOffsetHours` | `8` | WITA = UTC+8 (Asia/Makassar) |

### `CONFIG.hours` (0 = Minggu ... 6 = Sabtu)

| Kode | Hari | Jam (WITA) |
|------|------|------------|
| 0 | Minggu | Tutup |
| 1 | Senin | 08:00 - 16:00 |
| 2 | Selasa | 08:00 - 16:00 |
| 3 | Rabu | 08:00 - 16:00 |
| 4 | Kamis | 08:00 - 16:00 |
| 5 | Jumat | 08:00 - 16:00 |
| 6 | Sabtu | 08:00 - 12:00 |
<!-- /AUTO-GENERATED: CONFIG -->

Jam operasional juga tertulis di dua tempat lain dan harus sama: tabel jam di section Lokasi
(`index.html`) dan `openingHoursSpecification` pada JSON-LD.

<!-- AUTO-GENERATED: PLACEHOLDER -->
## Placeholder yang belum diganti

Total 22 jenis placeholder (komentar HTML tidak dihitung).

| Placeholder | Jumlah | File |
|-------------|--------|------|
| `[DOMAIN]` | 18 | index.html, privacy.html, sitemap.xml, robots.txt |
| `[PETUNJUK ARAH]` | 5 | index.html |
| `[HARGA]` | 3 | index.html |
| `[LAYANAN YANG DIIKUTI]` | 3 | index.html |
| `[SESUAIKAN kebijakan klinik terkait rujukan dan jaminan kesehatan]` | 2 | index.html |
| `[PLATFORM, mis. Google Meet atau WhatsApp Video]` | 2 | index.html |
| `[KEBIJAKAN PEMBATALAN, mis. pemberitahuan minimal 24 jam sebelum sesi]` | 2 | index.html |
| `[AREA KUNJUNGAN, mis. Kota Bima dan sekitarnya]` | 1 | index.html |
| `[INFO PARKIR, mis. tersedia parkir motor dan mobil di halaman klinik]` | 1 | index.html |
| `[INFO AKSES, mis. ruang terapi di lantai dasar, ramah kursi roda dan lansia]` | 1 | index.html |
| `[GELAR]` | 1 | index.html |
| `[SPESIALISASI, mis. Fisioterapi Muskuloskeletal]` | 1 | index.html |
| `[NOMOR IZIN PRAKTIK]` | 1 | index.html |
| `[ISI TESTIMONI ASLI 1. Tulis dengan kata-kata pasien, tanpa janji hasil.]` | 1 | index.html |
| `[ISI TESTIMONI ASLI 2. Tulis dengan kata-kata pasien, tanpa janji hasil.]` | 1 | index.html |
| `[ISI TESTIMONI ASLI 3. Tulis dengan kata-kata pasien, tanpa janji hasil.]` | 1 | index.html |
| `[PLACEHOLDER]` | 1 | privacy.html |
| `[SESUAIKAN dengan penyedia hosting yang dipakai]` | 1 | privacy.html |
| `[JANGKA WAKTU PENYIMPANAN]` | 1 | privacy.html |
| `[NAMA PENYEDIA HOSTING]` | 1 | privacy.html |
| `[SESUAIKAN bila nanti menambahkan analitik]` | 1 | privacy.html |
| `[SESUAIKAN dengan prosedur klinik]` | 1 | privacy.html |
<!-- /AUTO-GENERATED: PLACEHOLDER -->

Cara mengganti: gunakan Find & Replace di editor untuk tiap placeholder di semua file.
Untuk `[DOMAIN]`, isi dengan domain tanpa `https://` (contoh: `namadomain.com`).
