// Vercel Serverless Function: proxy tipis ke API resmi aplikasi Melolo
// (api.tmtreader.com) untuk demo DramaMalku.
//
// Kenapa perlu proxy: browser TIDAK BISA memanggil api.tmtreader.com
// langsung — request yang membawa header Origin dibalas 403 oleh servernya
// (preflight OPTIONS pun 403). Fungsi ini jalan server-side (tanpa header
// Origin) dan meneruskan request, lalu mengembalikan JSON upstream apa adanya.
//
// Cara pakai dari halaman demo (same-origin di Vercel, CORS * juga aktif):
//   GET  /api/tmt?path=/i18n_novel/search/page/v1/&query=love&offset=0&count=20
//   GET  /api/tmt?path=/i18n_novel/book/directory/info/v1/&book_id=<id>
//   POST /api/tmt?path=/novel/player/video_model/v1/   (body JSON RPC)
// Parameter umum aplikasi (app_id, version_name, device_id) ditambahkan
// otomatis di sini; pemanggil cukup mengirim parameter endpointnya.
//
// Referensi: DracinScraper (latifangren/DramaboxD), docs/teardown-melolo-5.1.8.md
// dan src/providers/melolo/ — search + directory + video_model terverifikasi
// live 22 Okt 2026 oleh penulisnya, dan diuji ulang dari VM Muse 5 Nov 2026
// (search code 0, directory 76 episode, video_model 360p-720p MP4 langsung).

const UPSTREAM = 'https://api.tmtreader.com';
const APP_ID = '645713';
const VERSION_NAME = '5.1.8';
const DEVICE_ID = '7268586056781432322';

// Hanya path ini yang boleh diteruskan — proxy tidak terbuka untuk umum.
const ALLOWED_PATHS = [
  '/i18n_novel/search/page/v1/',
  '/i18n_novel/search/suggest/v1/',
  '/i18n_novel/book/directory/info/v1/',
  '/i18n_novel/book/books/detail/',
  '/novel/player/video_model/v1/',
  '/novel/player/video_detail/v1/',
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const path = req.query.path;
  if (!path || !ALLOWED_PATHS.includes(path)) {
    return res
      .status(400)
      .json({ ok: false, source: 'tmtreader', error: 'path tidak diizinkan' });
  }

  const params = new URLSearchParams({
    app_id: APP_ID,
    version_name: VERSION_NAME,
    device_id: DEVICE_ID,
  });
  for (const [k, v] of Object.entries(req.query)) {
    if (k === 'path') continue;
    if (Array.isArray(v)) v.forEach((x) => params.append(k, x));
    else if (v !== undefined) params.append(k, v);
  }
  const url = `${UPSTREAM}${path}?${params.toString()}`;

  const method = req.method === 'POST' ? 'POST' : 'GET';
  let body;
  if (method === 'POST') {
    body =
      typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body === undefined ? {} : req.body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const up = await fetch(url, {
      method,
      headers: {
        'user-agent': 'okhttp/4.12.0',
        accept: 'application/json',
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      },
      body,
      signal: controller.signal,
    });
    const text = await up.text();
    res.status(up.status);
    res.setHeader('content-type', 'application/json');
    return res.send(text);
  } catch (e) {
    return res.status(502).json({
      ok: false,
      source: 'tmtreader',
      error:
        'upstream tidak terjangkau: ' + (e && e.message ? e.message : String(e)),
    });
  } finally {
    clearTimeout(timer);
  }
};
