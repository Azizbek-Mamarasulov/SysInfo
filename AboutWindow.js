const { BrowserWindow } = require("electron");

class AboutWindow extends BrowserWindow {
    constructor(file, isDev) {
        super({
            width: 400,
            height: 400,
            opacity: 0.9,
            resizable: isDev,
            icon: "./assets/icons/icon.png",
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true
            }
        })
        this.loadFile(file);
        this.removeMenu();
    }
}

module.exports = AboutWindow;