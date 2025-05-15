export default async function handler(req, res) {
  const { appid } = req.query;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!appid) {
    res.status(400).json({ error: 'Missing appid' });
    return;
  }

  const githubUrl = `https://raw.githubusercontent.com/plxt79/database/main/Games%20ZIPs/${appid}.zip`;

  try {
    const githubRes = await fetch(githubUrl, {
      headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
    });

    if (!githubRes.ok) {
      res.status(githubRes.status).json({ error: 'File not found or fetch error' });
      return;
    }

    // Set headers to force download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${appid}.zip"`);

    // Stream the response body directly to the client
    githubRes.body.pipe(res);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}