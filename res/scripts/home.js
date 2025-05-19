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

function joinDiscord() {
    var URL = "/discord"
    open(URL, "_new")
}

function manifestGen() {
    var URL = "/manifest"
    open(URL, "_self")
}

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