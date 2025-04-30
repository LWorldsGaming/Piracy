async function generate() {
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
    }
});

window.addEventListener('mousedown', function (e) {
    if (e.button === 2) {
        e.preventDefault();
        alert("Right-click is disabled here.");
    }
});