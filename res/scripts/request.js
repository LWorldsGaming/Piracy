async function request() {
    const appid = document.getElementById("AppIDInput").value.trim();
    const userid = document.getElementById("UserIDInput").value.trim();
    if (!appid) return alert("Please enter a valid AppID");

    const filename = `${appid}.zip`;

    try {
        const res = await fetch(`https://raw.githubusercontent.com/plxt79/database/main/Games%20ZIPs/${filename}`, { method: 'HEAD' });
        if (res.status === 200) {
            return alert("This game is already available!");
        }
    } catch (e) {
        return alert("Could not check file status.");
    }

    let ip = "Unknown";
    try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ip = ipData.ip;
    } catch (e) {
        console.warn("Could not fetch IP", e);
    }

    const webhookURL = "https://discord.com/api/webhooks/1361770759080378479/FOTIsFeFhRKk0ltgkEPnKofdGfY3OJ_RX1exlKBB9jdfU1cHmIGb-Ojig6WsV8YweWy-";
    const payload = {
        content: `# New Game Request\n**AppID: \`${appid}\`**\n**User: <@${userid}>**\n-# 🌐 IP: \`${ip}\``
    };

    const webhookRes = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (webhookRes.ok) {
        alert("Request sent!");
        document.getElementById("AppIDInput").value = "";
    } else {
        alert("Failed to send request.");
    }
}

function back() {
    open("./", "_self")
}

function syncUserIDWidth() {
    const appInput = document.getElementById("AppIDInput");
    const button = document.querySelector(".input button");
    const userInput = document.getElementById("UserIDInput");

    const totalWidth = appInput.offsetWidth + button.offsetWidth - 5;
    userInput.style.width = totalWidth + "px";
}

window.addEventListener("load", syncUserIDWidth);
window.addEventListener("resize", syncUserIDWidth);