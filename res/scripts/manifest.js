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

function showToast(message, backgroundColor, duration = 1.5) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.backgroundColor = backgroundColor;
    toast.style.color = "#000000"

    setTimeout(() => {
        toast.style.opacity = "0";
    }, duration * 1000);
}

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

function discordLogin() {
    const clientId = '1324027200042958858';
    const redirectUri = encodeURIComponent('https://blackbay.vercel.app/manifest');
    const scope = encodeURIComponent('identify');
    const discordUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = discordUrl;
}

// On /discord-callback page parse token
function getAccessTokenFromHash() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

async function fetchDiscordUser(token) {
    const res = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return await res.json();
}

async function checkMembership(userId) {
    const res = await fetch(`/api/check-member?userId=${userId}`);
    return res.ok;
}

async function generate() {
    const token = getAccessTokenFromHash();
    if (!token) {
        showToast('Login with Discord first.', '#FF0000');
        return;
    }

    try {
        const user = await fetchDiscordUser(token);
        const isMember = await fetch(`/api/check-member?userId=${user.id}`).then(res => res.ok);
        if (!isMember) {
            showToast('Not in Discord server.', '#FF0000');
            return;
        }
        // User verified, generate app:

        const AppID = document.getElementById("AppIDInput").value.trim();
        if (!AppID) {
            showToast('Please fill all fields.', '#FF0000');
            document.getElementById("AppIDInput").style.borderColor = '#FF0000'
            setTimeout(() => { document.getElementById("AppIDInput").style.borderColor = ""; }, 1500);
            return;
        }
        document.getElementById('genAppID').disabled = true;
        document.getElementById("genAppID").style.borderColor = '#FFFF00'

        const url = `/api/download?appid=${encodeURIComponent(AppID)}`;

        const response = await fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        });
        if (response.status === 200) {
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${AppID}.zip`;

            showToast(`Generated App: ${AppID}`, '#00FF00');
            document.getElementById("genAppID").style.borderColor = ""

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            document.getElementById('genAppID').disabled = false;
            return;
        } else {
            showToast('AppID unavailable or error!', '#FF0000');
            document.getElementById('genAppID').disabled = false;
            return;
        }

    } catch (e) {
        console.error(e);
        showToast('Error verifying Discord user.', '#FF0000');
    }
}


/*async function generate() {
    const AppID = document.getElementById("AppIDInput").value.trim();
    if (!AppID) {
        showToast('Please fill all fields.', '#FF0000');
        document.getElementById("AppIDInput").style.borderColor = '#FF0000'
        setTimeout(() => { document.getElementById("AppIDInput").style.borderColor = ""; }, 1500);
        return;
    }
    document.getElementById('genAppID').disabled = true;
    document.getElementById("genAppID").style.borderColor = '#FFFF00'

    const url = `/api/download?appid=${encodeURIComponent(AppID)}`;

    const response = await fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    });
    if (response.status === 200) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${AppID}.zip`;

        showToast(`Generated App: ${AppID}`, '#00FF00');
        document.getElementById("genAppID").style.borderColor = ""

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        document.getElementById('genAppID').disabled = false;
        return;
    } else {
        showToast('AppID unavailable or error!', '#FF0000');
        document.getElementById('genAppID').disabled = false;
        return;
    }
}*/

function home() {
    open("/", "_self")
}

async function getFileCount() {
    fetch('https://blackbay.vercel.app/api/filecount')
        .then(res => res.json())
        .then(data => {
            document.getElementById("file-count").textContent = data.count;
        });
}

getFileCount();

function requestpage() {
    open("/manifest/request", "_self")
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault();
        alert("nuh uh");
    }
});

window.addEventListener('mousedown', function (e) {
    if (e.button === 2) {
        e.preventDefault();
        alert("Right-click is disabled here.");
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (document.getElementById('genAppID').disabled !== true) {
            generate();
            return;
        }
        else {
            return;
        }
    }
});

function isMobile() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // Base check (user agent)
    const userAgentMatch = /android|iphone|ipad|iPod|blackberry|iemobile|opera mini/i.test(ua);

    // Touch screen check
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 1;

    // Screen dimensions
    const isSmallScreen = Math.max(window.innerWidth, window.innerHeight) <= 800;

    return userAgentMatch || hasTouch || isSmallScreen;
}

if (isMobile()) {
    document.body.innerHTML = "Access denied. Desktop only.";

    // Optional redirect
    // window.location.href = "https://yourdomain.com/desktop-required";
}