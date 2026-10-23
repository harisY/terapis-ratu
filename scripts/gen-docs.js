// Jalankan dari mana saja: node scripts/gen-docs.js
// Menghasilkan docs/CONFIG.md dari sumber kebenaran: objek CONFIG di js/main.js
// dan placeholder [KURUNG SIKU] yang masih ada di file situs.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const main = fs.readFileSync(root + '/js/main.js', 'utf8');

const block = main.match(/const CONFIG = \{[\s\S]*?\n\};/)[0];
const CONFIG = new Function(block + '; return CONFIG;')();

// Ambil komentar per properti (komentar di baris sebelumnya atau di belakang nilai)
const notes = {};
let pending = [];
for (const line of block.split('\n')) {
  const t = line.trim();
  if (t.startsWith('//')) { pending.push(t.replace(/^\/\/\s*/, '')); continue; }
  const m = t.match(/^(\w+):/);
  if (m) {
    const inline = (line.match(/\/\/\s*(.+)$/) || [])[1];
    notes[m[1]] = [...pending, inline].filter(Boolean).join(' ');
    pending = [];
  }
}

const fmt = (v) => (v === '' ? '`""` (kosong)' : '`' + JSON.stringify(v) + '`');
const rows = Object.keys(CONFIG).filter((k) => k !== 'hours')
  .map((k) => `| \`${k}\` | ${fmt(CONFIG[k])} | ${notes[k] || '-'} |`);

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const hourRows = Object.keys(CONFIG.hours).map((d) => {
  const h = CONFIG.hours[d];
  return `| ${d} | ${dayNames[d]} | ${h ? h.open + ' - ' + h.close : 'Tutup'} |`;
});

// Placeholder yang masih tersisa di file situs
const files = ['index.html', 'privacy.html', 'sitemap.xml', 'robots.txt'];
const counts = {};
for (const f of files) {
  const text = fs.readFileSync(`${root}/${f}`, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of text.matchAll(/\[([A-Z][^\]\n]{1,80})\]/g)) {
    const key = '[' + m[1] + ']';
    counts[key] = counts[key] || { n: 0, files: new Set() };
    counts[key].n += 1;
    counts[key].files.add(f);
  }
}
const phRows = Object.keys(counts).sort((a, b) => counts[b].n - counts[a].n)
  .map((k) => `| \`${k}\` | ${counts[k].n} | ${[...counts[k].files].join(', ')} |`);

const out = `# Referensi konfigurasi

Dokumen ini dihasilkan dari \`js/main.js\` dan file situs. Jangan ubah bagian di antara
penanda AUTO-GENERATED secara manual; jalankan ulang generator atau perbarui sumbernya.

<!-- AUTO-GENERATED: CONFIG -->
## Objek \`CONFIG\` (\`js/main.js\`)

| Properti | Nilai saat ini | Keterangan |
|----------|----------------|------------|
${rows.join('\n')}

### \`CONFIG.hours\` (0 = Minggu ... 6 = Sabtu)

| Kode | Hari | Jam (WITA) |
|------|------|------------|
${hourRows.join('\n')}
<!-- /AUTO-GENERATED: CONFIG -->

Jam operasional juga tertulis di dua tempat lain dan harus sama: tabel jam di section Lokasi
(\`index.html\`) dan \`openingHoursSpecification\` pada JSON-LD.

<!-- AUTO-GENERATED: PLACEHOLDER -->
## Placeholder yang belum diganti

Total ${Object.keys(counts).length} jenis placeholder (komentar HTML tidak dihitung).

| Placeholder | Jumlah | File |
|-------------|--------|------|
${phRows.join('\n')}
<!-- /AUTO-GENERATED: PLACEHOLDER -->

Cara mengganti: gunakan Find & Replace di editor untuk tiap placeholder di semua file.
Untuk \`[DOMAIN]\`, isi dengan domain tanpa \`https://\` (contoh: \`namadomain.com\`).
`;

fs.mkdirSync(root + '/docs', { recursive: true });
fs.writeFileSync(root + '/docs/CONFIG.md', out);
console.log(`CONFIG.md: ${rows.length} properti, ${hourRows.length} hari, ${Object.keys(counts).length} placeholder`);
