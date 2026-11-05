# DramaMalku Demo

Demo tampilan baru DramaMalku — terpisah dari situs live di
[dramamalku.ai.id](https://dramamalku.ai.id).

- Satu halaman statis (`index.html`, tanpa build step).
- Platform **Demo** adalah default saat beranda dibuka: 9 judul,
  poster asli Melolo yang ditanam di dalam demo, data episode, status,
  dan sinopsis adalah **data dummy khusus demo**.
- Platform **Melolo** adalah live seperti situs dramamalku.ai.id:
  mengambil data asli dari API Sansekai
  (`api.sansekai.my.id/api/melolo/trending` dan `get-latest`) langsung
  dari browser; poster dilewatkan proksi gambar wsrv.nl (seperti situs
  live, karena CDN Melolo menolak pemuatan langsung); halaman detail
  memuat sinopsis, sampul, dan daftar episode asli; pemutar mengambil
  stream asli per episode dari endpoint `get-episode`. Bila API menolak
  (mis. 403 dari IP pusat data), tampil status gagal beserta tombol
  Coba lagi. 8 platform lain menampilkan keadaan kosong.
- Pengurai katalog Melolo menelusuri seluruh respons API dan mengenali
  buku dengan berbagai nama field, dengan umpan cadangan `foryou` bila
  `trending` dan `get-latest` kosong; bilah status menyebut penyebab
  sebenarnya (kode HTTP per endpoint, atau data tidak dikenali).
- Platform dan halaman yang sedang dibuka tertulis di URL (mis.
  `#beranda-melolo`), jadi refresh membuka kembali halaman dan platform
  yang sama, bukan kembali ke Demo; daftar episode dimuat ulang dari API
  saat halaman detail dibuka kembali.
- Video di player untuk judul **Demo** adalah video contoh (film pendek
  Blender Studio), **bukan episode asli** dramanya; judul Melolo memakai
  stream asli.
- Melolo memakai jalur langsung dari API resmi aplikasi Melolo
  (`api.tmtreader.com`) lewat fungsi serverless `api/tmt.js` di repo
  ini — TANPA mencoba Sansekai dulu (keputusan Elnath 5 Nov 2026).
  Halaman demo tidak bisa memanggil API itu langsung dari browser
  (request ber-Origin dibalas 403), jadi fungsi server-side yang
  meneruskannya. Katalog diambil dari pencarian kata kunci (jalur ini
  tidak punya feed latest/trending), detail + daftar episode dari
  `directory`, stream MP4 langsung (360p–720p, codec bytevc1) dari
  `video_model`. Bilah status menyebut "Terhubung ke Melolo langsung".
- Deploy di Vercel: situs statis (root directory repo ini, tanpa build
  command) + fungsi serverless dari folder `api/`.

Situs live DramaMalku (9 platform, data asli API Sansekai) tetap berada
di repo `Pecut-AI/Drama-Malku` dan tidak disentuh oleh repo ini.
