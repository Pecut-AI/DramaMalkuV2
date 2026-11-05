# DramaMalku Demo

Demo tampilan baru DramaMalku — terpisah dari situs live di
[dramamalku.ai.id](https://dramamalku.ai.id).

- Satu halaman statis (`index.html`, tanpa build step).
- Platform **Demo** adalah default saat beranda dibuka: 9 judul,
  poster asli Melolo yang ditanam di dalam demo, data episode, status,
  dan sinopsis adalah **data dummy khusus demo**.
- Platform **Melolo** adalah live dan menampilkan drama BERBAHASA
  INDONESIA (keputusan Elnath 5 Nov 2026): mengambil data asli dari
  APIShort (`apishort.com/v1/melolo/...`, parameter `lang=id`)
  langsung dari browser, TANPA API key (endpoint ini bisa diakses
  anonim, CORS terbuka; batas 100 request/hari per IP pengunjung).
  Katalog dari `api/home` (offset 0 dan 18, dua seksi beranda),
  detail + daftar episode dari `api/detail/{id}`, stream per episode
  dari `api/video?id=&ep=`. Bila API menolak, tampil status gagal
  beserta tombol Coba lagi. 8 platform lain menampilkan keadaan
  kosong.
- APIShort tidak memberi status (Berlanjut/Tamat) dan genre, jadi
  detail Melolo tidak menampilkan chip status dan chip genre. Poster
  dari APIShort sudah berupa URL wsrv.nl bertanda tangan — dipakai
  apa adanya; penulisan ulang path `novel-images-apsoutheast` menjadi
  `novel-images-sg` hanya berlaku untuk URL yang belum lewat wsrv.nl
  (peninggalan jalur tmtreader) dan dilewati bila URL sudah diawali
  `https://wsrv.nl/`.
- Platform dan halaman yang sedang dibuka tertulis di URL (mis.
  `#beranda-melolo`), jadi refresh membuka kembali halaman dan platform
  yang sama, bukan kembali ke Demo; daftar episode dimuat ulang dari API
  saat halaman detail dibuka kembali.
- Video di player untuk judul **Demo** adalah video contoh (film pendek
  Blender Studio), **bukan episode asli** dramanya; judul Melolo memakai
  stream asli.
- RIWAYAT SUMBER MELOLO: Sansekai (30 Okt–5 Nov 2026) lalu tmtreader
  langsung (`api.tmtreader.com` lewat fungsi serverless `api/tmt.js`,
  TANPA mencoba Sansekai dulu — keputusan Elnath 5 Nov 2026). Keduanya
  hanya memberi katalog BERBAHASA INGGRIS: pencarian tmtreader dengan
  kata kunci Indonesia mengembalikan 0 hasil dan parameter `lang=id`
  diabaikan. Sejak 5 Nov 2026 Melolo memakai APIShort `lang=id`
  (lihat di atas). Fungsi `api/tmt.js` masih ada di repo tapi sudah
  tidak dipakai halaman demo; bilah status menyebut "Terhubung ke
  Melolo (Indonesia)". Video Melolo tetap tidak bisa diputar di
  browser HP Android 11 Elnath: stream-nya HEVC (bytevc1) dan medianya
  terenkripsi CENC — APIShort memberi kunci dekripsinya, tapi hasil
  dekripsi tetap HEVC.
- Deploy di Vercel: situs statis (root directory repo ini, tanpa build
  command) + fungsi serverless dari folder `api/`.

Situs live DramaMalku (9 platform, data asli API Sansekai) tetap berada
di repo `Pecut-AI/Drama-Malku` dan tidak disentuh oleh repo ini.
