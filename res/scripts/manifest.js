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

async function generate() {
    document.getElementById('genAppID').disabled = true;

    let AppID = document.getElementById("AppIDInput").value;
    if (AppID !== "") {
        const url = `https://raw.githubusercontent.com/plxt79/database/main/Games%20ZIPs/${AppID}.zip`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        if (response.status === 200) {
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `${AppID}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(1500);
            
            document.getElementById('genAppID').disabled = false;
        } else {
            alert("AppID unavailable!");
        }
    }
    else {
        alert("Input cannot be empty!");
    }
}

function home() {
    open("/", "_self")
}

async function getFileCount() {
    const apiUrl = "https://api.github.com/repos/plxt79/database/contents/Games%20ZIPs";

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const fileCount = Array.isArray(data) ? data.length : 0;
        document.getElementById("file-count").textContent = fileCount;
    } catch (error) {
        document.getElementById("file-count").textContent = "Error";
    }
}
getFileCount();

function requestpage() {
    open("https://blackbay.vercel.app/manifest/request", "_self")
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
        generate();
    }
});