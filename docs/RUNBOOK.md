# Runbook

Situs statis tanpa server, basis data, atau proses di belakang layar. Semua file disajikan apa
adanya oleh hosting, sehingga yang perlu dikelola hanya proses deploy, kebenaran data, dan SEO.

## Status saat ini

- Kode ada di https://github.com/harisY/terapis-ratu (branch `main`, repo **private**).
- Situs **belum dipublikasikan**. GitHub Pages belum aktif karena repo private pada akun gratis tidak
  mendukungnya (galat 422).
- `[DOMAIN]` dan beberapa placeholder lain masih ada. Lihat `docs/CONFIG.md`.

## Sebelum deploy

1. Ganti semua placeholder yang relevan (`docs/CONFIG.md`), terutama `[DOMAIN]`, harga, `[GELAR]`,
   `[NOMOR IZIN PRAKTIK]`, dan testimoni asli.
2. Pastikan jam operasional di `CONFIG.hours`, tabel Lokasi, dan JSON-LD sama dan benar.
3. Pastikan koordinat dan pin peta tepat di lokasi klinik.
4. Jalankan checklist pengujian di `docs/CONTRIBUTING.md`.
5. Selama masih sementara atau belum final, tambahkan `noindex` pada `<meta name="robots">` di
   `index.html` dan `privacy.html`, lalu hapus saat situs resmi.

## Deploy

Karena situs statis, cukup unggah seluruh isi folder (tanpa `.git`). Pilih salah satu:

**GitHub Pages**
1. Jadikan repo publik (syarat akun gratis).
2. Settings, Pages, Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Tunggu proses selesai. Alamatnya `https://harisy.github.io/terapis-ratu/`.
4. Semua link di situs bersifat relatif, jadi aman dipakai di sub-path `/terapis-ratu/`.

Perintah setara: `gh api -X POST repos/harisY/terapis-ratu/pages -f "source[branch]=main" -f "source[path]=/"`

**Netlify, Vercel, atau hosting biasa**
Seret folder proyek (Netlify Drop) atau unggah semua file ke `public_html`. Tidak ada langkah build.

Setelah domain final dipakai, ganti `[DOMAIN]` di `index.html`, `privacy.html`, `sitemap.xml`, dan
`robots.txt`, lalu kirim ulang `sitemap.xml` ke Google Search Console.

## Pemeriksaan setelah deploy

1. Buka alamat situs di jendela Incognito. Konsol tidak boleh menampilkan error.
2. Klik tombol WhatsApp dan kirim satu form uji. Pastikan nomor dan pesan benar.
3. Buka section Lokasi: pin peta tepat, tombol "Buka di Google Maps" menuju titik klinik.
4. Uji `https://[DOMAIN]/` di Rich Results Test (MedicalClinic, FAQPage, BreadcrumbList).
5. Cek pratinjau tautan (OG image) saat dibagikan lewat WhatsApp.

Tidak ada endpoint health check. Untuk pemantauan, pakai uptime monitor gratis pada URL situs dan
laporan Google Search Console.

## Masalah umum

| Gejala | Penyebab dan perbaikan |
|--------|------------------------|
| Tombol WA membuka halaman galat | `CONFIG.waNumber` salah format. Harus `62...` tanpa `+`, 0, spasi, atau strip |
| Perubahan CSS/JS tidak muncul | Cache browser atau hosting. Tekan Ctrl+Shift+R; bersihkan cache CDN bila ada |
| Pin peta meleset | Ubah `CONFIG.latitude/longitude`, `src` iframe peta, dan `geo` di JSON-LD |
| Jam "Buka sekarang" salah | Samakan `CONFIG.hours` dengan tabel jam; perhitungan memakai UTC+8, bukan jam perangkat |
| Konsol: "Could not establish connection" | Berasal dari ekstensi browser, bukan situs. Uji di Incognito |
| Konsol: "Tracking Prevention blocked access to storage" | Dari embed Google Maps di Edge. Tidak berbahaya |
| Font tampil serif/sans bawaan | Google Fonts terblokir. Fallback sudah disiapkan, tampilan tetap terbaca |
| Peta tidak muncul | Iframe Google Maps diblokir ekstensi atau jaringan |

## Rollback

Karena semua perubahan ada di git:

```bash
git log --oneline            # cari commit yang bermasalah
git revert <sha>             # buat commit pembatal
git push origin main         # GitHub Pages memperbarui situs otomatis
```

Pada Netlify, buka Deploys dan pilih "Publish deploy" pada versi sebelumnya.

## Eskalasi

Pemilik situs dan satu-satunya pengelola adalah Ratu Alhilwani (+62 812-3898-6489). Untuk masalah
hosting atau domain, hubungi penyedia hosting atau registrar domain yang dipakai. [ISI KONTAK TEKNIS
bila ada pihak yang mengelola situs]
