const path = require('path');
const { os, cpu, mem } = require('node-os-utils');
const { ipcRenderer } = require('electron');

// Consts
const LAST_NOTIFY = 'lastNotify';

let cpuOverload;
let alertFrequency;

// Get settings
ipcRenderer.on('settings-get', (e, settings) => {
    cpuOverload = +settings.cpuOverload;
    alertFrequency = +settings.alertFrequency;
})

// Run every 2 seconds
setInterval(() => {
    // CPU Usage
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText = info + '%';

        const cpuProgress = document.getElementById('cpu-progress');
        cpuProgress.style.width = info + '%';

        if (info > cpuOverload) {
            cpuProgress.style.backgroundColor = 'red';
        } else {
            cpuProgress.style.backgroundColor = '#30c88b';
        }

        // Check CPU overload
        if (info > cpuOverload && runNotify(alertFrequency)) {
            notifyUser({
                title: "CPU Overload",
                body: `CPU is over ${cpuOverload}%`,
                icon: path.join(__dirname, 'img', 'icon.png')
            });

            localStorage.setItem(LAST_NOTIFY, Date.now());
        }
    });

    // CPU Free
    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = info.toFixed(2) + '%';
    });

    // Uptime
    document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
}, 1000)

// Set model
document.getElementById('cpu-model').innerText = cpu.model();

// Computer name
document.getElementById('comp-name').innerText = os.hostname();

// OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

// Total memory
mem.info().then(info => {
    document.getElementById('mem-total').innerText = `${Math.ceil(info.totalMemMb / 1024)} GB`;
});

// Show days, hours, min, sec
function secondsToDhms(seconds) {
    seconds = +seconds;
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d, ${h}h, ${m}m, ${s}s`;
}

// Send Notification
function notifyUser(options) {
    new Notification(options.title, options)
}

// Check how much time has passed since notification
function runNotify(frequency) {
    if (localStorage.getItem(LAST_NOTIFY === null)) {
        // Store timestamp
        localStorage.setItem(LAST_NOTIFY, Date.now());
        return true;
    };
    const notifyTime = new Date(+localStorage.getItem(LAST_NOTIFY));
    const now = new Date();
    const diffTime = Math.abs(now - notifyTime);
    const minutsPassed = Math.ceil(diffTime / (1000 * 60));

    if (minutsPassed > frequency) {
        return true;
    } else {
        return false;
    }
} 