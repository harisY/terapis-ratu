# Design System — Fisioterapi Ratu Alhilwani

Arah desain: **Hangat & Natural — "Eucalyptus & Clay"**.
Sumber kebenaran nilai: `css/tokens.css`. Komponen: `css/style.css` (hanya memakai `var(--...)`).

## 1. Strategi

**Kepribadian brand:** tenang, hangat, jelas, dan bisa dipercaya. Seperti fisioterapis yang sabar
menjelaskan, bukan rumah sakit yang dingin atau gym yang menuntut.

**Kondisi pengunjung:** sering sedang nyeri, cemas, atau terbatas geraknya. Sebagian lansia atau
keluarga pasien, kebanyakan memakai HP dengan jaringan seluler yang tidak selalu cepat.

**Kebutuhan utama (urut):** paham layanan → percaya pada klinik → menghubungi lewat WhatsApp
dengan sekali sentuh.

**Tantangan desain:** teks harus terbaca tanpa zoom, tombol besar, info penting (lokasi, jam buka,
kontak) terlihat tanpa menggulir jauh, dan halaman tetap ringan.

## 2. Tiga arah desain

| Arah | Suasana | Palet | Font | Catatan |
|------|---------|-------|------|---------|
| Tenang & Klinis | Rapi, steril, tepercaya | Biru keabuan, putih, abu dingin | Inter + Source Serif | Aman, tetapi mudah terasa seperti rumah sakit, padahal itu yang ingin dihindari |
| **Hangat & Natural (dipilih)** | Teduh, ramah, memulihkan | Hijau eucalyptus, krem, aksen tanah liat | Fraunces + Plus Jakarta Sans | Paling dekat dengan rasa "dirawat"; aksen clay memberi kehangatan tanpa ramai |
| Aktif & Modern | Energik, sporty | Teal terang, coral, putih | Plus Jakarta Sans saja | Cocok untuk cedera olahraga, tetapi berisiko terasa seperti gym bagi lansia |

**Alasan memilih Hangat & Natural:** pengunjung terbanyak adalah orang yang sedang tidak nyaman
dengan tubuhnya. Warna hijau tanaman dan krem menurunkan ketegangan, kontras tetap tinggi untuk
lansia, dan satu warna aksen (clay) cukup untuk memberi karakter tanpa terlihat seperti template.

## 3. Warna

Semua pasangan teks/latar di bawah lolos WCAG AA (diuji dengan rumus kontras WCAG 2.x).

### Mode terang

| Token | HEX | Fungsi |
|-------|-----|--------|
| `--bg` | `#faf7f2` | Latar utama (krem hangat) |
| `--bg-alt` | `#f2ede4` | Latar section selang-seling (pasir) |
| `--surface` | `#ffffff` | Kartu, form |
| `--surface-2` | `#f7f3ec` | Panel dalam kartu |
| `--text` | `#1f2622` | Teks utama — 14,5:1 pada `--bg` |
| `--muted` | `#56605a` | Teks pendukung — 6,1:1 pada `--bg` |
| `--line` | `#e4ddd1` | Garis dekoratif & batas kartu |
| `--field-border` | `#858b82` | Batas input — 3,5:1 (UI ≥ 3:1) |
| `--primary` | `#2f5e4e` | Eucalyptus: tombol, link, ikon — 6,9:1 |
| `--primary-hover` / `--primary-active` | `#244a3d` / `#1c3b31` | State tombol |
| `--on-primary` | `#ffffff` | Teks di atas primer — 7,4:1 |
| `--primary-soft` | `#e3ede7` | Latar lembut (badge ikon, section alur) |
| `--secondary` / `--secondary-soft` | `#4a7a8c` / `#e2edf1` | Biru danau (cadangan untuk info) |
| `--accent` | `#c0714c` | Clay — dekoratif (garis eyebrow, tanda kutip) |
| `--accent-text` | `#9a4b2b` | Clay untuk teks/badge — 5,0:1 pada `--accent-soft` |
| `--accent-soft` | `#f6e4d9` | Latar badge, avatar inisial |
| `--wa` / `--wa-hover` | `#1b7f55` / `#146542` | Tombol WhatsApp — teks putih 5,0:1 |
| `--ok` / `--ok-soft` | `#1b7f55` / `#e1f2e9` | Sukses, "Buka sekarang" |
| `--warn` / `--warn-soft` | `#7a4f00` / `#fbf0d9` | Peringatan — 6,3:1 |
| `--danger` / `--danger-soft` | `#b3261e` / `#fbe5e2` | Error form — 6,5:1 |
| `--info` / `--info-soft` | `#2c5f8a` / `#e3eef7` | Status form — 5,7:1 |
| `--closed` | `#b3402f` | Titik status "Tutup" |
| `--focus` | `#1f5fbf` | Cincin fokus keyboard — 5,7:1 |
| `--footer-bg` / `--footer-text` | `#1f2b26` / `#eef2ef` | Footer — 13:1 |

### Mode gelap

| Token | HEX | Catatan |
|-------|-----|---------|
| `--bg` / `--bg-alt` | `#121715` / `#171e1b` | |
| `--surface` / `--surface-2` | `#1c2421` / `#222b27` | |
| `--text` / `--muted` | `#ecf1ee` / `#a9b6af` | 15,9:1 dan 7,6:1 |
| `--primary` / `--on-primary` | `#8cc7ae` / `#0e1a15` | Tombol 9,3:1 |
| `--primary-soft` | `#213a30` | |
| `--accent-text` / `--accent-soft` | `#e8ad8d` / `#3a271e` | 7,3:1 |
| `--wa` / `--on-wa` | `#4fc38a` / `#07150e` | 8,5:1 |
| `--danger`, `--warn`, `--info` | `#ff9c8f`, `#f1c76b`, `#8dbde6` | Semua ≥ 7:1 pada latarnya |
| `--focus` | `#8db8ff` | 9:1 |
| `--field-border` | `#7e8c85` | 4,5:1 |

Mode gelap ditulis dua kali di `tokens.css`: untuk `[data-theme="dark"]` (pilihan manual) dan
`@media (prefers-color-scheme: dark)` (pengunjung tanpa JS). Ubah keduanya bersamaan.

## 4. Tipografi

- **Display & judul:** Fraunces 500/600 — serif lembut dan hangat, terbaca jelas di ukuran besar.
- **Teks isi & UI:** Plus Jakarta Sans 400/500/600/700 — sans-serif buatan desainer Indonesia,
  sangat terbaca di layar kecil.
- Fallback: Georgia (serif), system-ui (sans).

| Token | Ukuran | Dipakai untuk |
|-------|--------|---------------|
| `--fs-display` | 36 → 56px (fluid) | H1 hero |
| `--fs-h1` | 32 → 44px | H1 halaman privasi |
| `--fs-h2` | 26 → 36px | Judul section, harga |
| `--fs-h3` | 20px | Judul kartu |
| `--fs-h4` | 18px | Nama brand, sub-judul |
| `--fs-lead` | 19px | Paragraf pembuka |
| `--fs-body` | **17px** | Teks isi, input form |
| `--fs-small` | 15px | Teks pendukung, label kartu |
| `--fs-label` | 15px | Label form (tebal) |
| `--fs-button` | 16px | Tombol |
| `--fs-eyebrow` | 14px | Label kapital dekoratif |

Tinggi baris: 1,15 (display), 1,3 (judul kecil), **1,7 (teks isi)**. Panjang baris teks maks. 62ch.

## 5. Spasi, layout & bentuk

- **Skala spasi (basis 4px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96px (`--space-1` … `--space-9`).
  Jarak antar-section `--space-section` = 64 → 96px.
- **Container:** maks. 1160px, gutter 20 → 32px.
- **Grid:** HP 1 kolom (4 kolom konseptual) · tablet ≥ 600px 2 kolom · desktop ≥ 900px 3–4 kolom.
  Menu desktop muncul ≥ 1181px. Nilai breakpoint ditulis langsung di `@media` karena CSS tidak
  mendukung `var()` di sana.
- **Radius:** 10px (kecil), 16px (input, info cepat, FAQ), 24px (kartu), 32px (form), pill (tombol).
- **Garis:** 1px (kartu), 1,5px (input), 2px (tombol outline, fokus).
- **Bayangan:** tiga tingkat lembut berwarna tinta hijau (`--shadow-1` … `--shadow-3`), bukan hitam.
- **Area sentuh:** standar 48px (`--tap`), minimum 44px (`--tap-min`).

## 6. Elemen grafis

- **Motif "alur gerak":** garis pendek clay di depan setiap label section, satu lengkung tipis di hero
  (hanya di layar ≥ 900px agar tidak mengganggu teks di HP), dan titik carousel yang memanjang.
  Dipakai secukupnya.
- **Ikon:** SVG inline 24×24, garis 1,75 (1,6 di badge), ujung membulat. Set layanan berupa figur
  manusia sederhana, bukan tulang atau anatomi:
  `i-back` (nyeri punggung), `i-sport` (cedera), `i-stroke` (pemulihan stroke), `i-elder` (lansia
  dengan tongkat), `i-child` (orang tua dan anak), `i-home` (kunjungan rumah), serta `i-calendar`,
  `i-pin`, `i-clock`, `i-whatsapp`, `i-phone`, `i-sun`/`i-moon`.
- **Arahan foto:** interaksi fisioterapis dan pasien yang hangat dan natural (bukan pose stok),
  ruang terapi bersih dan terang, cahaya jendela yang lembut, warna kulit dan pakaian alami.
  Hindari rontgen, close-up cedera, gym, dan foto "sebelum-sesudah". Simpan sebagai WebP terkompresi
  dengan `width`/`height` eksplisit.
- **Tanpa logo:** nama klinik tampil sebagai teks Fraunces. Favicon berupa huruf "R" sementara
  sampai klinik memiliki logo resmi.

## 7. Komponen

| Komponen | Aturan |
|----------|--------|
| Tombol | `.btn-primary`, `.btn-outline` (sekunder), `.btn-wa`, `.btn-ghost`; tinggi 48px (44px untuk `.btn-sm`); hover naik 1px + bayangan, active turun, fokus cincin 2px, nonaktif opacity 50% |
| Kartu layanan | Ikon dalam badge 48px, judul, satu kalimat, "Lihat detail" (buka-tutup), tombol WA; hover naik 3px |
| Kartu paket | Keterangan "Cocok untuk", harga Fraunces, checklist; paket unggulan bergaris primer + badge clay |
| Kartu fisioterapis | Foto bulat 200px, nama, spesialisasi, nomor izin, tombol jadwal |
| Testimoni | Tanda kutip clay, inisial dalam lingkaran, geser manual (tanpa auto-play) |
| FAQ | Baris minimal 60px, chevron berputar, 5 tampil + "Lihat pertanyaan lainnya" |
| Form | Input 48px, teks 17px, fokus cincin lembut; error merah + teks; pilihan berupa pil |
| Navbar | Sticky dengan blur, nama klinik teks; HP: tema, telepon, menu |
| Footer | Hijau tua, kontak + tautan, catatan darurat |
| WA floating | 60px, tooltip saat hover/fokus, denyut 3 kali lalu berhenti, aman dari safe-area |
| Toggle tema | Ikon bulan/matahari, aria-label berubah, preferensi disimpan |

## 8. Gerak

| Token | Nilai | Dipakai untuk |
|-------|-------|---------------|
| `--dur-1` | 150ms | Hover, fokus |
| `--dur-2` | 250ms | Buka-tutup, ganti tema |
| `--dur-3` | 400ms | Fade-in judul section |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Masuk & hover |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Ganti tema |

Bila `prefers-reduced-motion: reduce` aktif, semua animasi dan transisi dimatikan.

## 9. Tone komunikasi visual

Tenang, jelas, tidak menggurui. Desain memberi ruang bernapas, satu aksi utama per bagian,
bahasa sehari-hari, dan tidak pernah menjanjikan kesembuhan.
