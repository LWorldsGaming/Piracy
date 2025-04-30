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
    var URL = "https://blackbay.vercel.app/discord"
    open(URL, "_new")
}

function manifestGen() {
    var URL = "https://blackbay.vercel.app/manifest"
    open(URL, "_self")
}