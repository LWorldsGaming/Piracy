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

async function request() {
    const userid = document.getElementById("UserIDInput").value.trim();
    const appid = document.getElementById("AppIDInput").value.trim();

    if (!userid && !appid) {
        showToast('Please fill all fields.', '#FF0000');
        document.getElementById("UserIDInput").style.borderColor = '#FF0000';
        document.getElementById("AppIDInput").style.borderColor = '#FF0000';
        setTimeout(() => document.getElementById("UserIDInput").style.borderColor = "", 1500);
        setTimeout(() => document.getElementById("AppIDInput").style.borderColor = "", 1500);
        return;
    }

    if (!userid) {
        showToast('Please fill all fields.', '#FF0000');
        document.getElementById("UserIDInput").style.borderColor = '#FF0000';
        setTimeout(() => document.getElementById("UserIDInput").style.borderColor = "", 1500);
        return;
    }

    if (!appid) {
        showToast('Please fill all fields.', '#FF0000');
        document.getElementById("AppIDInput").style.borderColor = '#FF0000';
        setTimeout(() => document.getElementById("AppIDInput").style.borderColor = "", 1500);
        return;
    }

    try {
        const res = await fetch('/api/request', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appid, userid })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.error || 'An error occurred.', '#FF0000');
            document.getElementById("submitRequest").style.borderColor = '#FF0000';
            setTimeout(() => document.getElementById("submitRequest").style.borderColor = "", 1500);
            return;
        }

        if (data.message === "Game already available.") {
            showToast(data.message, "#FFFF00");
            document.getElementById("AppIDInput").style.borderColor = '#FFFF00';
            setTimeout(() => document.getElementById("AppIDInput").style.borderColor = "", 1500);
        } else {
            showToast('Request sent!', '#00FF00');
            document.getElementById("AppIDInput").value = "";
            document.getElementById("submitRequest").style.borderColor = '#00FF00';
            setTimeout(() => document.getElementById("submitRequest").style.borderColor = "", 1500);
        }

    } catch (err) {
        showToast('Something went wrong.', '#FF0000');
        console.error(err);
    }
}

function back() {
    open("/manifest", "_self")
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

if (isMobileAdvanced()) {
    document.body.innerHTML = `
      <style>body { margin: 0; background: black; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; }</style>
      Access denied. Desktop only.
    `;

    // Optional redirect
    // window.location.href = "https://yourdomain.com/desktop-required";
}