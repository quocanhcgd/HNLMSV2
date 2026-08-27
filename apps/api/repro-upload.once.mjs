// Quick repro: teacher upload 400 message
const BASE = 'http://localhost:4001/api';
const login = async (email, password) => {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json();
  return { token: j.accessToken, status: r.status };
};
const upload = async (token, fields) => {
  const fd = new FormData();
  fd.append('file', new Blob(['abc'], { type: 'text/plain' }), 't.txt');
  for (const [k, v] of Object.entries(fields)) fd.append(k, String(v));
  const r = await fetch(`${BASE}/learning/content`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: fd,
  });
  console.log('status', r.status, JSON.stringify(await r.json()));
};
const admin = await login('admin@educenter.vn', 'admin123');
// thử class_ids dạng chuỗi như multer trả về
await upload(admin.token, { title: 'test class_ids', access_scope: 'class', class_ids: '6318a988-ab19-4608-9029-80c50ece6cd1' });
// thử không class_ids
await upload(admin.token, { title: 'test no class_ids', access_scope: 'public' });
