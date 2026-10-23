# Panduan pengembangan

Landing page statis (HTML, CSS, JavaScript vanilla) untuk Fisioterapi Ratu Alhilwani, Bolo,
Kabupaten Bima, NTB. Tidak ada framework, backend, atau build tool.

## Persiapan

Yang dibutuhkan: browser modern dan editor teks. Opsional: Node.js 18+ (untuk pengecekan
dan pembuatan dokumentasi) dan Python 3 (untuk server lokal).

```bash
git clone https://github.com/harisY/terapis-ratu.git
cd terapis-ratu
python -m http.server 8000      # lalu buka http://localhost:8000
```

`index.html` juga bisa dibuka langsung dengan klik dua kali, tetapi gunakan server lokal agar
perilakunya sama dengan hosting (font, peta, dan cache).

## Struktur

| Path | Isi |
|------|-----|
| `index.html` | Halaman utama: 12 section, JSON-LD, sprite ikon SVG |
| `privacy.html` | Kebijakan privasi |
| `css/style.css` | Semua gaya. Bagian 1 = design tokens (warna, font, ukuran) |
| `js/main.js` | `CONFIG` di bagian atas, lalu seluruh interaksi |
| `assets/` | Favicon, logo, gambar OG, placeholder foto |
| `robots.txt`, `sitemap.xml` | SEO |
| `docs/CONFIG.md` | Referensi `CONFIG` dan daftar placeholder (dihasilkan otomatis) |
| `scripts/gen-docs.js` | Pembuat `docs/CONFIG.md` |

## Perintah

Tidak ada `package.json`. Perintah yang dipakai:

| Perintah | Fungsi |
|----------|--------|
| `python -m http.server 8000` | Server lokal |
| `node --check js/main.js` | Cek sintaks JavaScript |
| `node scripts/gen-docs.js` | Perbarui `docs/CONFIG.md` dari `CONFIG` dan sisa placeholder |

Cek JSON-LD valid:

```bash
node -e "const h=require('fs').readFileSync('index.html','utf8');[...h.matchAll(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g)].forEach(m=>JSON.parse(m[1]));console.log('JSON-LD OK')"
```

## Aturan saat mengubah kode

- **Warna** hanya lewat CSS variable di `css/style.css` bagian 1. Jangan tulis nilai hex di tempat lain.
  Situs hanya memakai tema terang.
- **Data klinik** (nomor WhatsApp, telepon, jam, alamat fallback, koordinat) diubah di `CONFIG`.
  Nama, alamat, dan telepon juga tertulis di HTML dan JSON-LD, dan harus sama persis.
- **Jam operasional** ada di tiga tempat dan harus sama: `CONFIG.hours`, tabel jam di section
  Lokasi, dan `openingHoursSpecification` di JSON-LD.
- **FAQ** ada di dua tempat dan harus identik: `<details class="faq-item">` di HTML dan `FAQPage` di JSON-LD.
  Lima pertanyaan pertama tampil langsung; sisanya ada di dalam "Lihat pertanyaan lainnya".
- **Tombol WhatsApp** memakai atribut `data-wa-message`. Token `{clinic}` diganti dengan
  `CONFIG.clinicName`. Jangan menulis link `wa.me` langsung di HTML.
- **Dropdown layanan** di form diisi otomatis dari atribut `data-service-name` pada kartu layanan.
- **Jam buka** di section Lokasi dikelompokkan dengan atribut `data-days` (mis. `data-days="1,2,3,4,5"`);
  baris hari ini disorot otomatis.
- **Bahasa awam:** hindari istilah medis tanpa penjelasan (tulis "setelah operasi", bukan "pasca operasi").
  Teks yang perlu dibaca minimal ±15px (`.95rem`).
- **Breakpoint menu** desktop adalah 1181px, harus sama di `css/style.css` dan `js/main.js`.
- Jangan menambah `console.*` di kode produksi.
- Jangan mengarang testimoni, nama, gelar, nomor izin, atau klaim hasil terapi.

## Pengujian

Tidak ada test otomatis. Jalankan checklist ini sebelum commit yang mengubah tampilan atau perilaku:

1. Konsol browser bersih (tidak ada error merah) di `index.html` dan `privacy.html`.
2. Semua tombol WhatsApp membuka `wa.me/6281238986489` dengan pesan yang sesuai.
3. Form booking: kirim kosong menampilkan error dan memindahkan fokus; kirim valid membuka WhatsApp
   dengan jadwal "tanggal, pagi/siang/sore".
4. Navigasi keyboard: skip link, menu mobile (Esc menutup), FAQ, carousel, fokus selalu terlihat.
5. Aktifkan `prefers-reduced-motion`: pulse dan fade-in tidak berjalan. (Carousel tidak memakai auto-play.)
6. Lebar 320, 390, 768, 1024, 1280, dan 1440px tanpa scroll horizontal. Coba juga dengan nama klinik panjang.
7. Lighthouse (Performance, Accessibility, Best Practices, SEO) di mobile.

## Commit dan PR

Format commit: `<type>: <deskripsi>` dengan type `feat`, `fix`, `refactor`, `docs`, `test`, `chore`,
`perf`, atau `ci`.

Checklist sebelum push:

- [ ] Checklist pengujian di atas lulus
- [ ] `node --check js/main.js` dan cek JSON-LD lolos
- [ ] `node scripts/gen-docs.js` dijalankan jika `CONFIG` atau placeholder berubah
- [ ] Tidak ada data pribadi, token, atau path komputer di file yang di-commit
