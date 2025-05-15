export default async function handler(req, res) {
  const { appid } = req.query;
  const GITHUB_TOKEN = process.env.GEN_TOKEN;

  const allowedOrigin = 'https://blackbay.vercel.app';
  const origin = req.headers.origin || req.headers.referer || '';

  if (!origin.startsWith(allowedOrigin)) {
    return res.status(403).json({ error: '403 Forbidden: Not Allowed' });
  }

  if (!appid) {
    res.status(400).json({ error: 'Missing appid' });
    return;
  }

  const githubUrl = `https://raw.githubusercontent.com/plxt79/database/main/Games%20ZIPs/${appid}.zip`;

  try {
    const githubRes = await fetch(githubUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    });

    if (!githubRes.ok) {
      const errorText = await githubRes.text();
      console.error('GitHub fetch error:', githubRes.status, errorText);
      res.status(githubRes.status).json({ error: 'File not found or fetch error', details: errorText });
      return;
    }

    const buffer = await githubRes.arrayBuffer();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${appid}.zip"`);
    res.setHeader('Content-Length', buffer.byteLength);

    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
