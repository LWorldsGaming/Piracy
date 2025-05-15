const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let posX = 0, posY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateFollower() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;

    follower.style.left = posX + 'px';
    follower.style.top = posY + 'px';

    requestAnimationFrame(animateFollower);
}

animateFollower();

document.querySelectorAll('a, button, a').forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.transform = 'translate(-50%, -50%) scale(2)';
        follower.style.background = 'rgba(0, 0, 0, 0)';
        follower.style.border = '#0080ff 1px solid';
    });

    el.addEventListener('mouseleave', () => {
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.background = '#0080ff';
    });
});

async function request() {
    const appid = document.getElementById("AppIDInput").value.trim();
    const userid = document.getElementById("UserIDInput").value.trim();
    if (!appid) return alert("Please enter a valid AppID");
    if (userid === "") return alert("Please enter your Discord UserID");

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
        document.getElementById("AppIDInput").value = "";
        document.getElementById("submitRequest").style.borderColor = '#00FF00'
        setTimeout(() => { document.getElementById("submitRequest").style.borderColor = '#404040DD'; }, 1000);
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

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        request();
    }
});

window.addEventListener("load", syncUserIDWidth);
window.addEventListener("resize", syncUserIDWidth);