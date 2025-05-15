export default async function handler(req, res) {
    const { appid, t } = req.query;
    const GITHUB_TOKEN = process.env.GEN_TOKEN;

    if (!appid || !t) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const now = Date.now();
    if (parseInt(t) < now) {
        return res.status(403).json({ error: 'Download link expired' });
    }

    const githubUrl = `https://raw.githubusercontent.com/plxt79/database/main/Games%20ZIPs/${appid}.zip`;

    try {
        const githubRes = await fetch(githubUrl, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3.raw'
            }
        });

        if (!githubRes.ok) {
            return res.status(githubRes.status).json({ error: 'Failed to fetch file' });
        }

        const fileBuffer = await githubRes.arrayBuffer();

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${appid}.zip"`);
        res.send(Buffer.from(fileBuffer));

    } catch (err) {
        console.error("download error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}