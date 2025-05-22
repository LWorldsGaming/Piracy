export default async function handler(req, res) {
    const { appid } = req.query;
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

    if (!appid) {
        return res.status(400).json({ error: 'Missing AppID' });
    }

    const githubUrl = `https://raw.githubusercontent.com/plxt79/database/main/Games%20ZIPs/${appid}.zip`;

    try {
        // Get the file first to verify it exists
        const response = await fetch(githubUrl, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3.raw'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'File not found or fetch error' });
        }

        // Generate a temporary signed URL (just a fake one, expires in 60s)
        const timestamp = Date.now();
        const expiry = timestamp + 60 * 1000; // expires in 60 seconds

        const tempUrl = `/api/download?appid=${appid}&t=${expiry}`;

        return res.status(200).json({
            appid,
            url: tempUrl,
            expiresAt: expiry
        });

    } catch (err) {
        console.error("generate error:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}