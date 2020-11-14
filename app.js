const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const Store = require('./Store');
const MainWindow = require('./MainWindow');
const AboutWindow = require('./AboutWindow');
const AppTray = require('./AppTray');

// process.env.NODE_ENV = 'development';
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

let mainWindow;
let tray = null;

// Init store & defaults
const store = new Store({
    configName: "userSettings",
    defaults: {
        settings: {
            cpuOverload: 80,
            alertFrequency: 5
        }
    }
});

function createMainWindow() {
    mainWindow = new MainWindow('./src/index.html', isDev);
}

function createAboutWindow() {
    new AboutWindow('./src/about.html', isDev);
}

app.whenReady().then(() => {
    createMainWindow();

    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.webContents.send('settings-get', store.get('settings'));
    })

    const template = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(template);

    const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png');

    tray = new AppTray(icon, mainWindow);

    mainWindow.on('ready', () => mainWindow = null);
    mainWindow.on('close', (e) => {
        if (app.quitting) {
            app.quit()
        } else {
            e.preventDefault();
            mainWindow.hide();
        }
    })
});


// Set settigns
ipcMain.on('settings-set', (e, data) => {
    store.set('settings', data);
    mainWindow.webContents.send('settings-get', store.get('settings'));
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
})

const menuTemplate = [
    ...(isMac ? [
        {
            label: app.name,
            submenu: [
                {
                    label: "About",
                    click: createAboutWindow
                }
            ]
        }
    ] : []),
    {
        label: "File",
        submenu: [
            {
                label: "Exit",
                click: () => {
                    app.quitting = true;
                    app.quit();
                }
            }
        ]
    },
    {
        label: "View",
        submenu: [
            {
                label: "Toggle Navigation",
                click: () => mainWindow.webContents.send('nav-toggle')
            }
        ]
    },
    ...(isDev ? [{
        label: "Development",
        submenu: [
            {
                role: "reload"
            },
            {
                role: "forceReload"
            },
            {
                type: "separator"
            },
            {
                role: "toggleDevTools"
            }
        ]
    }] : []),
    ...(!isMac ? [
        {
            label: "Help",
            submenu: [
                {
                    label: "About",
                    click: createAboutWindow
                }
            ]
        }
    ] : [])
];