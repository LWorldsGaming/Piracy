export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { appid, userid } = req.body;
    if (!appid || !userid) {
        return res.status(400).json({ error: 'Missing appid or userid' });
    }

    const filename = `${appid}.zip`;
    const githubUrl = `https://raw.githubusercontent.com/plxt79/database/main/Games%20ZIPs/${filename}`;

    try {
        const headRes = await fetch(githubUrl, { method: 'HEAD' });
        if (headRes.status === 200) {
            return res.status(200).json({ message: 'Game already available.' });
        }
    } catch (e) {
        console.error("Failed to check GitHub file:", e);
        return res.status(500).json({ error: 'File check failed' });
    }

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown";

    const payload = {
        content: `# AppID: \`${appid}\`\n**User: <@${userid}>**\n-# 🌐 IP: \`${ip}\``
    };

    const webhookURL = "https://discord.com/api/webhooks/1361770759080378479/FOTIsFeFhRKk0ltgkEPnKofdGfY3OJ_RX1exlKBB9jdfU1cHmIGb-Ojig6WsV8YweWy-";

    try {
        const discordRes = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!discordRes.ok) {
            throw new Error("Discord webhook failed");
        }

        return res.status(200).json({ message: 'Request sent!' });
    } catch (e) {
        console.error("Webhook error:", e);
        return res.status(500).json({ error: 'Webhook failed' });
    }
}