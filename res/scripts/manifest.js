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

async function generate() {
    let input = document.getElementById("AppIDInput").value.trim();

    const urlMatch = input.match(/^https?:\/\/store\.steampowered\.com\/app\/(\d+)/);
    const isNumeric = /^\d+$/.test(input);
    const AppID = urlMatch ? urlMatch[1] : (isNumeric ? input : null);

    if (!AppID) {
        showToast('Invalid input.', '#FF0000');
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
}

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
    const key = e.key.toUpperCase();

    const isBlocked =
        key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (key === 'I' || key === 'J' || key === 'C'));

    if (isBlocked) {
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