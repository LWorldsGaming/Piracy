export default async function handler(req, res) {
    const { appid, t } = req.query;
    const GITHUB_TOKEN = process.env.GEN_TOKEN;
    const referer = req.headers.referer || '';
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : req.connection.remoteAddress || '';
    const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
    const isBrowser = req.headers['user-agent']?.includes('Mozilla');

    console.log('Client IP:', clientIp);

    const allowedIps = ['192.168.29.126', '152.59.87.191'];

    if (!referer.startsWith('https://blackbay.vercel.app') && !allowedIps.includes(clientIp)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (!isAjax && !isBrowser) {
        return res.status(403).json({ error: 'Access denied' });
    }

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