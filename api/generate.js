export default async function handler(req, res) {
  const { appid } = req.query;
  const GITHUB_TOKEN = process.env.GEN_TOKEN;

  if (!appid) {
    return res.status(400).json({ error: 'Missing appid' });
  }

  const apiUrl = `https://api.github.com/repos/plxt79/database/contents/${encodeURIComponent('Games ZIPs')}/${appid}.zip`;

  try {
    const apiRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    });

    if (!apiRes.ok) {
      console.error(`GitHub API error: ${apiRes.status} ${apiRes.statusText}`);
      return res.status(apiRes.status).json({ error: 'File not found or fetch error' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${appid}.zip"`);

    apiRes.body.pipe(res);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
