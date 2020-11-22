const { Tray, Menu, app } = require("electron");

class AppTray extends Tray {
    constructor(icon, mainWindow, isMac) {
        super(icon);
        const trayContextMenu = Menu.buildFromTemplate([
            {
                label: isMac ? "Quit" : "Exit",
                click: () => {
                    console.log(1)
                    app.quitting = true;
                    app.quit();
                }
            }
        ]);
        this.mainWindow = mainWindow;
        this.setToolTip(app.name);
        this.setContextMenu(trayContextMenu);
        this.on('click', this.onClick);
    }

    onClick = () => {
        if (this.mainWindow.isVisible() === true) {
            this.mainWindow.hide();
        } else {
            this.mainWindow.show();
        }
    }
}

module.exports = AppTray;