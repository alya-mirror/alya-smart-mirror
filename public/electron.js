/* Alya Smart Mirror
 * Global process
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Prevent the monitor from going to sleep.
electron.powerSaveBlocker.start('prevent-display-sleep');

const path = require('path');
const autoUpdater = require('electron-updater').autoUpdater;
const notifier = require('node-notifier');

// Launching the mirror in dev mode
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    // Get the displays and render the mirror on a secondary screen if it exists
    const atomScreen = electron.screen;
    const displays = atomScreen.getAllDisplays();
    let externalDisplay = null;
    displays.forEach((display) => {
        if (display.bounds.x > 0 || display.bounds.y > 0) {
            externalDisplay = display;
        }
    });

    const browserWindowOptions = {
        width: 800,
        height: 600,
        icon: 'favicon.ico',
        kiosk: !isDev,
        autoHideMenuBar: true,
        darkTheme: true
    };
    if (externalDisplay) {
        browserWindowOptions.x = externalDisplay.bounds.x + 50;
        browserWindowOptions.y = externalDisplay.bounds.y + 50;
    }

    // Create the browser window.
    mainWindow = new BrowserWindow(browserWindowOptions);

    // and load the index.html of the app.
    mainWindow.loadURL(isDev ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', () => (mainWindow = null));

    initAutoUpdate();
}

function initAutoUpdate() {
    if (isDev) {
        return;
    }

    if (process.platform === 'linux') {
        return;
    }

    autoUpdater.checkForUpdates();
    autoUpdater.signals.updateDownloaded(showUpdateNotification);
}

function showUpdateNotification(it) {
    it = it || {};
    const restartNowAction = 'Restart now';

    const versionLabel = it.label ? `Version ${it.version}` : 'The latest version';

    notifier.notify(
        {
            title: 'A new update is ready to install.',
            message: `${versionLabel} has been downloaded and will be automatically installed after restart.`,
            closeLabel: 'Okay',
            actions: restartNowAction
        },
        function(err, response, metadata) {
            if (err) throw err;
            if (metadata.activationValue !== restartNowAction) {
                return;
            }
            autoUpdater.quitAndInstall();
        }
    );
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});
