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
- Video di player adalah video contoh (film pendek Blender Studio),
  **bukan episode asli** dramanya.
- Deploy di Vercel sebagai situs statis: root directory repo ini,
  tanpa build command.

Situs live DramaMalku (9 platform, data asli API Sansekai) tetap berada
di repo `Pecut-AI/Drama-Malku` dan tidak disentuh oleh repo ini.
