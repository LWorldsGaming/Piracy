let requestedAppIDs = new Set(); // This is reset on every cold start

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const { appid, userid, ip } = req.body;

    if (!appid || !userid) {
        return res.status(400).json({ error: "Missing fields" });
    }

    if (requestedAppIDs.has(appid)) {
        return res.status(429).json({ error: "AppID already requested" });
    }

    requestedAppIDs.add(appid);

    const payload = {
        content: `# AppID: \`${appid}\`\n**User: <@${userid}>**\n-# 🌐 IP: \`${ip || "Unknown"}\``
    };

    const webhookURL = "https://discord.com/api/webhooks/1361770759080378479/FOTIsFeFhRKk0ltgkEPnKofdGfY3OJ_RX1exlKBB9jdfU1cHmIGb-Ojig6WsV8YweWy-";

    try {
        const webhookRes = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!webhookRes.ok) {
            return res.status(500).json({ error: "Failed to send to Discord" });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error posting to Discord:", err);
        return res.status(500).json({ error: "Internal error" });
    }
}