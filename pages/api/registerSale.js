export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const datos = req.body;
    const SPREADAPI = 'https://script.google.com/macros/s/AKfycbxpaVldshku5oRYcyAxpzmeeW6fRZ2OCg0kTiYPS2I7L0bYMoDCSLND-42jcI9yX6u-QA/exec';
    const apiRes = await fetch(SPREADAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    const json = await apiRes.json().catch(() => ({}));
    if (!apiRes.ok) {
      return res.status(apiRes.status).json(json);
    }
    res.status(200).json({ status: 'ok', ...json });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}