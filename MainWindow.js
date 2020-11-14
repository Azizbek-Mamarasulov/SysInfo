const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
    constructor(file, isDev) {
        super({
            width: isDev ? 800 : 355,
            height: 600,
            show: true,
            opacity: 0.9,
            resizable: isDev,
            icon: "./assets/icons/icon.png",
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.loadFile(file);
        if (isDev) {
            this.webContents.openDevTools();
        }
    }
}

module.exports = MainWindow;